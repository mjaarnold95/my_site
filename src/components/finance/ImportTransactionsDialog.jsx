import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';

const ImportTransactionsDialog = ({ isOpen, setIsOpen, accounts, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [accountId, setAccountId] = useState('');
  const [parsedData, setParsedData] = useState({ data: [], meta: { fields: [] } });
  const [fieldMappings, setFieldMappings] = useState({});

  const targetFields = [
    { value: 'date', label: 'Date' },
    { value: 'description', label: 'Description' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
    { value: 'type', label: 'Type (income/expense)' },
  ];

  const resetState = () => {
    setStep(1);
    setFile(null);
    setAccountId('');
    setParsedData({ data: [], meta: { fields: [] } });
    setFieldMappings({});
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    setIsOpen(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        preview: 100,
        complete: (results) => {
          setParsedData(results);
          const initialMappings = {};
          results.meta.fields.forEach(field => {
            const lowerField = field.toLowerCase();
            const foundTarget = targetFields.find(tf => lowerField.includes(tf.value));
            initialMappings[field] = foundTarget ? foundTarget.value : 'skip';
          });
          setFieldMappings(initialMappings);
        }
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!file || !accountId) {
        toast({ title: "Error", description: "Please select a file and an account.", variant: "destructive" });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!fieldMappings.amount || !fieldMappings.date || !fieldMappings.description) {
         toast({ title: "Mapping Error", description: "You must map Amount, Date, and Description fields.", variant: "destructive" });
         return;
      }
      setStep(3);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const transactionsToInsert = parsedData.data.map(row => {
        const newTransaction = {
          user_id: user.id,
          account_id: accountId,
          metadata: {}
        };

        for (const csvField in fieldMappings) {
          const targetField = fieldMappings[csvField];
          if (targetField === 'skip' || !row[csvField]) continue;

          if (targetFields.some(tf => tf.value === targetField)) {
            let value = row[csvField];
            if (targetField === 'amount') {
              value = parseFloat(value.replace(/[^0-9.-]+/g,""));
              if (isNaN(value)) continue;
              newTransaction.type = value >= 0 ? 'income' : 'expense';
              newTransaction.amount = Math.abs(value);
            } else if (targetField === 'date') {
              value = new Date(value).toISOString();
              if (value === 'Invalid Date') continue;
            }
            newTransaction[targetField] = value;
          } else {
            newTransaction.metadata[targetField] = row[csvField];
          }
        }
        
        if (!newTransaction.category) newTransaction.category = 'Uncategorized';
        if (!newTransaction.type) newTransaction.type = 'expense';

        return newTransaction.amount && newTransaction.date && newTransaction.description ? newTransaction : null;
      }).filter(Boolean);

      if (transactionsToInsert.length === 0) {
        toast({ title: "Import Failed", description: "No valid transactions could be processed from the file.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('transactions').insert(transactionsToInsert);

      if (error) throw error;

      toast({ title: "Import Successful!", description: `${transactionsToInsert.length} transactions have been imported.` });
      onSuccess();
      handleClose();
    } catch (error) {
      toast({ title: "Error importing transactions", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };
  
  const previewData = useMemo(() => {
    if (step !== 3) return [];
    return parsedData.data.slice(0, 3).map(row => {
      const newTransaction = { metadata: {} };
      for (const csvField in fieldMappings) {
        const targetField = fieldMappings[csvField];
        if (targetField === 'skip') continue;
        if (targetFields.some(tf => tf.value === targetField)) {
          newTransaction[targetField] = row[csvField];
        } else {
          newTransaction.metadata[targetField] = row[csvField];
        }
      }
      return newTransaction;
    });
  }, [step, parsedData.data, fieldMappings]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border-white/10 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">Import Transactions (Step {step} of 3)</DialogTitle>
          <DialogDescription className="text-white/70">
            {step === 1 && "Select an account and upload your CSV file."}
            {step === 2 && "Map the columns from your file to the transaction fields."}
            {step === 3 && "Review the data and confirm the import."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white">Target Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select an account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">CSV File</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-white/60" />
                  <div className="mt-4 flex text-sm leading-6 text-white/60">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:text-indigo-300">
                      <span>Upload a file</span>
                      <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-white/60">CSV up to 10MB</p>
                  {file && <p className="text-sm text-indigo-400 mt-2">{file.name}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-white mb-4">For each column in your CSV, select a destination field or choose to skip it.</p>
            <div className="grid grid-cols-2 gap-4">
              {parsedData.meta.fields.map(field => (
                <div key={field} className="space-y-2">
                  <Label className="text-white">{field}</Label>
                  <Select
                    value={fieldMappings[field]}
                    onValueChange={(value) => setFieldMappings(prev => ({ ...prev, [field]: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip this column</SelectItem>
                      {targetFields.map(tf => (
                        <SelectItem key={tf.value} value={tf.value} disabled={Object.values(fieldMappings).includes(tf.value) && fieldMappings[field] !== tf.value}>
                          {tf.label}
                        </SelectItem>
                      ))}
                      <SelectItem value={field}>Create new field "{field}"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-white mb-4">Here's a preview of how your data will be imported. Custom fields will be stored in metadata.</p>
            <div className="space-y-2">
              {previewData.map((row, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-md text-xs text-white/80">
                  <pre>{JSON.stringify(row, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="text-white border-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          {step < 3 && (
            <Button onClick={handleNextStep} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleImport} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={loading}>
              {loading ? 'Importing...' : 'Confirm and Import'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionsDialog;
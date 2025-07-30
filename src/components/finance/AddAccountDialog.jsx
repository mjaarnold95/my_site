import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AddAccountDialog = ({ isOpen, setIsOpen, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: 'checking',
    balance: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.institution || !formData.balance) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('accounts').insert({
      ...formData,
      balance: parseFloat(formData.balance),
      user_id: user.id
    });

    if (error) {
      toast({ title: "Error adding account", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account Added!", description: "Your new account has been added." });
      setFormData({ name: '', institution: '', type: 'checking', balance: '' });
      setIsOpen(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Account Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Everyday Checking" />
          </div>
          <div>
            <Label className="text-white">Financial Institution</Label>
            <Input value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Bank of America" />
          </div>
          <div>
            <Label className="text-white">Account Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white">Current Balance</Label>
            <Input type="number" step="0.01" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="0.00" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
            {loading ? 'Adding...' : 'Add Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountDialog;
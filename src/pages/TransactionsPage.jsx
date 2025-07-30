import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TransactionItem from '@/components/finance/TransactionItem';
import ImportTransactionsDialog from '@/components/finance/ImportTransactionsDialog';

const TransactionsPage = ({ transactions, accounts, setIsAddTransactionOpen, isLoading, onSuccess }) => {
  const [isImportOpen, setIsImportOpen] = useState(false);

  if (isLoading) {
    return <div className="text-white text-center">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">All Transactions</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input placeholder="Search transactions..." className="pl-10 bg-white/5 border-white/10 text-white w-64" />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button onClick={() => setIsImportOpen(true)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
          <Button onClick={() => setIsAddTransactionOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="space-y-3">
          <AnimatePresence>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} accounts={accounts} />
            ))}
          </AnimatePresence>
        </div>
      </Card>
      <ImportTransactionsDialog
        isOpen={isImportOpen}
        setIsOpen={setIsImportOpen}
        accounts={accounts}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default TransactionsPage;
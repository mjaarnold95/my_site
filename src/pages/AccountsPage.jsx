import React from 'react';
import { Plus, Landmark, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AccountCard = ({ account }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'checking':
        return <Landmark className="h-6 w-6 text-white" />;
      case 'savings':
        return <DollarSign className="h-6 w-6 text-white" />;
      case 'credit':
        return <CreditCard className="h-6 w-6 text-white" />;
      default:
        return <Landmark className="h-6 w-6 text-white" />;
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
          <div className="p-2 bg-white/10 rounded-md">{getIcon(account.type)}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
          <p className="text-xs text-white/60">{account.institution} - {account.type}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AccountsPage = ({ accounts, setIsAddAccountOpen, isLoading }) => {
  if (isLoading) {
    return <div className="text-white text-center">Loading accounts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Accounts</h2>
        <Button onClick={() => setIsAddAccountOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
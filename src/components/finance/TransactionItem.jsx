import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Landmark } from 'lucide-react';

const TransactionItem = ({ transaction, accounts }) => {
  const account = accounts?.find(acc => acc.id === transaction.account_id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {transaction.type === 'income' ? (
            <Plus className="h-4 w-4 text-green-400" />
          ) : (
            <Minus className="h-4 w-4 text-red-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{transaction.description}</p>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <span>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</span>
            {account && (
              <div className="flex items-center text-xs">
                <Landmark className="h-3 w-3 mr-1" />
                <span>{account.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </div>
    </motion.div>
  );
};

export default TransactionItem;
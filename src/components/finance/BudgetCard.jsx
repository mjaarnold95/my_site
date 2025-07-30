import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const BudgetCard = ({ budget }) => {
  const percentage = budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0;
  const isOverBudget = percentage > 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{budget.category}</h3>
        <Badge variant={isOverBudget ? "destructive" : "secondary"}>
          {percentage.toFixed(0)}%
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Spent</span>
          <span className="text-white">${budget.spent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Budget</span>
          <span className="text-white">${budget.budget.toFixed(2)}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : budget.color || 'bg-blue-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
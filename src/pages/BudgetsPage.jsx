import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BudgetCard from '@/components/finance/BudgetCard';

const BudgetsPage = ({ budgets, setIsAddBudgetOpen, isLoading }) => {
  if (isLoading) {
    return <div className="text-white text-center">Loading budgets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Budget Management</h2>
        <Button onClick={() => setIsAddBudgetOpen(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Create Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default BudgetsPage;
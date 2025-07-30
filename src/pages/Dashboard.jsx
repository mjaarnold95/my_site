import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Target, Plus, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/finance/StatCard';
import TransactionItem from '@/components/finance/TransactionItem';
import BudgetCard from '@/components/finance/BudgetCard';
import GoalCard from '@/components/finance/GoalCard';

const Dashboard = ({
  transactions,
  budgets,
  goals,
  accounts,
  setIsAddTransactionOpen,
  setIsAddBudgetOpen,
  setIsAddGoalOpen,
  isLoading,
}) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (isLoading) {
    return <div className="text-white text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Worth"
          value={`$${netWorth.toFixed(2)}`}
          icon={DollarSign}
          trend={12.5}
          color="from-emerald-600 to-teal-600"
          subtitle="Across all accounts"
        />
        <StatCard
          title="Monthly Income"
          value={`$${totalIncome.toFixed(2)}`}
          icon={TrendingUp}
          trend={8.2}
          color="from-blue-600 to-cyan-600"
          subtitle="This month"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          icon={TrendingDown}
          trend={-3.1}
          color="from-purple-600 to-pink-600"
          subtitle="This month"
        />
        <StatCard
          title="Savings Rate"
          value={`${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%`}
          icon={Target}
          trend={5.7}
          color="from-orange-600 to-red-600"
          subtitle="Of income"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              <Button onClick={() => setIsAddTransactionOpen(true)} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} accounts={accounts} />
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Budget Overview</h2>
              <Button onClick={() => setIsAddBudgetOpen(true)} size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            <div className="space-y-4">
              {budgets.slice(0, 4).map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Financial Goals</h2>
            <Button onClick={() => setIsAddGoalOpen(true)} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" /> Add Goal
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
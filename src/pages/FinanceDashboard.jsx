import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Receipt, BarChart3, Goal, Landmark } from 'lucide-react';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import BudgetsPage from '@/pages/BudgetsPage';
import GoalsPage from '@/pages/GoalsPage';
import AccountsPage from '@/pages/AccountsPage';
import AddTransactionDialog from '@/components/finance/AddTransactionDialog';
import AddBudgetDialog from '@/components/finance/AddBudgetDialog';
import AddGoalDialog from '@/components/finance/AddGoalDialog';
import AddAccountDialog from '@/components/finance/AddAccountDialog';

const FinanceDashboard = ({ transactions, budgets, goals, accounts, fetchData, isLoading }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white/20 text-white">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white/20 text-white">
              <Receipt className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:bg-white/20 text-white">
              <Landmark className="h-4 w-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="budgets" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Budgets
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-white/20 text-white">
              <Goal className="h-4 w-4 mr-2" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              accounts={accounts}
              setIsAddTransactionOpen={setIsAddTransactionOpen}
              setIsAddBudgetOpen={setIsAddBudgetOpen}
              setIsAddGoalOpen={setIsAddGoalOpen}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionsPage
              transactions={transactions}
              accounts={accounts}
              setIsAddTransactionOpen={setIsAddTransactionOpen}
              isLoading={isLoading}
              onSuccess={fetchData}
            />
          </TabsContent>
          <TabsContent value="accounts">
            <AccountsPage
              accounts={accounts}
              setIsAddAccountOpen={setIsAddAccountOpen}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="budgets">
            <BudgetsPage
              budgets={budgets}
              setIsAddBudgetOpen={setIsAddBudgetOpen}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="goals">
            <GoalsPage
              goals={goals}
              setIsAddGoalOpen={setIsAddGoalOpen}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
        <Outlet />
      </main>

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        setIsOpen={setIsAddTransactionOpen}
        onSuccess={fetchData}
        accounts={accounts}
      />
      <AddBudgetDialog
        isOpen={isAddBudgetOpen}
        setIsOpen={setIsAddBudgetOpen}
        onSuccess={fetchData}
      />
      <AddGoalDialog
        isOpen={isAddGoalOpen}
        setIsOpen={setIsAddGoalOpen}
        onSuccess={fetchData}
      />
      <AddAccountDialog
        isOpen={isAddAccountOpen}
        setIsOpen={setIsAddAccountOpen}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default FinanceDashboard;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AuthPage from '@/pages/AuthPage';
import FinanceDashboard from '@/pages/FinanceDashboard';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

function App() {
  const { session, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchData = async () => {
    if (!session) return;
    setIsLoadingData(true);
    try {
      const [transactionsRes, budgetsRes, goalsRes, accountsRes] = await Promise.all([
        supabase.from('transactions').select('*, accounts(*)').order('date', { ascending: false }),
        supabase.from('budgets').select('*'),
        supabase.from('goals').select('*'),
        supabase.from('accounts').select('*')
      ]);

      if (transactionsRes.error) throw transactionsRes.error;
      if (budgetsRes.error) throw budgetsRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (accountsRes.error) throw accountsRes.error;

      const transactionsWithSpent = await Promise.all(budgetsRes.data.map(async (budget) => {
        const { data, error } = await supabase
          .from('transactions')
          .select('amount')
          .eq('category', budget.category)
          .eq('type', 'expense');
        
        if (error) return { ...budget, spent: 0 };
        
        const spent = data.reduce((acc, t) => acc + t.amount, 0);
        return { ...budget, spent };
      }));

      setTransactions(transactionsRes.data);
      setBudgets(transactionsWithSpent);
      setGoals(goalsRes.data);
      setAccounts(accountsRes.data);

    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      setIsLoadingData(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Personal Finance Manager - Track Your Money</title>
        <meta name="description" content="Comprehensive personal finance application to track expenses, manage budgets, and achieve financial goals." />
      </Helmet>
      <Routes>
        <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        <Route 
          path="/*" 
          element={
            session ? (
              <FinanceDashboard
                transactions={transactions}
                budgets={budgets}
                goals={goals}
                accounts={accounts}
                fetchData={fetchData}
                isLoading={isLoadingData}
              />
            ) : (
              <Navigate to="/auth" />
            )
          } 
        />
        <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/auth" />} />
        <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
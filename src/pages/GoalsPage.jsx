import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoalCard from '@/components/finance/GoalCard';

const GoalsPage = ({ goals, setIsAddGoalOpen, isLoading }) => {
  if (isLoading) {
    return <div className="text-white text-center">Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Financial Goals</h2>
        <Button onClick={() => setIsAddGoalOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="h-4 w-4 mr-2" /> Create Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
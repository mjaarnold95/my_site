import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const GoalCard = ({ goal }) => {
  const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const remaining = goal.target - goal.current;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{goal.title}</h3>
        <Badge variant="outline" className="text-white border-white/20">
          {percentage.toFixed(0)}%
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Progress</span>
          <span className="text-white">${goal.current.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Target</span>
          <span className="text-white">${goal.target.toFixed(2)}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-white/60 mt-2">
          ${remaining.toFixed(2)} remaining • Due {new Date(goal.deadline).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default GoalCard;
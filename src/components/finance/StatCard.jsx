import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card className={`p-6 bg-gradient-to-br ${color} border-0 shadow-xl backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-300 mr-1" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </Card>
  </motion.div>
);

export default StatCard;
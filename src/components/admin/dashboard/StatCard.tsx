
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  count: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ name, count, change, trend, icon: Icon, color }) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`${color} p-2 rounded-md`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xs ${
              trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {change}
            </span>
            {trend === 'up' ? 
              <ArrowUpIcon className="w-3 h-3 text-emerald-500" /> : 
              <ArrowDownIcon className="w-3 h-3 text-red-500" />
            }
          </div>
        </div>
        <h3 className="mt-3 font-medium">{name}</h3>
        <p className="text-2xl font-semibold mt-1">{count}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;

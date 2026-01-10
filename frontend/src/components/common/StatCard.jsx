import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, color = 'blood-red', trend }) => {
  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-full bg-${color}-light flex items-center justify-center`}>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
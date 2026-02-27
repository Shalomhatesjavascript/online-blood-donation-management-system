import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, color = 'blood-red', trend }) => {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-${color}-light flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${color}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertTriangle, Package } from 'lucide-react';
import { formatDate, calculateDaysUntilExpiration } from '../../utils/helpers';

const StockOverview = ({ stats, expiringUnits }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Blood Stock by Group */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Blood Stock by Group</h2>
        
        <div className="space-y-3">
          {stats?.map((item, index) => (
            <div
              key={item.blood_group}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blood-red flex items-center justify-center">
                  <span className="text-white font-bold">{item.blood_group}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.available_units} {item.available_units === 1 ? 'Unit' : 'Units'}
                  </p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
              </div>

              <Badge variant={
                item.status === 'good' ? 'success' :
                item.status === 'medium' ? 'warning' :
                'danger'
              }>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Expiring Units */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Units Expiring Soon</h2>
          <AlertTriangle className="w-6 h-6 text-warning" />
        </div>

        {expiringUnits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No units expiring in the next 7 days</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expiringUnits.map((unit, index) => {
              const daysLeft = calculateDaysUntilExpiration(unit.expiration_date);
              return (
                <div
                  key={unit.unit_id}
                  className="p-4 bg-danger-light rounded-lg border-l-4 border-danger animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {unit.blood_group} - {unit.storage_location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Donated: {formatDate(unit.donation_date)}
                      </p>
                      <p className="text-sm text-danger-dark font-medium mt-1">
                        Expires: {formatDate(unit.expiration_date)} ({daysLeft} days left)
                      </p>
                    </div>
                    <Badge variant="danger">
                      {daysLeft}d
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StockOverview;
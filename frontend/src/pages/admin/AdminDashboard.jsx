import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { requestService } from '../../services/requestService';
import { Droplet, Users, AlertTriangle, CheckCircle, TrendingUp, Package } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import InventoryManagement from '../../components/admin/InventoryManagement';
import RequestManagement from '../../components/admin/RequestManagement';
import StockOverview from '../../components/admin/StockOverview';
import DonorsManagement from '../../components/admin/DonorsManagement';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [expiringUnits, setExpiringUnits] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stockRes, expiringRes, requestsRes] = await Promise.all([
        inventoryService.getStockStats(),
        inventoryService.getExpiringUnits(),
        requestService.getRequests({ status: 'pending' })
      ]);

      setStats(stockRes.data);
      setExpiringUnits(expiringRes.data);
      setPendingRequests(requestsRes.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading admin dashboard..." />;
  }

  const totalUnits = stats?.reduce((sum, item) => sum + item.available_units, 0) || 0;
  const lowStockCount = stats?.filter(item => item.status === 'low').length || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'requests', label: 'Requests', icon: Users },
    { id: 'donors', label: 'Donors', icon: Users } 
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage blood inventory and requests</p>
        </div>

        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            className="mb-6 animate-fadeIn"
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Droplet}
            label="Total Blood Units"
            value={totalUnits}
            color="blood-red"
          />
          <StatCard
            icon={AlertTriangle}
            label="Low Stock Items"
            value={lowStockCount}
            color="warning"
          />
          <StatCard
            icon={Package}
            label="Expiring Soon"
            value={expiringUnits.length}
            color="danger"
          />
          <StatCard
            icon={Users}
            label="Pending Requests"
            value={pendingRequests.length}
            color="medical-blue"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blood-red text-blood-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {tab.label}
                    {tab.id === 'requests' && pendingRequests.length > 0 && (
                      <span className="ml-2 bg-blood-red text-white text-xs rounded-full px-2 py-0.5">
                        {pendingRequests.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <StockOverview 
              stats={stats} 
              expiringUnits={expiringUnits}
              onRefresh={fetchDashboardData}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryManagement onRefresh={fetchDashboardData} />
          )}
          {activeTab === 'requests' && (
            <RequestManagement 
              requests={pendingRequests}
              onRefresh={fetchDashboardData}
            />
          )}
           {activeTab === 'donors' && (
          <DonorsManagement /> // NEW TAB CONTENT
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
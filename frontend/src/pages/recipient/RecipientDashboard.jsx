import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { requestService } from '../../services/requestService';
import { donorService } from '../../services/donorService';
import { Search, Plus, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { formatDate, timeAgo, getStatusColor, getUrgencyColor } from '../../utils/helpers';
import CreateRequestModal from '../../components/recipient/CreateRequestModal';
import SearchDonorsModal from '../../components/recipient/SearchDonorsModal';

const RecipientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequests();
      setRequests(response.data);
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to load requests'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    try {
      await requestService.cancelRequest(requestId);
      setAlertMessage({
        type: 'success',
        message: 'Request cancelled successfully'
      });
      fetchRequests();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel request'
      });
    }
  };

  const handleRequestCreated = () => {
    setShowCreateModal(false);
    setAlertMessage({
      type: 'success',
      message: 'Blood request submitted successfully!'
    });
    fetchRequests();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const totalRequests = requests.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Blood Request Dashboard
            </h1>
            <p className="text-gray-600">Manage your blood requests and search for donors</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2"
            >
              <Search size={20} />
              Search Donors
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              New Request
            </Button>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={AlertCircle}
            label="Total Requests"
            value={totalRequests}
            color="blood-red"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={pendingRequests}
            color="warning"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={approvedRequests}
            color="success"
          />
        </div>

        {/* Requests List */}
        <Card className="p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Blood Requests</h2>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No requests yet</p>
              <p className="text-gray-400 text-sm mt-2 mb-4">
                Create your first blood request to get started
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => (
                <div
                  key={request.request_id}
                  className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-fadeIn border-l-4 border-blood-red"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left - Request Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-12 h-12 rounded-full bg-blood-red flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {request.blood_group}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {request.units_needed} {request.units_needed === 1 ? 'Unit' : 'Units'} Needed
                          </p>
                          <p className="text-sm text-gray-500">
                            Requested {timeAgo(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Hospital:</span>
                          <span className="font-medium text-gray-900">{request.hospital_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Urgency:</span>
                          <Badge variant={
                            request.urgency_level === 'high' ? 'danger' :
                            request.urgency_level === 'medium' ? 'warning' :
                            'success'
                          }>
                            {request.urgency_level}
                          </Badge>
                        </div>
                      </div>

                      {request.admin_notes && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-900">{request.admin_notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right - Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <Badge variant={
                        request.status === 'pending' ? 'warning' :
                        request.status === 'approved' ? 'success' :
                        request.status === 'rejected' ? 'danger' :
                        'info'
                      }>
                        {request.status}
                      </Badge>

                      {request.status === 'approved' && request.approved_at && (
                        <p className="text-xs text-gray-500">
                          Approved {formatDate(request.approved_at)}
                        </p>
                      )}

                      {request.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelRequest(request.request_id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}

      {showSearchModal && (
        <SearchDonorsModal
          onClose={() => setShowSearchModal(false)}
        />
      )}
    </div>
  );
};

export default RecipientDashboard;
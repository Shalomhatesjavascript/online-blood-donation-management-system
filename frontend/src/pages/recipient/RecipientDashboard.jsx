import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { requestService } from '../../services/requestService';
import { Search, Plus, AlertCircle, Clock, CheckCircle, Download, MessageSquare, Package } from 'lucide-react';

import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

import { formatDate, timeAgo } from '../../utils/helpers';
import { exportToCSV } from '../../utils/exportCSV';

import CreateRequestModal from '../../components/recipient/CreateRequestModal';
import SearchDonorsModal from '../../components/recipient/SearchDonorsModal';
import SubmitComplaintModal from '../../components/common/SubmitComplaintModal';
import ComplaintsList from '../../components/common/ComplaintsList';

import { useToast } from '../../hooks/useToast';

const RecipientDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [complaintsRefresh, setComplaintsRefresh] = useState(0);
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
        message: 'Failed to load requests',
      });
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //   Delivery Status Helper
  // ────────────────────────────────────────────────
  const getDeliveryStatus = (request) => {
    if (!request.estimated_delivery_time) return null;

    const now = new Date();
    const estimatedTime = new Date(request.estimated_delivery_time);
    const deliveredTime = request.delivered_at ? new Date(request.delivered_at) : null;

    if (request.status === 'delivered') {
      return {
        icon: CheckCircle,
        color: 'success',
        message: `Delivered at ${formatDate(deliveredTime)}`,
        showTimer: false,
      };
    }

    if (request.status === 'approved' && now < estimatedTime) {
      const minutesLeft = Math.ceil((estimatedTime - now) / 60000);
      return {
        icon: Package,
        color: 'warning',
        message: `In transit - Arriving in ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}`,
        showTimer: true,
        estimatedTime,
      };
    }

    if (request.status === 'approved' && now >= estimatedTime && request.status !== 'delivered') {
      return {
        icon: Package,
        color: 'success',
        message: 'Arriving soon...',
        showTimer: false,
      };
    }

    return null;
  };

  const handleExport = () => {
    if (requests.length === 0) {
      toast.warning('No requests to export');
      return;
    }

    const headers = [
      { key: 'request_id', label: 'Request ID' },
      { key: 'blood_group', label: 'Blood Group' },
      { key: 'units_needed', label: 'Units Needed' },
      { key: 'urgency_level', label: 'Urgency' },
      { key: 'hospital_location', label: 'Hospital' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Request Date' },
      { key: 'approved_at', label: 'Approved Date' },
      { key: 'admin_notes', label: 'Admin Notes' },
    ];

    exportToCSV(requests, 'blood_requests', headers);
    toast.success('Requests exported successfully!');
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    try {
      await requestService.cancelRequest(requestId);
      setAlertMessage({
        type: 'success',
        message: 'Request cancelled successfully',
      });
      fetchRequests();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel request',
      });
    }
  };

  const handleRequestCreated = () => {
    setShowCreateModal(false);
    setAlertMessage({
      type: 'success',
      message: 'Blood request submitted successfully!',
    });
    fetchRequests();
  };

  const handleComplaintSubmitted = () => {
    setShowComplaintModal(false);
    setComplaintsRefresh((prev) => prev + 1);
    toast.success('Feedback submitted successfully');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const approvedRequests = requests.filter((r) => r.status === 'approved').length;
  const totalRequests = requests.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blood Request Portal</h1>
            <p className="text-gray-600">For hospitals and individuals requesting blood</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowComplaintModal(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Submit Feedback
            </Button>

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

            <Button
              variant="success"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download size={20} />
              Export
            </Button>
          </div>
        </div>

        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            className="mb-6"
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={AlertCircle} label="Total Requests" value={totalRequests} color="blood-red" />
          <StatCard icon={Clock} label="Pending" value={pendingRequests} color="warning" />
          <StatCard icon={CheckCircle} label="Approved" value={approvedRequests} color="success" />
        </div>

        {/* Requests */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Blood Requests</h2>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No requests yet</p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="mt-4 flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => {
                const deliveryInfo = getDeliveryStatus(request);

                return (
                  <div
                    key={request.request_id}
                    className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-fadeIn border-l-4 border-blood-red"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left side - main info */}
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-lg">
                          {request.units_needed} Units • {request.blood_group}
                        </p>

                        <p className="text-sm text-gray-500">
                          Submitted {timeAgo(request.createdAt)} • {user.email}
                        </p>

                        <p className="text-sm text-gray-600">
                          Hospital: {request.hospital_location}
                        </p>

                        {/* ─── Delivery Status Display ─── */}
                        {deliveryInfo && (
                          <div
                            className={`mt-3 p-3 rounded-lg border-2 flex items-center gap-3 ${
                              deliveryInfo.color === 'success'
                                ? 'bg-success-light border-success'
                                : deliveryInfo.color === 'warning'
                                ? 'bg-warning-light border-warning'
                                : 'bg-medical-blue-light border-medical-blue'
                            }`}
                          >
                            <deliveryInfo.icon
                              className={`w-6 h-6 flex-shrink-0 ${
                                deliveryInfo.color === 'success'
                                  ? 'text-success-dark'
                                  : deliveryInfo.color === 'warning'
                                  ? 'text-warning-dark'
                                  : 'text-medical-blue-dark'
                              }`}
                            />
                            <div className="flex-1">
                              <p
                                className={`font-semibold ${
                                  deliveryInfo.color === 'success'
                                    ? 'text-success-dark'
                                    : deliveryInfo.color === 'warning'
                                    ? 'text-warning-dark'
                                    : 'text-medical-blue-dark'
                                }`}
                              >
                                {deliveryInfo.message}
                              </p>
                              {deliveryInfo.showTimer && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Expected at: {new Date(deliveryInfo.estimatedTime).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side - status & actions */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge>{request.status}</Badge>

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
                );
              })}
            </div>
          )}
        </Card>

        {/* Complaints */}
        <div className="mt-8">
          <ComplaintsList refreshTrigger={complaintsRefresh} />
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRequestModal onClose={() => setShowCreateModal(false)} onSuccess={handleRequestCreated} />
      )}

      {showSearchModal && <SearchDonorsModal onClose={() => setShowSearchModal(false)} />}

      {showComplaintModal && (
        <SubmitComplaintModal
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          onSuccess={handleComplaintSubmitted}
        />
      )}
    </div>
  );
};

export default RecipientDashboard;
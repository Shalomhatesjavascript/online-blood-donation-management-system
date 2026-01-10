import React, { useState } from 'react';
import { requestService } from '../../services/requestService';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/helpers';

const RequestManagement = ({ requests, onRefresh }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await requestService.approveRequest(selectedRequest.request_id, { admin_notes: adminNotes });
      setAlertMessage({
        type: 'success',
        message: 'Request approved successfully'
      });
      setShowApproveModal(false);
      setAdminNotes('');
      onRefresh();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to approve request'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await requestService.rejectRequest(selectedRequest.request_id, { admin_notes: adminNotes });
      setAlertMessage({
        type: 'success',
        message: 'Request rejected'
      });
      setShowRejectModal(false);
      setAdminNotes('');
      onRefresh();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to reject request'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
          className="mb-4"
        />
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Blood Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No pending requests</p>
          <p className="text-gray-400 text-sm mt-2">New requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div
              key={request.request_id}
              className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-fadeIn border-l-4"
              style={{
                animationDelay: `${index * 0.05}s`,
                borderLeftColor: request.urgency_level === 'high' ? '#ef4444' :
                                request.urgency_level === 'medium' ? '#f59e0b' : '#10b981'
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left - Request Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-14 h-14 rounded-full bg-blood-red flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{request.blood_group}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {request.units_needed} {request.units_needed === 1 ? 'Unit' : 'Units'} Needed
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested {timeAgo(request.createdAt)} by {request.recipient?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Hospital: </span>
                      <span className="font-medium text-gray-900">{request.hospital_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Urgency: </span>
                      <Badge variant={
                        request.urgency_level === 'high' ? 'danger' :
                        request.urgency_level === 'medium' ? 'warning' : 'success'
                      }>
                        {request.urgency_level}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowApproveModal(true);
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectModal(true);
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowApproveModal(false);
            setAdminNotes('');
          }}
          title="Approve Blood Request"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-success-light rounded-lg border border-success">
              <p className="font-semibold text-gray-900 mb-2">Request Details:</p>
              <p className="text-sm text-gray-700">
                Blood Group: <strong>{selectedRequest.blood_group}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Units Needed: <strong>{selectedRequest.units_needed}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Hospital: <strong>{selectedRequest.hospital_location}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes for the recipient..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blood-red focus:ring-2 focus:ring-blood-red-light resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="success"
                fullWidth
                loading={loading}
                onClick={handleApprove}
              >
                Confirm Approval
              </Button>
              <Button
                variant="outline"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setShowApproveModal(false);
                  setAdminNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowRejectModal(false);
            setAdminNotes('');
          }}
          title="Reject Blood Request"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-danger-light rounded-lg border border-danger">
              <p className="font-semibold text-gray-900 mb-2">Request Details:</p>
              <p className="text-sm text-gray-700">
                Blood Group: <strong>{selectedRequest.blood_group}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Units Needed: <strong>{selectedRequest.units_needed}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Rejection <span className="text-blood-red">*</span>
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blood-red focus:ring-2 focus:ring-blood-red-light resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                loading={loading}
                onClick={handleReject}
                disabled={!adminNotes.trim()}
              >
                Confirm Rejection
              </Button>
              <Button
                variant="outline"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setShowRejectModal(false);
                  setAdminNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default RequestManagement;
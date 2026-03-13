import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { complaintService } from '../../services/complaintService';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import { MessageSquare, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/helpers';

const ViewComplaintModal = ({ complaint, onClose, onUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [adminResponse, setAdminResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState('under_review');
  const [responding, setResponding] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      blood_quality: 'Blood Quality',
      service_delay: 'Service Delay',
      staff_conduct: 'Staff Conduct',
      system_issue: 'System Issue',
      donor_availability: 'Donor Availability',
      request_processing: 'Request Processing',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const handleRespond = async () => {
    if (!adminResponse.trim() || adminResponse.length < 10) {
      toast.error('Response must be at least 10 characters');
      return;
    }

    setResponding(true);
    try {
      await complaintService.respondToComplaint(complaint.complaint_id, {
        admin_response: adminResponse,
        status: responseStatus
      });
      
      toast.success('Response submitted successfully!');
      setShowResponseForm(false);
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit response');
    } finally {
      setResponding(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await complaintService.updateComplaintStatus(complaint.complaint_id, newStatus);
      toast.success('Status updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Complaint Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {complaint.subject}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getCategoryLabel(complaint.category)}>
                  {getCategoryLabel(complaint.category)}
                </Badge>
                <Badge variant={getPriorityColor(complaint.priority)}>
                  Priority: {complaint.priority}
                </Badge>
                <Badge variant={getStatusColor(complaint.status)}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {user.role === 'admin' && complaint.user && (
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-gray-600">Submitted by:</span>
                <span className="font-medium text-gray-900">
                  {complaint.user.Donor?.full_name || complaint.user.email}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">
                {formatDate(complaint.createdAt)}
              </span>
            </div>

            {complaint.user?.role && (
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-gray-500" />
                <span className="text-gray-600">User Type:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {complaint.user.role === 'admin' ? 'Blood Bank Admin' : complaint.user.role}
                </span>
              </div>
            )}

            {user.role === 'admin' && complaint.user?.Donor?.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">
                  {complaint.user.Donor.phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Description:</h4>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
          </div>
        </div>

        {/* Admin Response (if exists) */}
        {complaint.admin_response && (
          <div className="bg-success-light p-4 rounded-lg border-l-4 border-success">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-success-dark mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-success-dark">
                  Blood Bank Response
                </h4>
                <p className="text-xs text-success-dark">
                  {complaint.responded_at && `Responded ${timeAgo(complaint.responded_at)}`}
                  {complaint.admin?.email && ` by ${complaint.admin.email}`}
                </p>
              </div>
            </div>
            <p className="text-gray-900 whitespace-pre-wrap mt-2">
              {complaint.admin_response}
            </p>
          </div>
        )}

        {/* Admin Actions */}
        {user.role === 'admin' && (
          <>
            {!complaint.admin_response && !showResponseForm && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowResponseForm(true)}
              >
                Respond to Complaint
              </Button>
            )}

            {showResponseForm && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Response <span className="text-blood-red">*</span>
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Provide a detailed response to the complaint..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light resize-none"
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light"
                  >
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="success"
                    fullWidth
                    loading={responding}
                    onClick={handleRespond}
                  >
                    Submit Response
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    disabled={responding}
                    onClick={() => {
                      setShowResponseForm(false);
                      setAdminResponse('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Status Update (if already responded) */}
            {complaint.admin_response && complaint.status !== 'closed' && (
              <div className="flex gap-2">
                {complaint.status !== 'resolved' && (
                  <Button
                    variant="success"
                    fullWidth
                    onClick={() => handleUpdateStatus('resolved')}
                  >
                    Mark as Resolved
                  </Button>
                )}
                {complaint.status === 'resolved' && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleUpdateStatus('closed')}
                  >
                    Close Complaint
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Info Note for Users */}
        {user.role !== 'admin' && !complaint.admin_response && (
          <div className="bg-medical-blue-light p-4 rounded-lg border border-medical-blue">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-medical-blue-dark mt-0.5 flex-shrink-0" />
              <p className="text-sm text-medical-blue-dark">
                Your complaint is being reviewed by blood bank administrators. 
                You'll receive a response within 24-48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="outline"
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ViewComplaintModal;
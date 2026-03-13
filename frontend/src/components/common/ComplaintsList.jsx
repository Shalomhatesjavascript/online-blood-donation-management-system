import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import ConfirmModal from './ConfirmModal';
import { MessageSquare, Trash2, Eye, AlertCircle } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/helpers';
import ViewComplaintModal from './ViewComplaintModal';

const ComplaintsList = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [refreshTrigger]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getComplaints();
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setShowViewModal(true);
  };

  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await complaintService.deleteComplaint(complaintToDelete.complaint_id);
      toast.success('Complaint deleted successfully');
      setShowDeleteConfirm(false);
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
    } finally {
      setDeleting(false);
    }
  };

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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {user.role === 'admin' ? 'All Complaints' : 'My Complaints'}
        </h2>

        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No complaints yet</p>
            <p className="text-gray-400 text-sm mt-2">
              {user.role === 'admin' 
                ? 'Complaints from users will appear here' 
                : 'Submit a complaint if you encounter any issues'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint, index) => (
              <div
                key={complaint.complaint_id}
                className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-fadeIn border-l-4"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  borderLeftColor: complaint.priority === 'high' ? '#ef4444' :
                                  complaint.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left - Complaint Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-blood-red mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {complaint.subject}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant={getCategoryLabel(complaint.category)}>
                        {getCategoryLabel(complaint.category)}
                      </Badge>
                      <Badge variant={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                      <Badge variant={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-500">
                      Submitted {timeAgo(complaint.createdAt)}
                      {user.role === 'admin' && complaint.user && (
                        <span> • By: {complaint.user.Donor?.full_name || complaint.user.email}</span>
                      )}
                      {complaint.admin_response && (
                        <span className="text-success"> • Responded</span>
                      )}
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(complaint)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </Button>

                    {user.role !== 'admin' && complaint.status === 'pending' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(complaint)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* View Modal */}
      {showViewModal && selectedComplaint && (
        <ViewComplaintModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowViewModal(false);
            setSelectedComplaint(null);
          }}
          onUpdate={fetchComplaints}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Complaint"
        message={`Are you sure you want to delete this complaint? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
};

export default ComplaintsList;
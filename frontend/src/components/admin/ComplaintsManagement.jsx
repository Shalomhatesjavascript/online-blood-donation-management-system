import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../hooks/useToast';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Select from '../common/Select';
import { MessageSquare, Eye, Filter } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/helpers';
import ViewComplaintModal from '../common/ViewComplaintModal';

const ComplaintsManagement = ({ onRefresh }) => {
  const toast = useToast();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const cleanFilters = {};
      if (filters.status) cleanFilters.status = filters.status;
      if (filters.category) cleanFilters.category = filters.category;
      if (filters.priority) cleanFilters.priority = filters.priority;
      
      const response = await complaintService.getComplaints(cleanFilters);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    fetchComplaints();
    onRefresh();
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

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'blood_quality', label: 'Blood Quality' },
    { value: 'service_delay', label: 'Service Delay' },
    { value: 'staff_conduct', label: 'Staff Conduct' },
    { value: 'system_issue', label: 'System Issue' },
    { value: 'donor_availability', label: 'Donor Availability' },
    { value: 'request_processing', label: 'Request Processing' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complaints & Feedback</h2>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter size={16} />
            <span>Filters:</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={statusOptions}
            placeholder="Filter by status"
          />

          <Select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={categoryOptions}
            placeholder="Filter by category"
          />

          <Select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            options={priorityOptions}
            placeholder="Filter by priority"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No complaints found</p>
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
                  {/* Left - Complaint Info */}
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
                      Submitted by: {complaint.user?.Donor?.full_name || complaint.user?.email} • 
                      {timeAgo(complaint.createdAt)}
                      {complaint.admin_response && (
                        <span className="text-success"> • Responded</span>
                      )}
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(complaint)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      {complaint.admin_response ? 'View' : 'Respond'}
                    </Button>
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
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ComplaintsManagement;
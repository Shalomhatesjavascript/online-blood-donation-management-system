import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Alert from './Alert';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../hooks/useToast';
import { MessageSquare, AlertCircle } from 'lucide-react';

const SubmitComplaintModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    subject: '',
    category: 'other',
    description: '',
    priority: 'medium'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'blood_quality', label: 'Blood Quality Issue' },
    { value: 'service_delay', label: 'Service Delay' },
    { value: 'staff_conduct', label: 'Staff Conduct' },
    { value: 'system_issue', label: 'System/Technical Issue' },
    { value: 'donor_availability', label: 'Donor Availability' },
    { value: 'request_processing', label: 'Request Processing' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await complaintService.createComplaint(formData);
      toast.success('Complaint submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Complaint / Feedback"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief summary of your issue"
          error={errors.subject}
          icon={MessageSquare}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorities}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-blood-red">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about your complaint or feedback..."
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none
              ${errors.description 
                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger-light' 
                : 'border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light'
              }
            `}
            rows={6}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-danger flex items-center gap-1">
              <span>⚠</span> {errors.description}
            </p>
          )}
        </div>

        <div className="bg-medical-blue-light p-4 rounded-lg border border-medical-blue">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-medical-blue-dark mt-0.5 flex-shrink-0" />
            <p className="text-sm text-medical-blue-dark">
              Your complaint will be reviewed by blood bank administrators. 
              You'll receive a response within 24-48 hours.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Submit Complaint
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitComplaintModal;
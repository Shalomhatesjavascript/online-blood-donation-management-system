import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { donorService } from '../../services/donorService';
import { useAuth } from '../../hooks/useAuth';
import { GENDERS, NIGERIAN_STATES } from '../../utils/constants';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

const DonorProfileEdit = ({ donor, onClose, onSuccess }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: donor.full_name || '',
    age: donor.age || '',
    gender: donor.gender || '',
    phone: donor.phone || '',
    address: donor.address || '',
    city: donor.city || '',
    state: donor.state || ''
  });

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters';
    }
    
    if (!formData.age || formData.age < 18 || formData.age > 65) {
      newErrors.age = 'Age must be between 18-65';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.phone || formData.phone.trim().length < 10) {
      newErrors.phone = 'Valid phone number required';
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
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
    setAlertMessage(null);

    try {
      // Use the user's ID from auth context
      await donorService.updateDonor(user.user_id, formData);
      onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Your Profile"
      size="lg"
    >
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            icon={User}
            required
          />

          <Input
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
            icon={Calendar}
            required
          />
        </div>

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={GENDERS}
          error={errors.gender}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={Phone}
          required
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          icon={MapPin}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />

          <Select
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={NIGERIAN_STATES}
            error={errors.state}
            required
          />
        </div>

        <div className="bg-medical-blue-light p-4 rounded-lg border border-medical-blue">
          <p className="text-sm text-medical-blue-dark">
            <strong>Note:</strong> Blood group cannot be changed. Contact admin if there's an error.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Save Changes
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

export default DonorProfileEdit;
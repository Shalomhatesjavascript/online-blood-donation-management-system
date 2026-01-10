import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { donorService } from '../../services/donorService';
import { GENDERS, NIGERIAN_STATES } from '../../utils/constants';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

const DonorProfileEdit = ({ donor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: donor.full_name || '',
    age: donor.age || '',
    gender: donor.gender || '',
    phone: donor.phone || '',
    address: donor.address || '',
    city: donor.city || '',
    state: donor.state || '',
    last_donation_date: donor.last_donation_date || ''
  });

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      await donorService.updateDonor(donor.donor_id, formData);
      onSuccess();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile'
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
            icon={User}
            required
          />

          <Input
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
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
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          icon={Phone}
          required
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          icon={MapPin}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <Select
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={NIGERIAN_STATES}
            required
          />
        </div>

        <Input
          label="Last Donation Date"
          type="date"
          name="last_donation_date"
          value={formData.last_donation_date}
          onChange={handleChange}
        />

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
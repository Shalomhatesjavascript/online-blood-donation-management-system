import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { inventoryService } from '../../services/inventoryService';
import { donorService } from '../../services/donorService';
import { BLOOD_GROUPS } from '../../utils/constants';
import { Calendar, MapPin } from 'lucide-react';

const AddBloodUnitModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    blood_group: '',
    donation_date: new Date().toISOString().split('T')[0],
    storage_location: '',
    donor_id: ''
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await donorService.getEligibleDonors();
      setDonors(response.data || []);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
      setDonors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      // Prepare data - remove donor_id if it's empty
      const dataToSend = {
        blood_group: formData.blood_group,
        donation_date: formData.donation_date,
        storage_location: formData.storage_location
      };

      // Only add donor_id if it's not empty
      if (formData.donor_id && formData.donor_id !== '') {
        dataToSend.donor_id = parseInt(formData.donor_id);
      }

      console.log('Sending data:', dataToSend); // Debug log

      await inventoryService.addBloodUnit(dataToSend);
      onSuccess();
    } catch (error) {
      console.error('Error response:', error.response); // Debug log
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join(', ');
        setAlertMessage({
          type: 'error',
          message: errorMessages
        });
      } else {
        setAlertMessage({
          type: 'error',
          message: error.response?.data?.message || 'Failed to add blood unit'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Add Blood Unit"
      size="md"
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
        <Select
          label="Blood Group"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
          options={BLOOD_GROUPS}
          required
        />

        <Input
          label="Donation Date"
          type="date"
          name="donation_date"
          value={formData.donation_date}
          onChange={handleChange}
          icon={Calendar}
          required
        />

        <Input
          label="Storage Location"
          name="storage_location"
          value={formData.storage_location}
          onChange={handleChange}
          placeholder="e.g., Freezer-A1"
          icon={MapPin}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Donor (Optional)
          </label>
          <select
            name="donor_id"
            value={formData.donor_id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light transition-all duration-200"
          >
            <option value="">No donor / Anonymous</option>
            {donors.map(donor => (
              <option key={donor.donor_id} value={donor.donor_id}>
                {donor.full_name} ({donor.blood_group})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {donors.length === 0 ? 'No eligible donors found' : 'Select a donor or leave blank'}
          </p>
        </div>

        <div className="bg-medical-blue-light p-4 rounded-lg border border-medical-blue">
          <p className="text-sm text-medical-blue-dark">
            <strong>Note:</strong> Expiration date will be automatically calculated as 35 days from donation date.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Add Blood Unit
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

export default AddBloodUnitModal;
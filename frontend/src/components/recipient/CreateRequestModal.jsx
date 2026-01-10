import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { requestService } from '../../services/requestService';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../utils/constants';
import { Droplet, MapPin } from 'lucide-react';

const CreateRequestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    blood_group: '',
    units_needed: 1,
    urgency_level: 'medium',
    hospital_location: ''
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
      await requestService.createRequest(formData);
      onSuccess();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create request'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create Blood Request"
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
          label="Blood Group Needed"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
          options={BLOOD_GROUPS}
          required
        />

        <Input
          label="Number of Units"
          type="number"
          name="units_needed"
          value={formData.units_needed}
          onChange={handleChange}
          icon={Droplet}
          required
        />

        <Select
          label="Urgency Level"
          name="urgency_level"
          value={formData.urgency_level}
          onChange={handleChange}
          options={URGENCY_LEVELS}
          required
        />

        <Input
          label="Hospital Location"
          name="hospital_location"
          value={formData.hospital_location}
          onChange={handleChange}
          placeholder="e.g., Babcock University Teaching Hospital"
          icon={MapPin}
          required
        />

        <div className="bg-medical-blue-light p-4 rounded-lg border border-medical-blue">
          <p className="text-sm text-medical-blue-dark">
            <strong>Note:</strong> Your request will be reviewed by hospital administrators. 
            You'll be notified once it's approved.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Submit Request
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

export default CreateRequestModal;
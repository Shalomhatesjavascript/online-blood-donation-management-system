import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { inventoryService } from '../../services/inventoryService';
import { donorService } from '../../services/donorService';
import { BLOOD_GROUPS } from '../../utils/constants';
import { Calendar, MapPin, Users } from 'lucide-react';

const AddBloodUnitModal = ({ onClose, onSuccess }) => {
  const [bulkMode, setBulkMode] = useState(false); // NEW: Toggle for bulk mode
  
  const [formData, setFormData] = useState({
    blood_group: '',
    donation_date: new Date().toISOString().split('T')[0],
    storage_location: '',
    donor_id: null,
    quantity: 1 // NEW: For bulk creation
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (!bulkMode) {
      fetchDonors();
    }
  }, [bulkMode]);

  const fetchDonors = async () => {
    try {
      const response = await donorService.getEligibleDonors();
      setDonors(response.data);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'donor_id') {
      setFormData(prev => ({ 
        ...prev, 
        donor_id: value ? parseInt(value) : null 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      if (bulkMode) {
        // Bulk creation (anonymous donors)
        await inventoryService.addBulkBloodUnits({
          blood_group: formData.blood_group,
          donation_date: formData.donation_date,
          storage_location: formData.storage_location,
          quantity: parseInt(formData.quantity)
        });
      } else {
        // Single unit creation (with optional donor)
        await inventoryService.addBloodUnit(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Add blood unit error:', error.response || error);
      
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add blood unit. Check console for details.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={bulkMode ? "Add Bulk Blood Units (Anonymous)" : "Add Blood Unit"}
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

      {/* NEW: Bulk Mode Toggle */}
      <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="bulkMode"
          checked={bulkMode}
          onChange={(e) => {
            setBulkMode(e.target.checked);
            if (e.target.checked) {
              setFormData(prev => ({ ...prev, donor_id: null, quantity: 5 }));
            } else {
              setFormData(prev => ({ ...prev, quantity: 1 }));
            }
          }}
          className="w-4 h-4 text-blood-red rounded focus:ring-blood-red"
        />
        <label htmlFor="bulkMode" className="text-sm font-medium text-gray-700 cursor-pointer">
          Bulk Mode (Add multiple units from anonymous donors)
        </label>
      </div>

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
          placeholder={bulkMode ? "e.g., Freezer-A (units will be numbered)" : "e.g., Freezer-A1"}
          icon={MapPin}
          required
        />

        {bulkMode ? (
          // BULK MODE: Quantity input
          <div>
            <Input
              label="Quantity (Number of Units)"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 10"
              icon={Users}
              required
              min="1"
              max="50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 50 units per batch. Each unit will be automatically numbered.
            </p>
          </div>
        ) : (
          // SINGLE MODE: Donor selection
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Donor (Optional)
            </label>
            <select
              name="donor_id"
              value={formData.donor_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light transition-all"
            >
              <option value="">Anonymous / Walk-in Donor</option>
              {donors.map(d => (
                <option key={d.donor_id} value={d.donor_id}>
                  {d.full_name} ({d.blood_group}) - {d.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={`p-4 rounded-lg border ${bulkMode ? 'bg-warning-light border-warning' : 'bg-medical-blue-light border-medical-blue'}`}>
          <p className="text-sm font-medium mb-2">
            {bulkMode ? '⚡ Bulk Mode Information:' : 'ℹ️ Single Unit Information:'}
          </p>
          <ul className="text-sm space-y-1">
            <li>• Expiration date: 35 days from donation</li>
            {bulkMode ? (
              <>
                <li>• Units will be numbered automatically (e.g., Freezer-A-1, Freezer-A-2...)</li>
                <li>• No donor record will be linked (anonymous donations)</li>
                <li>• All units will have the same donation date and blood group</li>
              </>
            ) : (
              <>
                <li>• {formData.donor_id ? 'Donor\'s last donation date will be updated' : 'No donor will be linked'}</li>
                <li>• Select donor from registered donors or leave anonymous</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            {bulkMode ? `Add ${formData.quantity} Units` : 'Add Blood Unit'}
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
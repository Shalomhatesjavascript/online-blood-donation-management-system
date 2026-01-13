import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import { Users, Search, Calendar, Phone, MapPin, Mail } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { BLOOD_GROUPS, NIGERIAN_STATES } from '../../utils/constants';

const DonorsManagement = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [filters, setFilters] = useState({
    blood_group: '',
    city: '',
    state: '',
    eligible_only: 'false',
    search: ''
  });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newDonationDate, setNewDonationDate] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await donorService.getAllDonors(filters);
        setDonors(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setAlertMessage({
          type: 'error',
          message: 'Failed to load donors'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [filters]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await donorService.getAllDonors(filters);
      setDonors(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to load donors'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleUpdateDonationDate = async () => {
    if (!newDonationDate) {
      setAlertMessage({ type: 'error', message: 'Please select a date' });
      return;
    }

    setUpdating(true);
    try {
      await donorService.updateDonationDate(selectedDonor.donor_id, newDonationDate);
      setAlertMessage({
        type: 'success',
        message: 'Donation date updated successfully'
      });
      setShowUpdateModal(false);
      setNewDonationDate('');
      fetchDonors();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update donation date'
      });
    } finally {
      setUpdating(false);
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

      <h2 className="text-xl font-bold text-gray-900 mb-6">Donors Management</h2>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name or phone..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            icon={Search}
          />

          <Select
            name="blood_group"
            value={filters.blood_group}
            onChange={handleFilterChange}
            options={BLOOD_GROUPS}
            placeholder="All Blood Groups"
          />

          <Input
            placeholder="City"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            icon={MapPin}
          />

          <Select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            options={NIGERIAN_STATES}
            placeholder="All States"
          />
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="eligible_only"
              checked={filters.eligible_only === 'true'}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                eligible_only: e.target.checked ? 'true' : 'false' 
              }))}
              className="w-4 h-4 text-blood-red rounded focus:ring-blood-red"
            />
            <label htmlFor="eligible_only" className="text-sm text-gray-700">
              Show only eligible donors
            </label>
          </div>

          <Button type="submit" variant="primary" className="ml-auto">
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Donors List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : donors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No donors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donors.map((donor, index) => (
            <div
              key={donor.donor_id}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-fadeIn border-l-4 border-blood-red"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Donor Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-blood-red flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{donor.blood_group}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{donor.full_name}</p>
                      <p className="text-sm text-gray-500 capitalize">{donor.gender}, {donor.age} years</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{donor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{donor.User?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{donor.city}, {donor.state}</span>
                      </div>
                      {donor.last_donation_date && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Last: {formatDate(donor.last_donation_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3">
                  <Badge variant={donor.is_eligible ? 'success' : 'warning'}>
                    {donor.is_eligible ? '✓ Eligible' : `${donor.days_until_eligible}d left`}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDonor(donor);
                      setNewDonationDate(new Date().toISOString().split('T')[0]);
                      setShowUpdateModal(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Update Donation
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Donation Date Modal */}
      {showUpdateModal && selectedDonor && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowUpdateModal(false);
            setNewDonationDate('');
          }}
          title="Update Donation Date"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">Donor: {selectedDonor.full_name}</p>
              <p className="text-sm text-gray-600">Blood Group: {selectedDonor.blood_group}</p>
              {selectedDonor.last_donation_date && (
                <p className="text-sm text-gray-600">
                  Current Last Donation: {formatDate(selectedDonor.last_donation_date)}
                </p>
              )}
            </div>

            <Input
              label="New Donation Date"
              type="date"
              value={newDonationDate}
              onChange={(e) => setNewDonationDate(e.target.value)}
              icon={Calendar}
              required
            />

            <div className="bg-warning-light p-4 rounded-lg border border-warning">
              <p className="text-sm text-warning-dark">
                <strong>Note:</strong> Updating this date will affect the donor's eligibility status.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                loading={updating}
                onClick={handleUpdateDonationDate}
              >
                Update Date
              </Button>
              <Button
                variant="outline"
                fullWidth
                disabled={updating}
                onClick={() => {
                  setShowUpdateModal(false);
                  setNewDonationDate('');
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

export default DonorsManagement;
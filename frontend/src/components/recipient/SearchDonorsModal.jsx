import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import { donorService } from '../../services/donorService';
import { BLOOD_GROUPS } from '../../utils/constants';
import { Search, Phone, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const SearchDonorsModal = ({ onClose }) => {
  const [searchParams, setSearchParams] = useState({
    blood_group: '',
    city: '',
    eligible_only: 'true'
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);
    setSearched(true);

    try {
      const response = await donorService.searchDonors(searchParams);
      setDonors(response.data);
      
      if (response.data.length === 0) {
        setAlertMessage({
          type: 'info',
          message: 'No donors found matching your criteria. Try adjusting your search.'
        });
      }
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to search donors'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Search Blood Donors"
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

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Blood Group"
            name="blood_group"
            value={searchParams.blood_group}
            onChange={handleChange}
            options={BLOOD_GROUPS}
            placeholder="All blood groups"
          />

          <Input
            label="City"
            name="city"
            value={searchParams.city}
            onChange={handleChange}
            placeholder="e.g., Ilishan-Remo"
            icon={MapPin}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="eligible_only"
            checked={searchParams.eligible_only === 'true'}
            onChange={(e) => setSearchParams(prev => ({ 
              ...prev, 
              eligible_only: e.target.checked ? 'true' : 'false' 
            }))}
            className="w-4 h-4 text-blood-red rounded focus:ring-blood-red"
          />
          <label htmlFor="eligible_only" className="text-sm text-gray-700">
            Show only eligible donors (can donate now)
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          className="flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Search Donors
        </Button>
      </form>

      {/* Results */}
      {searched && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Search Results ({donors.length})
          </h3>

          {donors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No donors found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donors.map((donor, index) => (
                <div
                  key={donor.donor_id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blood-red flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{donor.blood_group}</span>
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{donor.full_name}</p>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{donor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{donor.city}, {donor.state}</span>
                          </div>
                          {donor.last_donation_date && (
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>Last donated: {formatDate(donor.last_donation_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={donor.is_eligible ? 'success' : 'warning'}>
                        {donor.is_eligible ? 'Eligible' : `${donor.days_until_eligible}d left`}
                      </Badge>
                      <span className="text-xs text-gray-500 capitalize">{donor.gender}, {donor.age}y</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SearchDonorsModal;
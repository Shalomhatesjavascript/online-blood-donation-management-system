import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { donorService } from '../../services/donorService';
import { Heart, Calendar, Clock, Award, MessageSquare } from 'lucide-react';

import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

import { formatDate, timeAgo } from '../../utils/helpers';

import DonorProfileEdit from '../../components/donor/DonorProfileEdit';
import SubmitComplaintModal from '../../components/common/SubmitComplaintModal';
import ComplaintsList from '../../components/common/ComplaintsList';

const DonorDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [donorProfile, setDonorProfile] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [complaintsRefresh, setComplaintsRefresh] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      setLoading(true);

      const [profileRes, historyRes] = await Promise.all([
        donorService.getDonorById(user.user_id),
        donorService.getDonationHistory(user.user_id)
      ]);

      setDonorProfile(profileRes.data);
      setDonationHistory(historyRes.data);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setShowEditModal(false);
    await fetchDonorData();
    toast.success('Profile updated successfully!');
  };

  const handleComplaintSubmitted = () => {
    setShowComplaintModal(false);
    setComplaintsRefresh(prev => prev + 1);
    toast.success('Feedback submitted successfully');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  const isEligible = donorProfile?.is_eligible;
  const daysUntilEligible = donorProfile?.days_until_eligible || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {donorProfile?.full_name}! 👋
            </h1>
            <p className="text-gray-600">
              Your contributions are saving lives every day
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowComplaintModal(true)}
            className="flex items-center gap-2"
          >
            <MessageSquare size={20} />
            Submit Feedback
          </Button>

        </div>

        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            className="mb-6"
          />
        )}

        {/* Eligibility Banner */}
        <Card className={`p-6 mb-8 border-2 ${
          isEligible ? 'border-green-500 bg-green-50'
          : 'border-yellow-500 bg-yellow-50'
        }`}>

          <div className="flex items-center gap-4">

            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isEligible ? 'bg-green-500' : 'bg-yellow-500'
            }`}>

              {isEligible ? (
                <Heart className="w-8 h-8 text-white" />
              ) : (
                <Clock className="w-8 h-8 text-white" />
              )}

            </div>

            <div className="flex-1">

              <h3 className="text-xl font-bold mb-1">
                {isEligible
                  ? 'You are eligible to donate!'
                  : 'Not yet eligible'}
              </h3>

              <p>
                {isEligible
                  ? 'Thank you for being ready to save lives.'
                  : `You can donate again in ${daysUntilEligible} days`}
              </p>

            </div>

            {donorProfile?.last_donation_date && (

              <div className="text-right">
                <p className="text-sm text-gray-600">Last Donation</p>
                <p className="font-semibold">
                  {formatDate(donorProfile.last_donation_date)}
                </p>
                <p className="text-xs text-gray-500">
                  {timeAgo(donorProfile.last_donation_date)}
                </p>
              </div>

            )}

          </div>

        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatCard
            icon={Heart}
            label="Total Donations"
            value={donationHistory.length}
            color="blood-red"
          />

          <StatCard
            icon={Calendar}
            label="Blood Group"
            value={donorProfile?.blood_group || 'N/A'}
            color="medical-blue"
          />

          <StatCard
            icon={Clock}
            label="Days Until Eligible"
            value={isEligible ? 'Ready!' : daysUntilEligible}
            color="warning"
          />

          <StatCard
            icon={Award}
            label="Lives Impacted"
            value={donationHistory.length * 3}
            color="success"
          />

        </div>

        {/* Donation History */}
        <Card className="p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Donation History
          </h2>

          {donationHistory.length === 0 ? (

            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No donation history yet
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {donationHistory.map((donation) => (

                <div
                  key={donation.unit_id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >

                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {donation.blood_group}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">
                      {formatDate(donation.donation_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Storage: {donation.storage_location}
                    </p>
                  </div>

                  <Badge>
                    {donation.status}
                  </Badge>

                </div>

              ))}

            </div>

          )}

        </Card>

        {/* Complaints Section */}
        <ComplaintsList refreshTrigger={complaintsRefresh} />

      </div>

      {/* Modals */}

      {showEditModal && (
        <DonorProfileEdit
          donor={donorProfile}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleProfileUpdate}
        />
      )}

      {showComplaintModal && (
        <SubmitComplaintModal
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          onSuccess={handleComplaintSubmitted}
        />
      )}

    </div>
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold capitalize">
        {value || 'N/A'}
      </span>
    </div>
  );
}

export default DonorDashboard;
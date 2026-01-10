import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { donorService } from '../../services/donorService';
import { Heart, Calendar, Clock, TrendingUp, Award } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { formatDate, timeAgo } from '../../utils/helpers';
import DonorProfileEdit from '../../components/donor/DonorProfileEdit';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
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
      setAlertMessage({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setShowEditModal(false);
    await fetchDonorData();
    setAlertMessage({
      type: 'success',
      message: 'Profile updated successfully!'
    });
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
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {donorProfile?.full_name}! 👋
          </h1>
          <p className="text-gray-600">Your contributions are saving lives every day</p>
        </div>

        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            className="mb-6 animate-fadeIn"
          />
        )}

        {/* Eligibility Banner */}
        <Card className={`p-6 mb-8 border-2 animate-fadeIn ${
          isEligible 
            ? 'border-success bg-success-light' 
            : 'border-warning bg-warning-light'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isEligible ? 'bg-success' : 'bg-warning'
            }`}>
              {isEligible ? (
                <Heart className="w-8 h-8 text-white" />
              ) : (
                <Clock className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${
                isEligible ? 'text-success-dark' : 'text-warning-dark'
              }`}>
                {isEligible ? 'You are eligible to donate!' : 'Not yet eligible'}
              </h3>
              <p className={isEligible ? 'text-success-dark' : 'text-warning-dark'}>
                {isEligible 
                  ? 'Thank you for being ready to save lives. Contact your nearest blood bank today!'
                  : `You can donate again in ${daysUntilEligible} days`
                }
              </p>
            </div>
            {donorProfile?.last_donation_date && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Donation</p>
                <p className="font-semibold">{formatDate(donorProfile.last_donation_date)}</p>
                <p className="text-xs text-gray-500">{timeAgo(donorProfile.last_donation_date)}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
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

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-blood-red hover:text-blood-red-dark font-semibold text-sm transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className={`w-24 h-24 rounded-full ${
                    donorProfile?.blood_group ? 
                    `bg-gradient-to-br from-blood-red to-blood-red-dark` : 
                    'bg-gray-200'
                  } flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl font-bold text-white">
                      {donorProfile?.blood_group || '?'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <InfoRow label="Name" value={donorProfile?.full_name} />
                  <InfoRow label="Age" value={donorProfile?.age} />
                  <InfoRow label="Gender" value={donorProfile?.gender} />
                  <InfoRow label="Phone" value={donorProfile?.phone} />
                  <InfoRow label="City" value={donorProfile?.city} />
                  <InfoRow label="State" value={donorProfile?.state} />
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-blood-red to-blood-red-dark text-white animate-fadeIn">
              <h3 className="text-lg font-bold mb-4">Impact Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Potential Lives Saved</span>
                  <span className="text-2xl font-bold">{donationHistory.length * 3}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Blood Donated (ml)</span>
                  <span className="text-2xl font-bold">{donationHistory.length * 450}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Donation History */}
          <div className="lg:col-span-2">
            <Card className="p-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Donation History</h2>

              {donationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No donation history yet</p>
                  <p className="text-gray-400 text-sm mt-2">Your first donation will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donationHistory.map((donation, index) => (
                    <div
                      key={donation.unit_id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-12 h-12 rounded-full ${
                        donation.status === 'used' ? 'bg-success' : 
                        donation.status === 'available' ? 'bg-medical-blue' : 
                        'bg-gray-400'
                      } flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{donation.blood_group}</span>
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {formatDate(donation.donation_date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Storage: {donation.storage_location}
                        </p>
                      </div>

                      <Badge variant={
                        donation.status === 'used' ? 'success' :
                        donation.status === 'available' ? 'info' :
                        donation.status === 'expired' ? 'danger' :
                        'default'
                      }>
                        {donation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <DonorProfileEdit
          donor={donorProfile}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleProfileUpdate}
        />
      )}
    </div>
  );
};

// Helper component
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}:</span>
    <span className="font-semibold text-gray-900 capitalize">{value || 'N/A'}</span>
  </div>
);

export default DonorDashboard;
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const timeAgo = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const calculateDaysUntilExpiration = (expirationDate) => {
  if (!expirationDate) return 0;
  return differenceInDays(new Date(expirationDate), new Date());
};

export const getUrgencyColor = (level) => {
  switch (level) {
    case 'high': return 'bg-danger text-white';
    case 'medium': return 'bg-warning text-white';
    case 'low': return 'bg-success text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning text-white';
    case 'approved': return 'bg-success text-white';
    case 'rejected': return 'bg-danger text-white';
    case 'fulfilled': return 'bg-medical-blue text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const getBloodGroupColor = (bloodGroup) => {
  const colors = {
    'A+': 'bg-red-500',
    'A-': 'bg-red-600',
    'B+': 'bg-blue-500',
    'B-': 'bg-blue-600',
    'AB+': 'bg-purple-500',
    'AB-': 'bg-purple-600',
    'O+': 'bg-green-500',
    'O-': 'bg-green-600'
  };
  return colors[bloodGroup] || 'bg-gray-500';
};
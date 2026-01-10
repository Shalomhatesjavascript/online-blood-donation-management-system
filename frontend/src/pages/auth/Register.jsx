import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Phone, MapPin, Droplet as DropletIcon, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import { BLOOD_GROUPS, GENDERS, NIGERIAN_STATES } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    // Donor-specific fields
    full_name: '',
    age: '',
    gender: '',
    blood_group: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Role-specific validation
    if (formData.role === 'donor') {
      if (!formData.full_name) newErrors.full_name = 'Full name is required';
      if (!formData.age) {
        newErrors.age = 'Age is required';
      } else if (formData.age < 18 || formData.age > 65) {
        newErrors.age = 'Age must be between 18 and 65';
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
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
      // Remove confirmPassword before sending
      const { confirmPassword, ...dataToSend } = formData;
      
      await register(dataToSend);
      
      setAlertMessage({
        type: 'success',
        message: 'Registration successful! Please login with your credentials.'
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blood-red-light via-white to-medical-blue-light py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blood-red rounded-full shadow-lg mb-4 animate-pulse-glow">
            <DropletIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-red to-blood-red-dark bg-clip-text text-transparent">
            Join BloodBank
          </h1>
          <p className="text-gray-600 mt-2">Create your account and start saving lives</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
          {alertMessage && (
            <Alert
              type={alertMessage.type}
              message={alertMessage.message}
              onClose={() => setAlertMessage(null)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to register as <span className="text-blood-red">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'donor' }))}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${formData.role === 'donor' 
                      ? 'border-blood-red bg-blood-red-light shadow-md' 
                      : 'border-gray-300 hover:border-blood-red'
                    }
                  `}
                >
                  <div className="font-semibold text-gray-900">Blood Donor</div>
                  <div className="text-sm text-gray-600 mt-1">I want to donate blood</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'recipient' }))}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${formData.role === 'recipient' 
                      ? 'border-medical-blue bg-medical-blue-light shadow-md' 
                      : 'border-gray-300 hover:border-medical-blue'
                    }
                  `}
                >
                  <div className="font-semibold text-gray-900">Blood Recipient</div>
                  <div className="text-sm text-gray-600 mt-1">I need blood</div>
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Account Information
              </h3>
              
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                error={errors.email}
                icon={Mail}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  error={errors.password}
                  icon={Lock}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  error={errors.confirmPassword}
                  icon={Lock}
                  required
                />
              </div>
            </div>

            {/* Donor-specific fields */}
            {formData.role === 'donor' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Donor Information
                </h3>

                <Input
                  label="Full Name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.full_name}
                  icon={User}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    error={errors.age}
                    icon={Calendar}
                    required
                  />

                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={GENDERS}
                    error={errors.gender}
                    required
                  />

                  <Select
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    options={BLOOD_GROUPS}
                    error={errors.blood_group}
                    required
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  error={errors.phone}
                  icon={Phone}
                  required
                />

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  error={errors.address}
                  icon={MapPin}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ilishan-Remo"
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
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blood-red font-semibold hover:text-blood-red-dark transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
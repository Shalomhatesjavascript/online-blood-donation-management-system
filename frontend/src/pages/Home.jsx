import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Droplet, Heart, Users, Clock, Shield, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Monitor blood inventory levels and expiration dates in real-time'
    },
    {
      icon: Users,
      title: 'Donor Network',
      description: 'Connect with eligible blood donors quickly and efficiently'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with industry-standard security'
    },
    {
      icon: TrendingUp,
      title: 'Smart Matching',
      description: 'Advanced algorithm to match donors with recipients'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Registered Donors' },
    { value: '5,000+', label: 'Lives Saved' },
    { value: '24/7', label: 'Available' },
    { value: '99.9%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blood-red-light via-white to-medical-blue-light">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-blood-red-light px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 text-blood-red animate-pulse" />
                <span className="text-blood-red font-semibold text-sm">Save Lives Today</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blood-red to-blood-red-dark bg-clip-text text-transparent">
                  Blood Donation
                </span>
                <br />
                Made Simple
              </h1>
              
              <p className="text-xl text-gray-600">
                Connect donors with recipients instantly. Manage blood inventory efficiently. 
                Save lives through technology.
              </p>

              {!isAuthenticated ? (
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/register">
                    <Button variant="primary" size="lg" className="flex items-center gap-2">
                      <Droplet className="w-5 h-5" />
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to={user?.role === 'donor' ? '/donor/dashboard' : user?.role === 'recipient' ? '/recipient/dashboard' : '/admin/dashboard'}>
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Right Content - Illustration */}
            <div className="relative animate-fadeIn">
              <div className="bg-gradient-to-br from-blood-red to-blood-red-dark rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Droplet className="w-full h-64 text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-7xl font-bold mb-4 animate-pulse-glow">A+</div>
                    <div className="text-2xl font-semibold">Universal Donor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-blood-red mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodBank?
            </h2>
            <p className="text-xl text-gray-600">
              Modern technology meets life-saving mission
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                hover 
                className="p-6 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-blood-red-light rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-blood-red" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blood-red to-blood-red-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white opacity-90">
              Join thousands of donors and recipients in our mission to save lives
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-blood-red hover:bg-gray-100 shadow-xl"
                >
                  Register Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Droplet className="w-8 h-8 text-blood-red" />
            <span className="text-2xl font-bold">BloodBank</span>
          </div>
          <p className="text-gray-400">
            © 2026 BloodBank Management System. Saving lives through technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
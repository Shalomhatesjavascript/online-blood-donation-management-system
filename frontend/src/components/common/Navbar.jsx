import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Droplet, Menu, X, LogOut, User, Home, LayoutDashboard } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor': return '/donor/dashboard';
      case 'recipient': return '/recipient/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  // Close mobile menu when route changes
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={handleNavClick}>
            <Droplet className="w-7 h-7 sm:w-8 sm:h-8 text-blood-red group-hover:animate-pulse-glow transition-all" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blood-red to-blood-red-dark bg-clip-text text-transparent">
              BloodBank
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-blood-red font-medium transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                  <div className="text-right">
  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
  <p className="text-xs text-gray-500 capitalize">
    {user.role === 'admin' ? 'Blood Bank Admin' : 
     user.role === 'donor' ? 'Blood Donor' : 
     'Hospital/Individual'}
  </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span className="hidden lg:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden animate-slideIn max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blood-red flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Links */}
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors touch-target"
                    onClick={handleNavClick}
                  >
                    <Home size={20} />
                    <span className="font-medium">Home</span>
                  </Link>

                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors touch-target"
                    onClick={handleNavClick}
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 mt-4"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleNavClick}>
                    <Button variant="ghost" fullWidth className="mb-3">Login</Button>
                  </Link>
                  <Link to="/register" onClick={handleNavClick}>
                    <Button variant="primary" fullWidth>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
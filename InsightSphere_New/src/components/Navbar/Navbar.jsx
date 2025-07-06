import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './Navbar.css';
import logo from '../../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  // On mount, get the auth user from localStorage.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/latest', label: 'Latest' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <nav className="bg-[#EAF1FB] h-16 sm:h-20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12" />
          <h2 className="font-bold text-xl sm:text-3xl text-gray-800">InsightSphere</h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 sm:px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!authUser ? (
            <Link
              to="/login"
              className="px-4 sm:px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
            >
              Login
            </Link>
          ) : (
            // When logged in, show a profile icon that links to /profile.
            <Link
              to="/profile"
              className="flex items-center p-2 rounded-full bg-white hover:bg-gray-200 transition-colors duration-200"
            >
              <i className="fas fa-user-circle text-2xl text-gray-800"></i>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Side Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/50 md:hidden z-40"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Menu</h3>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={toggleMobileMenu}
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Button */}
                <div className="mt-6">
                  {!authUser ? (
                    <Link
                      to="/login"
                      onClick={toggleMobileMenu}
                      className="block w-full px-4 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Login
                    </Link>
                  ) : (
                    // When logged in, show a link with a profile icon that navigates to /profile.
                    <Link
                      to="/profile"
                      onClick={toggleMobileMenu}
                      className="block w-full px-4 py-2 text-center rounded-lg bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <i className="fas fa-user-circle text-2xl mr-2"></i> Profile
                    </Link>
                  )}
                </div>

                {/* Optional: Display logged-in user's details */}
                {authUser && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-user text-gray-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{authUser.name}</p>
                        <p className="text-sm text-gray-500">{authUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

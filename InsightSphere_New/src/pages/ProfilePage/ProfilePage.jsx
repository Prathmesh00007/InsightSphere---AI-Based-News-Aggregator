import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { UserCircle, User, Mail, Globe, Bookmark, History, ExternalLink } from "lucide-react";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({
        name: userData.name,
        country: userData.country
      });
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.put('/auth/users/me', formData);
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-300 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-5xl"
      >
        {/* User Profile Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full shadow-lg">
            <UserCircle size={128} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mt-6 flex items-center gap-2">
            <UserCircle className="text-indigo-600" size={36} /> {user.name}
          </h2>
        </div>

        {/* User Details Table */}
        <div className="overflow-x-auto mb-12">
          <h3 className="text-3xl font-bold text-gray-700 mb-6">User Details</h3>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="py-3 px-6 text-left">Field</th>
                    <th className="py-3 px-6 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-6 text-gray-600 flex items-center gap-2">
                      <User size={18} /> Name
                    </td>
                    <td className="py-3 px-6">{user.name}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-6 text-gray-600 flex items-center gap-2">
                      <Mail size={18} /> Email
                    </td>
                    <td className="py-3 px-6">{user.email}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-6 text-gray-600 flex items-center gap-2">
                      <Globe size={18} /> Country
                    </td>
                    <td className="py-3 px-6">{user.country?.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <History size={28} className="text-red-500" /> Recent Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.recentActivity?.length === 0 ? (
              <p className="text-gray-600 text-lg">No recent activity.</p>
            ) : (
              user.recentActivity?.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 rounded-lg shadow-lg text-white"
                >
                  <p className="text-lg font-semibold">{activity.description}</p>
                  <p className="text-sm opacity-75">{new Date(activity.timestamp).toLocaleDateString()}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Saved Articles Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Bookmark size={28} className="text-green-500" /> Saved Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.savedArticles?.length === 0 ? (
              <p className="text-gray-600 text-lg">No saved articles.</p>
            ) : (
              user.savedArticles?.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Read Article <ExternalLink size={16} />
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleLogout}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfilePage;

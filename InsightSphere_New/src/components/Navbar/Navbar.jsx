import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../stores/authStore';

function Navbar() {
  const {authUser} = useAuthStore();

  return (
    <nav className="bg-[#EAF1FB] h-20"> {/* Set background to light blue */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl flex items-center text-gray-800 space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-12" /> {/* Adjust size of logo */}
          <h2 className="font-bolder text-3xl">InsightSphere</h2> {/* Capitalize and bold */}
        </div>
        <div className="hidden links md:flex space-x-4">
          <Link to="/" className="px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition">Home</Link>
          <Link to="/categories" className="px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition">Categories</Link>
          <Link to="/latest" className="px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition">Latest</Link>
          <Link to="/about" className="px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition">About Us</Link>
        </div>

        <div className="hidden links space-x-4 md:flex">
          {
            !authUser ? (
              <Link to="/login" className="px-7 py-2 rounded-2xl bg-white text-gray-800 hover:bg-gray-200 transition">Login</Link>
            ) : (
              <button className="px-7 py-2 rounded-2xl bg-red-900 text-white hover:bg-red-500 transition">Logout</button>
            )
          }
        </div>
        <div className="flex items-center space-x-4">
          {/* Bell icon with notification dot */}
          <div className="relative">
            <Link to="/notifications" className="text-3xl h-14 w-14 flex items-center justify-center rounded-full">
              <i className="fa-solid fa-bell"></i>
            </Link>
            {/* Red dot for notification */}
            <div className="bg-red-600 h-4 w-4 rounded-full absolute top-5 right-5 translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* User Profile Icon */}
          <div className="text-xl size-10 flex items-center justify-center border-slate-700 border-4 rounded-full">
            <Link to="/profile">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

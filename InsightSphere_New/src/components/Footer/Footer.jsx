import React from 'react';
import './Footer.css'; // You can define the styles in this file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for social icons

function Footer() {
  return (
    <footer className="bg-[#EAF1FB] py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap">
          {/* About Section */}
          <div className="w-full md:w-1/3 text-gray-800 mb-4 md:mb-0">
            <h3 className="font-bold text-2xl mb-3 transition-transform transform hover:scale-105">About InsightSphere</h3>
            <p className="text-sm transition-colors duration-300 hover:text-gray-700">
              InsightSphere is an AI-powered news aggregator app that brings you the latest insights on global affairs, 
              tailored to your interests. Stay updated with real-time analytics, and deep-dive into strategic news topics.
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3 text-gray-800 text-center mb-4 md:mb-0">
            <h3 className="font-bold text-2xl mb-3 transition-transform transform hover:scale-105">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-600 transition duration-300 text-lg hover:underline">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition duration-300 text-lg hover:underline">News</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition duration-300 text-lg hover:underline">Guides</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition duration-300 text-lg hover:underline">Recommended</a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="w-full md:w-1/3 text-gray-800 text-right">
            <h3 className="font-bold text-2xl mb-3 transition-transform transform hover:scale-105">Follow Us</h3>
            <div className="flex justify-end space-x-4">
              <a href="#" className="text-gray-800 hover:text-gray-600 transition duration-300 transform hover:scale-125">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600 transition duration-300 transform hover:scale-125">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600 transition duration-300 transform hover:scale-125">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600 transition duration-300 transform hover:scale-125">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} InsightSphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

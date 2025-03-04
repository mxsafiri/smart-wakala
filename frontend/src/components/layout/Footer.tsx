import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="text-primary-600 font-bold text-xl">
              Smart Wakala
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-center text-gray-500 text-sm">
              &copy; {currentYear} Smart Wakala. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

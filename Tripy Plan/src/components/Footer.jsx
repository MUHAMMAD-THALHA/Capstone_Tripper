import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-pink py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-6 text-sm font-bold">
            <Link to="/privacy" className="hover:text-darkpink transition-colors">Privacy & Policies</Link>
            <Link to="/booking-policies" className="hover:text-darkpink transition-colors">Booking & Cancellation</Link>
            <Link to="/feedback" className="hover:text-darkpink transition-colors">Feedback & Complaints</Link>
          </div>
          <div className="text-sm font-bold">
            Made with ❤️ by Muhammad Thalha
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
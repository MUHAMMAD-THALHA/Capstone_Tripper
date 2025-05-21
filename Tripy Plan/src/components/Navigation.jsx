import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-darkpink">
                Tripy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-pink hover:text-pink inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/trips"
                className="border-transparent text-gray-500 hover:border-pink hover:text-pink inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Trips
              </Link>
              <Link
                to="/profile"
                className="border-transparent text-gray-500 hover:border-pink hover:text-pink inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <UserButton
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  userButtonBox: 'hover:bg-gray-50',
                  userButtonTrigger: 'focus:shadow-none',
                  userButtonPopoverCard: 'shadow-lg',
                  userButtonPopoverActions: 'border-t border-gray-200',
                  userButtonPopoverActionButton: 'text-gray-700 hover:bg-gray-50',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
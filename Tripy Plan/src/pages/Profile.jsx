import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-peach py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Profile - Tripy</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-darkpink">
            Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <UserProfile
            appearance={{
              elements: {
                navbar: 'hidden',
                card: 'shadow-none',
                navbarMobileMenuButton: 'hidden',
                userPreview: 'hidden',
                userButtonBox: 'hidden',
                userButtonPopoverCard: 'shadow-lg',
                userButtonPopoverActions: 'border-t border-gray-200',
                userButtonPopoverActionButton: 'text-gray-700 hover:bg-gray-50',
                userButtonPopoverFooter: 'hidden',
                formButtonPrimary: 'bg-pink hover:bg-darkpink text-white',
                formButtonReset: 'text-gray-700 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-pink focus:ring-pink',
                formFieldLabel: 'text-gray-700',
                formFieldAction: 'text-pink hover:text-darkpink',
                alert: 'bg-red-50 text-red-700',
                alertText: 'text-red-700',
                alertIcon: 'text-red-500',
                pageScrollBox: 'p-0',
                profileSection: 'border-t border-gray-200',
                profileSectionTitle: 'text-darkpink',
                profileSectionContent: 'text-gray-700',
                badge: 'bg-pink text-white',
                avatarBox: 'w-24 h-24',
                avatarImage: 'rounded-full',
                menuButton: 'text-gray-700 hover:bg-gray-50',
                menuItem: 'text-gray-700 hover:bg-gray-50',
                menuItemIcon: 'text-gray-500',
                menuItemText: 'text-gray-700',
                menuItemArrow: 'text-gray-400',
                menuItemActive: 'bg-gray-50 text-pink',
                menuItemActiveIcon: 'text-pink',
                menuItemActiveText: 'text-pink',
                menuItemActiveArrow: 'text-pink',
              },
              layout: {
                socialButtonsPlacement: 'bottom',
                socialButtonsVariant: 'blockButton',
                privacyPageUrl: '/privacy',
                termsPageUrl: '/terms',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile; 
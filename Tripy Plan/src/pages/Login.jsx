import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-peach flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Login - Tripy</title>
      </Helmet>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-darkpink">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-pink hover:text-darkpink">
              create a new account
            </Link>
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="mt-8">
          <SignIn 
            routing="path" 
            path="/login"
            signUpUrl="/register"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-pink hover:bg-darkpink text-white',
                footerActionLink: 'text-pink hover:text-darkpink',
                card: 'bg-white shadow-lg rounded-lg',
                headerTitle: 'text-darkpink',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-pink focus:ring-pink',
                formFieldLabel: 'text-gray-700',
                formFieldAction: 'text-pink hover:text-darkpink',
                footerAction: 'text-gray-600',
                identityPreviewEditButton: 'text-pink hover:text-darkpink',
                otpCodeFieldInput: 'border-gray-300 focus:border-pink focus:ring-pink',
                alert: 'bg-red-50 text-red-700',
                alertText: 'text-red-700',
                alertIcon: 'text-red-500',
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

export default Login; 
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Packages from './pages/Packages';
import HelpSupport from './pages/HelpSupport';
import Privacy from './pages/Privacy';
import BookingPolicies from './pages/BookingPolicies';
import Feedback from './pages/Feedback';
import Booking from './pages/Booking';
import BookedTours from './pages/BookedTours';
import Dashboard from './pages/Dashboard';
import OtpVerification from './pages/OtpVerification';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  SignIn,
  SignUp,
  UserButton,
  UserProfile,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/clerk-react';

// Layout wrapper for pages with Navbar and Footer
const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-peach">
    <Navbar />
    {/* Add top margin to prevent content from clashing with Navbar */}
    <main className="flex-1 mt-8 md:mt-12 px-2 md:px-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Auth Layout for centering Clerk components with background
const AuthLayout = () => (
  <div className="min-h-screen w-full flex items-center justify-center relative bg-peach bg-cover bg-center">
    <div className="absolute inset-0 bg-black/40 z-0" />
    <div className="relative z-10 w-full flex justify-center p-4">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* Clerk Auth Routes with centered layout and background */}
      <Route element={<AuthLayout />}>
        <Route
          path="/sign-in"
          element={
            <SignIn
              routing="path"
              path="/sign-in"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-pink-600 hover:bg-pink-700',
                  footerActionLink: 'text-pink-600 hover:text-pink-700'
                }
              }}
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              routing="path"
              path="/sign-up"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-pink-600 hover:bg-pink-700',
                  footerActionLink: 'text-pink-600 hover:text-pink-700'
                }
              }}
            />
          }
        />
      </Route>
      {/* Phone OTP Verification (no Navbar/Footer) */}
      <Route path="/verify-phone" element={<OtpVerification />} />
      {/* LandingPage (no Navbar/Footer) */}
      <Route path="/" element={<LandingPage />} />
      {/* All other routes with Navbar and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={
          <SignedIn>
            <UserProfile />
          </SignedIn>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/booking-policies" element={<BookingPolicies />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booked-tours" element={<BookedTours />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes here as needed */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App; 
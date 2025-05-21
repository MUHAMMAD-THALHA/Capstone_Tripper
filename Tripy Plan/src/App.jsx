import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Packages from './pages/Packages';
import Blogs from './pages/Blogs';
import HelpSupport from './pages/HelpSupport';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import BookingPolicies from './pages/BookingPolicies';
import Feedback from './pages/Feedback';
import Booking from './pages/Booking';
import BookedTours from './pages/BookedTours';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/booking-policies" element={<BookingPolicies />} />
          <Route path="/feedback" element={<Feedback />} />
          
          {/* Protected Routes */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booked-tours"
            element={
              <ProtectedRoute>
                <BookedTours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #FFB6C1',
          },
          success: {
            style: {
              border: '1px solid #4CAF50',
            },
          },
          error: {
            style: {
              border: '1px solid #f44336',
            },
          },
        }}
      />
    </div>
  );
};

export default App; 
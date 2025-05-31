import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../images/Logo.png';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const FooterLinks = () => (
  <div className="w-full flex flex-col items-center justify-center absolute bottom-8 left-0 z-30">
    <div className="flex flex-wrap gap-8 justify-center font-extrabold text-white text-lg mb-2 drop-shadow-lg">
      <Link to="/privacy" className="hover:underline">Privacy & Policies</Link>
      <Link to="/booking-policies" className="hover:underline">Booking & Cancellation</Link>
      <Link to="/feedback" className="hover:underline">Feedback & Complaints</Link>
    </div>
    <div className="text-white font-extrabold text-md drop-shadow-lg">
      Made with <span className="text-red-500">❤️</span> by Muhammad Thalha
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black overflow-hidden">
      {/* Animated Tourist Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-happy-tourists-walking-in-the-city-4696-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-pink-400/60 z-10 pointer-events-none" />
      {/* Navbar inside video */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      {/* Centered Branding and CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
        <motion.img
          src={Logo}
          alt="Tripy Logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-32 h-32 mb-4 drop-shadow-lg rounded-full border-4 border-white bg-white/80 mx-auto"
        />
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-2 drop-shadow-lg"
        >
          Welcome to Tripy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-2xl md:text-3xl text-white/90 mb-4 font-semibold drop-shadow"
        >
          Your Adventure Starts Here
        </motion.p>
        <SignedOut>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-10 rounded-full text-xl shadow-lg transition-colors mt-2"
            onClick={() => window.location.href = '/sign-in'}
          >
            Get Started
          </motion.button>
        </SignedOut>
      </div>
      {/* Footer links at the bottom of the video for signed-in users */}
      <SignedIn>
        <FooterLinks />
      </SignedIn>
    </div>
  );
};

export default LandingPage; 
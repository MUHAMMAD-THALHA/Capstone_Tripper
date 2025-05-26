import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaUsers, FaAward, FaHeart } from 'react-icons/fa';
import Logo from '../images/Logo.png';

const About = () => {
  const stats = [
    { icon: <FaGlobe />, number: '50+', label: 'Destinations' },
    { icon: <FaUsers />, number: '10k+', label: 'Happy Travelers' },
    { icon: <FaAward />, number: '15+', label: 'Years Experience' },
    { icon: <FaHeart />, number: '98%', label: 'Satisfaction Rate' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Michael Chen',
      role: 'Travel Expert',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Emma Wilson',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
  ];

  return (
    <div className="min-h-screen bg-peach font-playful flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-center pt-8 pb-6 font-playful">About Us</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mb-12 items-center justify-center">
        {/* Logo Card */}
        <div className="bg-pink rounded-2xl shadow-lg p-8 flex flex-col items-center w-80 font-playful">
          <img src={Logo} alt="Tripy Logo" className="w-32 h-32 mb-2" />
          <div className="font-playful text-lg text-center">Because Every Journey Tells a Story! <span role='img' aria-label='heart'>❤️</span></div>
        </div>
        {/* About Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[300px] font-playful">
          <blockquote className="text-md md:text-lg font-playful text-gray-700 text-center md:text-left">
            <span className="font-bold">"Life is a journey, and every trip is a chapter in your story."</span>🌍✨<br/>
            Traveling isn't just about reaching a destination—it's about the experiences along the way.<br/>
            Every trip brings new lessons, unexpected adventures, and unforgettable memories. Just like life, a journey is filled with twists and turns, but the beauty lies in embracing the unknown.<br/>
            Whether it's watching a sunrise in a foreign land, meeting new people, or simply getting lost in the moment, every trip adds a new perspective to life.<br/>
            So, pack your dreams, chase the horizon, and let the journey shape who you become!🌈💞
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About; 
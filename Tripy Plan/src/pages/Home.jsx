import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaQuoteLeft, FaHeart, FaSmile } from 'react-icons/fa';

const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ooty, India',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Kuwait, Kuwait City',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Thailand, Bangkok',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Singapore, India',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
];

const Home = () => {
  const featuredTours = [
    {
      id: 1,
      title: 'Bali Paradise Adventure',
      location: 'Bali, Indonesia',
      duration: '7 Days',
      price: 1299,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      title: 'Swiss Alps Explorer',
      location: 'Swiss Alps',
      duration: '5 Days',
      price: 1499,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 3,
      title: 'Kyoto Cultural Journey',
      location: 'Kyoto, Japan',
      duration: '6 Days',
      price: 1699,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Adventure Enthusiast',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      quote: 'The Bali tour exceeded all my expectations. The local guides were knowledgeable and the accommodations were perfect.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Photography Lover',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      quote: 'The Swiss Alps adventure was a photographer\'s dream. Every view was more breathtaking than the last.',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Cultural Explorer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      quote: 'The Kyoto cultural tour gave me a deep appreciation for Japanese traditions and history.',
    },
  ];

  return (
    <div className="min-h-screen bg-peach font-playful">
      {/* Header */}
      {/*  */}

      {/* Hero Section */}
      <div className="text-center py-12 bg-pink rounded-2xl mx-2 mt-6 shadow-lg font-playful">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playful">
          Tripy – Because Every Journey Tells a Story! <FaHeart className="inline text-red-500" />
        </h1>
        <p className="text-2xl font-playful mb-2">Let's get lost together 😜</p>
        {/* Search Form */}
        <form className="flex flex-wrap justify-center gap-4 bg-peach bg-opacity-80 rounded-xl shadow-md p-6 max-w-4xl mx-auto mt-8 font-playful">
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Search :</label>
            <input type="text" className="rounded-lg px-4 py-2 bg-pink bg-opacity-60 shadow-inner focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Select your date :</label>
            <input type="date" className="rounded-lg px-4 py-2 bg-pink bg-opacity-60 shadow-inner focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Select your date :</label>
            <input type="date" className="rounded-lg px-4 py-2 bg-pink bg-opacity-60 shadow-inner focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-bold">No. Of Person :</label>
            <input type="number" min="1" className="rounded-lg px-4 py-2 bg-pink bg-opacity-60 shadow-inner focus:outline-none" />
          </div>
          <button type="submit" className="bg-darkpink text-white font-bold px-8 py-2 rounded-lg shadow hover:bg-pink transition">SUBMIT</button>
        </form>
      </div>

      {/* Top Destinations */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 font-playful">Top Destinations</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {destinations.map((dest) => (
            <div key={dest.name} className="bg-white rounded-2xl shadow-lg p-2 w-48 text-center hover:scale-105 transition-transform">
              <img src={dest.image} alt={dest.name} className="rounded-xl w-full h-32 object-cover mb-2" />
              <span className="font-bold font-playful text-lg">{dest.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tours Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular tours, carefully selected for an unforgettable experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${tour.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-gray-600">{tour.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                  <Link
                    to={`/tours/${tour.id}`}
                    className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read about the experiences of our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <FaQuoteLeft className="text-blue-600 text-2xl mb-4" />
                <p className="text-gray-600">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who have experienced the world with us
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 
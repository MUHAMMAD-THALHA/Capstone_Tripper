import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaStar, FaCalendarAlt, FaUsers, FaTag, FaCar, FaUtensils, FaCheck } from 'react-icons/fa';
import { toursAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const GoogleMap = ({ coordinates, title }) => {
  // Instead of using Google Maps API, show a placeholder map
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden shadow-md bg-gray-100">
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
        <FaMapMarkerAlt className="text-5xl mb-2 text-pink" />
        <p className="font-semibold">{title}</p>
        <p className="text-sm">{coordinates.lat}, {coordinates.lng}</p>
        <p className="text-xs mt-2 text-gray-400">Map view is currently disabled</p>
      </div>
    </div>
  );
};

const TransportOptions = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-pink mb-3">Transportation Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleSelect(option)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === option 
                ? 'border-pink bg-pink/10' 
                : 'border-gray-200 hover:border-pink/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{option.mode}</span>
              {selectedOption === option && <FaCheck className="text-pink" />}
            </div>
            <div className="text-gray-700">${option.price}/person</div>
          </div>
        ))}
      </div>
      {selectedOption && (
        <button
          onClick={() => {
            toast.promise(
              toursAPI.bookTransport(parseInt(options[0]?.id), selectedOption.mode),
              {
                loading: 'Booking transportation...',
                success: 'Transportation booked successfully!',
                error: 'Failed to book transportation'
              }
            );
          }}
          className="mt-4 bg-pink text-white px-4 py-2 rounded-lg hover:bg-darkpink transition-colors"
        >
          Book {selectedOption.mode}
        </button>
      )}
    </div>
  );
};

const RestaurantOptions = ({ restaurants, tourId }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    people: 2,
    type: 'dine-in'
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    toast.promise(
      toursAPI.bookRestaurant(tourId, selectedRestaurant.id, {
        ...bookingDetails,
        restaurantName: selectedRestaurant.name
      }),
      {
        loading: 'Booking restaurant...',
        success: 'Restaurant booked successfully!',
        error: 'Failed to book restaurant'
      }
    );
    
    setShowBookingForm(false);
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-pink mb-3">Nearby Restaurants</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{restaurant.name}</h4>
                  <p className="text-gray-600">{restaurant.cuisine} • {restaurant.priceRange}</p>
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
                <div>
                  {restaurant.dineIn && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-1">
                      Dine-in
                    </span>
                  )}
                  {restaurant.takeaway && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-1">
                      Takeaway
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setShowBookingForm(true);
                }}
                className="mt-4 bg-pink text-white w-full py-2 rounded-lg hover:bg-darkpink transition-colors"
              >
                Book a Table
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showBookingForm && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book at {selectedRestaurant.name}</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Number of People</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bookingDetails.people}
                  onChange={(e) => setBookingDetails({...bookingDetails, people: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Booking Type</label>
                <select
                  value={bookingDetails.type}
                  onChange={(e) => setBookingDetails({...bookingDetails, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink"
                >
                  {selectedRestaurant.dineIn && <option value="dine-in">Dine-in</option>}
                  {selectedRestaurant.takeaway && <option value="takeaway">Takeaway</option>}
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink text-white py-2 rounded-lg hover:bg-darkpink transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transportOption, setTransportOption] = useState(null);

  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => toursAPI.getById(id),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-peach" role="status" aria-label="Loading tour details">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink" aria-hidden="true"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-peach">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink mb-4">Error Loading Tour</h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-pink text-white rounded-lg hover:bg-darkpink font-bold text-lg"
            aria-label="Return to tours page"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-peach">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink mb-4">Tour Not Found</h2>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-pink text-white rounded-lg hover:bg-darkpink font-bold text-lg"
            aria-label="Return to tours page"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = async () => {
    try {
      await toursAPI.create({ 
        tourId: id,
        transport: transportOption ? transportOption.mode : null
      });
      toast.success('Tour booked successfully!');
      navigate('/booking');
    } catch (error) {
      toast.error('Failed to book tour. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${tour.title} - Tripy Plan`}</title>
        <meta name="description" content={tour.description} />
      </Helmet>
      
      <div className="min-h-screen bg-peach flex flex-col items-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg max-w-5xl w-full p-6 md:p-10 flex flex-col items-center"
          role="article"
        >
          <div className="w-full rounded-xl overflow-hidden mb-6" style={{ maxHeight: '400px' }}>
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col md:flex-row w-full justify-between items-center mb-4 gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-pink mb-2 md:mb-0">{tour.title}</h1>
            <div className="flex items-center gap-3">
              <span className="bg-darkpink text-white px-3 py-1 rounded-full text-base font-bold tracking-wide" role="text">{tour.category}</span>
              <span className="bg-peach text-pink px-3 py-1 rounded-full text-base font-bold tracking-wide" role="text">{tour.difficulty}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-6 w-full text-lg font-semibold text-gray-700" role="list">
            <div className="flex items-center gap-2" role="listitem">
              <FaMapMarkerAlt className="text-pink" aria-hidden="true" /> {tour.location}
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <FaClock className="text-pink" aria-hidden="true" /> {tour.duration}
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <FaStar className="text-yellow-400" aria-hidden="true" /> {tour.rating}
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <FaTag className="text-pink" aria-hidden="true" /> {tour.category}
            </div>
          </div>

          <div className="w-full mb-6">
            <h2 className="text-2xl font-bold text-pink mb-2">Overview</h2>
            <p className="text-gray-700 text-lg mb-4">{tour.description}</p>
            <h3 className="text-xl font-bold text-pink mb-2">Highlights</h3>
            <ul className="list-disc ml-6 text-gray-700 text-base mb-6" role="list">
              {tour.highlights.map((h, i) => (
                <li key={i} role="listitem">{h}</li>
              ))}
            </ul>
            
            {/* Google Maps Integration */}
            <h3 className="text-xl font-bold text-pink mb-3">Location</h3>
            <GoogleMap coordinates={tour.coordinates} title={tour.title} />
            
            {/* Transportation Options */}
            <TransportOptions 
              options={tour.transportOptions} 
              onSelect={setTransportOption} 
            />
            
            {/* Restaurant Options */}
            <RestaurantOptions 
              restaurants={tour.restaurants} 
              tourId={tour.id} 
            />
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-2xl font-extrabold text-pink">${tour.price}</div>
            <button
              className="bg-pink text-white font-bold px-8 py-3 rounded-lg hover:bg-darkpink transition text-lg shadow"
              onClick={handleBookNow}
              aria-label={`Book ${tour.title} tour for $${tour.price}`}
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TourDetails; 
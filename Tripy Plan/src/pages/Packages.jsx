import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { packages } from '../data/packages';
import { FaCalendarAlt, FaGem, FaMoneyBillWave, FaTag } from 'react-icons/fa';
import Logo from '../images/Logo.png';

const Packages = () => {
  const navigate = useNavigate();

  const handleBooking = (packageId) => {
    // In a real app, you would check if the user is logged in
    const isLoggedIn = localStorage.getItem('user');
    
    if (!isLoggedIn) {
      toast.error('Please login to book a package');
      navigate('/login');
      return;
    }

    // Store the selected package in localStorage
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    localStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
    
    // Navigate to booking page
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-peach font-playful">
      <Helmet>
        <title>Tour Packages - Tripy</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center pt-4 pb-8 text-darkpink">Special Tour Packages</h1>
        <p className="text-center text-lg mb-12 max-w-3xl mx-auto">Choose from our carefully curated packages designed to give you the perfect vacation experience. Save money and enjoy more with our all-inclusive options.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-60 object-cover" />
                {pkg.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-darkpink text-white font-bold px-3 py-1 rounded-full text-sm">
                    {pkg.discount}% OFF
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-2xl font-bold text-white">{pkg.title}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-peach text-darkpink px-3 py-1 rounded-full text-sm">
                    <FaCalendarAlt /> {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1 bg-peach text-darkpink px-3 py-1 rounded-full text-sm">
                    <FaGem /> {pkg.popularity} Demand
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2">Package Includes:</h3>
                <ul className="list-disc pl-5 mb-6 text-gray-600">
                  {pkg.inclusions.map((inclusion, idx) => (
                    <li key={idx}>{inclusion}</li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <div className="text-darkpink font-bold text-2xl">
                    ${pkg.price}
                    {pkg.discount > 0 && (
                      <span className="text-gray-400 line-through text-sm ml-2">
                        ${Math.round(pkg.price * (1 + pkg.discount/100))}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleBooking(pkg.id)}
                    className="bg-pink hover:bg-darkpink text-white font-bold px-6 py-2 rounded-lg transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* About Us Section */}
        <div className="bg-white rounded-2xl shadow-lg mx-auto p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-4 bg-darkpink text-white rounded-lg inline-block px-8 py-2">About Our Packages</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
            <div className="flex-1 flex flex-col items-center">
              <img src={Logo} alt="Tripy Logo" className="w-32 h-32 mb-2" />
              <div className="text-lg text-center">Because Every Journey Tells a Story! <span role='img' aria-label='heart'>❤️</span></div>
            </div>
            <div className="flex-1">
              <blockquote className="text-md md:text-lg text-gray-700 text-center md:text-left">
                "Our packages are designed with love and care to provide you with the best travel experience. We believe in creating memorable journeys that last a lifetime."<br/><br/>
                Every package is carefully curated to include the perfect balance of adventure, relaxation, and cultural experiences. We handle all the details so you can focus on making memories.<br/><br/>
                Join us for an unforgettable journey and let us take care of everything!
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages; 
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaDollarSign,
  FaBed,
  FaUtensils,
  FaPhone,
  FaTimes,
  FaDownload,
  FaShareAlt,
  FaPrint,
  FaStar,
  FaCommentAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BookedTours = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookedTours, setBookedTours] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'confirmed', 'pending', 'cancelled'

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to view your bookings');
      navigate('/login');
      return;
    }

    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Filter bookings for current user
    const userBookings = savedBookings.filter(booking => booking.userId === user.id);

    // Add status if not present
    const bookingsWithStatus = userBookings.map(booking => ({
      ...booking,
      bookingStatus: booking.bookingStatus || 'confirmed',
    }));

    setBookedTours(bookingsWithStatus);
  }, [user, navigate]);

  const handleCancelBooking = (bookingId) => {
    // Find the booking
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedAllBookings = allBookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, bookingStatus: 'cancelled' };
      }
      return booking;
    });
    
    localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
    
    // Update state
    setBookedTours(bookedTours.map(tour => {
      if (tour.id === bookingId) {
        return { ...tour, bookingStatus: 'cancelled' };
      }
      return tour;
    }));
    
    toast.success('Booking cancelled successfully!');
    
    // Close modal if open
    if (isModalOpen && selectedTour && selectedTour.id === bookingId) {
      setIsModalOpen(false);
      setSelectedTour(null);
    }
  };

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTour(null), 300);
  };

  const handleRateBooking = () => {
    // This would be connected to a real rating system in a production app
    toast.success('Thank you for your rating!');
    closeModal();
  };

  const handlePrintVoucher = () => {
    // In a real app, this would generate a printable voucher
    toast.success('Printing voucher...');
    window.print();
  };

  const handleShareBooking = () => {
    // In a real app, this would open a sharing dialog
    toast.success('Booking details copied to clipboard!');
  };

  const downloadInvoice = () => {
    // In a real app, this would generate and download an invoice PDF
    toast.success('Downloading invoice...');
  };

  const filteredTours = bookedTours.filter(tour => {
    // First filter by tab (upcoming/past)
    const tourDate = new Date(tour.startDate);
    const today = new Date();
    const isCorrectTimeframe = activeTab === 'upcoming' ? tourDate >= today : tourDate < today;

    // Then filter by status if needed
    if (filterStatus === 'all') {
      return isCorrectTimeframe;
    }
    
    return isCorrectTimeframe && tour.bookingStatus === filterStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>My Bookings - Tripy</title>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-darkpink mb-4 md:mb-0">My Bookings</h1>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-pink focus:border-pink"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <Link
              to="/packages"
              className="bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors"
            >
              Book New Tour
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'upcoming' ? 'bg-pink text-white' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Tours
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'past' ? 'bg-pink text-white' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Tours
            </button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={tour.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                {tour.image ? (
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-4xl text-gray-400" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(tour.bookingStatus)}`}>
                  {tour.bookingStatus.charAt(0).toUpperCase() + tour.bookingStatus.slice(1)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-pink" />
                  <p>{tour.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-pink" />
                    <p className="text-sm text-gray-500">{new Date(tour.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2 text-pink" />
                    <p className="text-sm text-gray-500">{tour.numberOfPeople} people</p>
                  </div>
                  <div className="flex items-center">
                    <FaBed className="mr-2 text-pink" />
                    <p className="text-sm text-gray-500">{tour.roomPreference}</p>
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="mr-2 text-pink" />
                    <p className="text-lg font-bold text-pink">${tour.totalPrice}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(tour)}
                    className="flex-1 bg-pink text-white py-2 rounded-lg hover:bg-darkpink transition-colors"
                  >
                    View Details
                  </button>
                  
                  {activeTab === 'upcoming' && tour.bookingStatus !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancelBooking(tour.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {activeTab === 'past' && (
                    <button 
                      onClick={() => handleViewDetails(tour)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <FaStar className="mr-2" /> Rate
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">No {activeTab} tours found.</p>
            <Link
              to="/packages"
              className="inline-block bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-darkpink">Booking Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Tour Info */}
              <div className="mb-6">
                <div className="relative h-48 mb-4">
                  {selectedTour.image ? (
                    <img
                      src={selectedTour.image}
                      alt={selectedTour.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                      <FaMapMarkerAlt className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTour.bookingStatus)}`}>
                    {selectedTour.bookingStatus.charAt(0).toUpperCase() + selectedTour.bookingStatus.slice(1)}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{selectedTour.title}</h3>
                <p className="text-gray-600 mb-4">{selectedTour.location}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500">Booking ID</p>
                    <p className="font-semibold">{selectedTour.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Booking Date</p>
                    <p className="font-semibold">{new Date(selectedTour.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-semibold">{new Date(selectedTour.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-semibold">{new Date(selectedTour.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-semibold">{selectedTour.numberOfPeople} people</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Room Type</p>
                    <p className="font-semibold">{selectedTour.roomPreference}</p>
                  </div>
                </div>

                {/* Contact & Payment Info */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-bold mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-semibold">{selectedTour.contactName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-semibold">{selectedTour.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-semibold">{selectedTour.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-semibold">{selectedTour.paymentMethod === 'credit_card' ? 'Credit Card' : selectedTour.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedTour.specialRequests && (
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <h4 className="font-bold mb-2">Special Requests</h4>
                    <p className="text-gray-600">{selectedTour.specialRequests}</p>
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-bold mb-3">Price Summary</h4>
                  <div className="flex justify-between mb-2">
                    <p>Tour Package ({selectedTour.price} × {selectedTour.numberOfPeople})</p>
                    <p>${selectedTour.price * selectedTour.numberOfPeople}</p>
                  </div>
                  {selectedTour.roomPreference === 'deluxe' && (
                    <div className="flex justify-between mb-2">
                      <p>Deluxe Room Upgrade</p>
                      <p>$100</p>
                    </div>
                  )}
                  {selectedTour.roomPreference === 'suite' && (
                    <div className="flex justify-between mb-2">
                      <p>Suite Upgrade</p>
                      <p>$200</p>
                    </div>
                  )}
                  <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
                    <p>Total</p>
                    <p className="text-pink">${selectedTour.totalPrice}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {selectedTour.bookingStatus !== 'cancelled' && activeTab === 'upcoming' && (
                    <button
                      onClick={() => handleCancelBooking(selectedTour.id)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" /> Cancel Booking
                    </button>
                  )}
                  
                  <button
                    onClick={handlePrintVoucher}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <FaPrint className="mr-2" /> Print Voucher
                  </button>
                  
                  <button
                    onClick={downloadInvoice}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" /> Invoice
                  </button>
                  
                  <button
                    onClick={handleShareBooking}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <FaShareAlt className="mr-2" /> Share
                  </button>
                </div>

                {/* Rating Section for Past Tours */}
                {activeTab === 'past' && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="font-bold mb-3">Rate Your Experience</h4>
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star}
                          className="text-2xl cursor-pointer text-gray-300 hover:text-yellow-400"
                        />
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your experience..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-pink focus:border-pink mb-3"
                      rows="3"
                    ></textarea>
                    <button
                      onClick={handleRateBooking}
                      className="bg-pink text-white py-2 px-4 rounded-lg hover:bg-darkpink transition-colors flex items-center justify-center"
                    >
                      <FaCommentAlt className="mr-2" /> Submit Review
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookedTours; 
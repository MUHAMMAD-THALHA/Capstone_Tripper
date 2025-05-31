import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    numberOfPeople: 1,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'credit_card',
    roomPreference: 'standard',
    dietaryRestrictions: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  useEffect(() => {
    if (!user) return;
    // Get the selected package from localStorage
    const packageData = localStorage.getItem('selectedPackage');
    if (!packageData) {
      toast.error('No package selected');
      navigate('/packages');
      return;
    }
    setSelectedPackage(JSON.parse(packageData));
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate end date based on duration
    const startDate = new Date(formData.startDate);
    const duration = parseInt(selectedPackage.duration);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    // In a real app, you would send this data to your backend
    const bookingData = {
      ...selectedPackage,
      ...formData,
      userId: user.id, // Add user ID to the booking
      totalPrice: selectedPackage.price * formData.numberOfPeople,
      endDate: endDate.toISOString().split('T')[0],
      bookingDate: new Date().toISOString(),
      bookingStatus: 'confirmed',
      paymentStatus: 'pending'
    };

    // Store the booking in localStorage (in a real app, this would be in your database)
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push({
      ...bookingData,
      id: Date.now(),
      status: 'upcoming'
    });
    localStorage.setItem('bookings', JSON.stringify(existingBookings));

    toast.success('Booking successful! Redirecting to payment...');
    // In a real app, you would redirect to a payment gateway
    setTimeout(() => {
      navigate('/booked-tours');
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!user) {
    return <RedirectToSignIn />;
  }
  if (!selectedPackage) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Book Tour - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-darkpink">Book Your Tour</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Package Summary */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{selectedPackage.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-bold">{selectedPackage.location}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-bold">{selectedPackage.duration}</p>
              </div>
              <div>
                <p className="text-gray-600">Price per person</p>
                <p className="font-bold">${selectedPackage.price}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Price</p>
                <p className="font-bold">${selectedPackage.price * formData.numberOfPeople}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Travel Details */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold mb-4">Travel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Number of People</label>
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Room Preference</label>
                  <select
                    name="roomPreference"
                    value={formData.roomPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Dietary Restrictions</label>
                  <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="Any dietary restrictions?"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold mb-4">Payment Information</h3>
              <div>
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-gray-700 mb-2">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                placeholder="Any special requirements or requests?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-pink text-white py-3 rounded-lg hover:bg-darkpink transition-colors"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking; 
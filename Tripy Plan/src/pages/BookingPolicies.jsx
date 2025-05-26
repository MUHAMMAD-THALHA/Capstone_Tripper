import React from 'react';
import { Helmet } from 'react-helmet-async';

const BookingPolicies = () => {
  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Booking & Cancellation Policies - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-darkpink">Booking & Cancellation Policies</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">1. Booking Process</h2>
            <p className="text-gray-700">
              To book a tour with Tripy:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Select your desired tour package</li>
              <li>Choose your preferred dates</li>
              <li>Provide required personal information</li>
              <li>Make the payment through our secure payment gateway</li>
              <li>Receive booking confirmation via email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">2. Payment Terms</h2>
            <p className="text-gray-700">
              We accept various payment methods including credit cards, debit cards, and online banking.
              A deposit of 30% is required to confirm your booking, with the remaining balance due 30 days
              before the tour start date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">3. Cancellation Policy</h2>
            <div className="text-gray-700">
              <p className="mb-2">Cancellation charges apply as follows:</p>
              <ul className="list-disc ml-6">
                <li>More than 30 days before departure: 10% of total cost</li>
                <li>15-30 days before departure: 30% of total cost</li>
                <li>7-14 days before departure: 50% of total cost</li>
                <li>Less than 7 days before departure: 100% of total cost</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">4. Refund Process</h2>
            <p className="text-gray-700">
              Refunds will be processed within 7-10 business days after cancellation approval.
              The refund amount will be credited to the original payment method used for booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">5. Changes to Booking</h2>
            <p className="text-gray-700">
              Changes to booking dates or tour packages are subject to availability and may incur
              additional charges. Please contact our customer service at least 15 days before the
              tour start date for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">6. Contact Us</h2>
            <p className="text-gray-700">
              For any questions regarding bookings or cancellations, please contact us at:
              <br />
              Email: bookings@tripy.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicies; 
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Privacy & Policies - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-darkpink">Privacy & Policies</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">1. Information Collection</h2>
            <p className="text-gray-700">
              We collect information that you provide directly to us, including when you create an account,
              make a booking, or contact our customer service. This may include your name, email address,
              phone number, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">2. Use of Information</h2>
            <p className="text-gray-700">
              We use the information we collect to:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Process your bookings and payments</li>
              <li>Send you booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">3. Data Security</h2>
            <p className="text-gray-700">
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">4. Cookies</h2>
            <p className="text-gray-700">
              We use cookies to improve your browsing experience and analyze website traffic.
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">5. Third-Party Services</h2>
            <p className="text-gray-700">
              We may use third-party services for payment processing, analytics, and marketing.
              These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-pink">6. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about our privacy policy, please contact us at:
              <br />
              Email: privacy@tripy.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 
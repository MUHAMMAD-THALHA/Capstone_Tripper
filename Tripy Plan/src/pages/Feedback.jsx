import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast.success('Thank you for your feedback! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'feedback'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Feedback & Complaints - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-darkpink">Feedback & Complaints</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-pink">Contact Us</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Customer Support:</strong><br />
                  Email: support@tripy.com<br />
                  Phone: +1 (555) 123-4567
                </p>
                <p className="text-gray-700">
                  <strong>Office Hours:</strong><br />
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong><br />
                  123 Travel Street<br />
                  Tourism City, TC 12345<br />
                  United States
                </p>
              </div>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-darkpink text-white py-2 px-4 rounded-lg hover:bg-pink transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 
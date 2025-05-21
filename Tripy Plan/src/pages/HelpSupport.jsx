import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaWhatsapp, FaQuestionCircle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-bold text-lg text-darkpink"
      >
        <span>{question}</span>
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const HelpSupport = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', contactForm);
    
    // Show success message
    toast.success('Your message has been sent. We will get back to you soon!');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  const faqs = [
    {
      question: "How do I book a tour?",
      answer: "You can book a tour by browsing our available tours, selecting the one you're interested in, choosing your preferred dates, and completing the booking process. You'll need to create an account or log in to finalize your booking."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies depending on how far in advance you cancel. Generally, cancellations made 30+ days before departure receive a 90% refund, 15-30 days receive a 70% refund, 7-14 days receive a 50% refund, and less than 7 days are non-refundable. Please refer to our Booking & Cancellation Policies page for full details."
    },
    {
      question: "Can I modify my booking after it's confirmed?",
      answer: "Yes, you can modify your booking subject to availability. Please contact our support team as soon as possible if you need to make changes. Modification fees may apply depending on how close to the departure date the changes are made."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway."
    },
    {
      question: "Do I need travel insurance?",
      answer: "While not mandatory, we strongly recommend purchasing travel insurance for your trip. Travel insurance can provide coverage for trip cancellations, medical emergencies, lost luggage, and other unforeseen events."
    }
  ];

  return (
    <div className="min-h-screen bg-peach">
      <Helmet>
        <title>Help & Support - Tripy</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-darkpink mb-8">Help & Support</h1>
        
        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-pink mb-6">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-6">
                We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-pink text-xl" />
                  <span className="text-gray-700">support@tripy.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-pink text-xl" />
                  <span className="text-gray-700">+91 9012345678</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaWhatsapp className="text-pink text-xl" />
                  <span className="text-gray-700">+91 9012345678</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-2">Business Hours:</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Message</label>
                  <textarea 
                    name="message"
                    value={contactForm.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="bg-pink hover:bg-darkpink text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FaQuestionCircle className="text-pink text-2xl" />
            <h2 className="text-2xl font-bold text-pink">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
        
        {/* Policies Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 text-center">
          <h2 className="text-xl font-bold text-pink mb-4">Helpful Resources</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="bg-peach hover:bg-pink text-darkpink hover:text-white px-4 py-2 rounded-lg transition-colors">
              Privacy Policy
            </Link>
            <Link to="/booking-policies" className="bg-peach hover:bg-pink text-darkpink hover:text-white px-4 py-2 rounded-lg transition-colors">
              Booking & Cancellation
            </Link>
            <Link to="/feedback" className="bg-peach hover:bg-pink text-darkpink hover:text-white px-4 py-2 rounded-lg transition-colors">
              Feedback & Complaints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 
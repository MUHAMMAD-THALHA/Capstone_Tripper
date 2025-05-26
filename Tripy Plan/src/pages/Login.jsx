import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaPhone, FaCamera, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithMobile, loginWithFacialRecognition } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mobileFormData, setMobileFormData] = useState({
    phoneNumber: '',
    otp: '',
    otpSent: false
  });
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'mobile', 'facial'
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    setMobileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success('Login with Google successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Google login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!mobileFormData.phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    
    // Simulate OTP sending
    toast.success('OTP sent! Use 123456 for demo');
    setMobileFormData(prev => ({
      ...prev,
      otpSent: true
    }));
  };

  const handleMobileLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await loginWithMobile(mobileFormData.phoneNumber, mobileFormData.otp);
      if (result.success) {
        toast.success('Login with mobile successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Mobile login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startFacialRecognition = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error('Failed to access camera. Please check your permissions.');
      console.error('Error accessing camera:', error);
    }
  };

  const handleFacialLogin = async () => {
    setLoading(true);
    
    // Simulate taking a photo - in a real app, you would actually capture image data
    // and send it to your facial recognition API
    setTimeout(async () => {
      try {
        stopCamera();
        const result = await loginWithFacialRecognition("facial_data_placeholder");
        if (result.success) {
          toast.success('Facial recognition successful!');
          navigate('/');
        } else {
          toast.error(result.error || 'Facial recognition failed. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchToMethod = (method) => {
    stopCamera();
    setLoginMethod(method);
  };

  return (
    <div className="min-h-screen bg-peach flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Login - Tripy</title>
      </Helmet>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-darkpink">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-pink hover:text-darkpink">
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => switchToMethod('email')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loginMethod === 'email' ? 'bg-pink text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => switchToMethod('mobile')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loginMethod === 'mobile' ? 'bg-pink text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => switchToMethod('facial')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loginMethod === 'facial' ? 'bg-pink text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Face ID
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink focus:border-pink focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink focus:border-pink focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink hover:bg-darkpink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              {/* Google login button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink"
                >
                  <FaGoogle className="text-red-500" />
                  Continue with Google
                </button>
              </div>
            </form>
          </>
        )}

        {/* Mobile Login Form */}
        {loginMethod === 'mobile' && (
          <div className="mt-8 space-y-6">
            {!mobileFormData.otpSent ? (
              <div>
                <div className="rounded-md shadow-sm mb-4">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={mobileFormData.phoneNumber}
                    onChange={handleMobileChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink focus:border-pink focus:z-10 sm:text-sm"
                    placeholder="Phone number"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink hover:bg-darkpink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <form onSubmit={handleMobileLogin}>
                <div className="rounded-md shadow-sm mb-4">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={mobileFormData.otp}
                    onChange={handleMobileChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink focus:border-pink focus:z-10 sm:text-sm"
                    placeholder="Enter OTP"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setMobileFormData(prev => ({ ...prev, otpSent: false }))}
                    className="flex items-center justify-center gap-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink"
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink hover:bg-darkpink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Verifying...' : 'Verify and Login'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Facial Recognition */}
        {loginMethod === 'facial' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              {stream ? (
                <div className="text-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600 mb-4">
                    Please center your face in the camera
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleFacialLogin}
                      disabled={loading}
                      className={`flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink hover:bg-darkpink focus:outline-none ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Recognizing...' : 'Recognize Face'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                    <FaCamera className="text-5xl text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={startFacialRecognition}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink hover:bg-darkpink focus:outline-none"
                  >
                    <FaCamera /> Start Camera
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 
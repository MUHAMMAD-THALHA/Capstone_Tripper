import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email/Password sign in
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.href = '/';
      } else {
        setError('Check your credentials and try again.');
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Login failed.');
    }
    setLoading(false);
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({ strategy: 'oauth_google' });
    } catch (err) {
      setError('Google sign in failed.');
    }
    setLoading(false);
  };

  // Phone/OTP sign in
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn.create({ identifier: phone, strategy: 'phone_code' });
      setOtpSent(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'phone_code', code: otp });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.href = '/';
      } else {
        setError('Invalid OTP.');
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'OTP verification failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFD1DC' }} className="flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8" style={{ fontFamily: 'Caveat, Pacifico, Comic Sans MS, Comic Sans, cursive, sans-serif' }}>
        <h2 className="text-center text-3xl font-extrabold text-pink-700 mb-2" style={{ color: '#FF69B4', fontFamily: 'Pacifico, Caveat, cursive' }}>Sign in to your account</h2>
        <p className="text-center text-md mb-6" style={{ color: '#FF69B4' }}>Or create a new account</p>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setTab('email')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${tab === 'email' ? 'bg-pink-400 text-white' : 'bg-pink-100 text-pink-700'}`}
          >
            Email
          </button>
          <button
            onClick={() => setTab('mobile')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${tab === 'mobile' ? 'bg-pink-400 text-white' : 'bg-pink-100 text-pink-700'}`}
          >
            Mobile
          </button>
        </div>
        {tab === 'email' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              style={{ fontFamily: 'inherit' }}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              style={{ fontFamily: 'inherit' }}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded bg-pink-400 text-white font-bold hover:bg-pink-500 transition-colors"
              style={{ fontFamily: 'inherit' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 rounded bg-white border border-pink-400 text-pink-700 font-bold flex items-center justify-center gap-2 mt-2 hover:bg-pink-50"
              style={{ fontFamily: 'inherit' }}
            >
              <span style={{ color: '#EA4335', fontSize: '1.2em' }}>G</span> Continue with Google
            </button>
          </form>
        )}
        {tab === 'mobile' && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <input
              type="tel"
              required
              placeholder="Phone number (e.g. +1234567890)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              style={{ fontFamily: 'inherit' }}
              disabled={otpSent}
            />
            {otpSent && (
              <input
                type="text"
                required
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-4 py-2 rounded border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                style={{ fontFamily: 'inherit' }}
              />
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded bg-pink-400 text-white font-bold hover:bg-pink-500 transition-colors"
              style={{ fontFamily: 'inherit' }}
            >
              {loading ? (otpSent ? 'Verifying...' : 'Sending OTP...') : (otpSent ? 'Verify and Login' : 'Send OTP')}
            </button>
            {otpSent && (
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="w-full py-2 rounded bg-pink-100 text-pink-700 font-bold hover:bg-pink-200 transition-colors"
                style={{ fontFamily: 'inherit' }}
              >
                Back
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 
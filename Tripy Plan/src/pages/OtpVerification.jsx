import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import {
    FaPhone,
    FaShieldAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaRedo,
    FaLock,
} from 'react-icons/fa';

// Country codes for the selector
const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'SG', flag: '🇸🇬' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
];

const OtpVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const redirectTo = location.state?.redirectTo || '/booking';

    // State
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [phoneResource, setPhoneResource] = useState(null);
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);

    // Refs
    const otpRefs = useRef([]);

    // Timer countdown for resend OTP
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && step === 'otp') {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    // Check if user already has a verified phone
    useEffect(() => {
        if (user) {
            const verifiedPhone = user.phoneNumbers?.find(p => p.verification?.status === 'verified');
            if (verifiedPhone) {
                sessionStorage.setItem('phoneVerified', 'true');
                sessionStorage.setItem('verifiedPhone', verifiedPhone.phoneNumber);
            }
        }
    }, [user]);

    // Send OTP using Clerk
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 6) {
            toast.error('Please enter a valid phone number');
            return;
        }

        if (!user) {
            toast.error('Please sign in first');
            navigate('/sign-in');
            return;
        }

        setLoading(true);
        try {
            const fullNumber = `${countryCode}${phoneNumber}`;

            // Create a phone number on the user's Clerk profile
            const phone = await user.createPhoneNumber({ phoneNumber: fullNumber });

            // Send verification code
            await phone.prepareVerification();

            setPhoneResource(phone);
            setStep('otp');
            setTimer(60);
            setCanResend(false);
            toast.success(`OTP sent to ${fullNumber}`);
        } catch (error) {
            console.error('Send OTP error:', error);
            const errMsg = error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error.message;
            if (errMsg?.includes('already been taken') || errMsg?.includes('already exists')) {
                // Phone already exists on user, try to re-verify
                try {
                    const existingPhone = user.phoneNumbers?.find(
                        p => p.phoneNumber === `${countryCode}${phoneNumber}`
                    );
                    if (existingPhone) {
                        if (existingPhone.verification?.status === 'verified') {
                            // Already verified!
                            setStep('success');
                            sessionStorage.setItem('phoneVerified', 'true');
                            sessionStorage.setItem('verifiedPhone', existingPhone.phoneNumber);
                            toast.success('Phone already verified!');
                            setTimeout(() => navigate(redirectTo), 2000);
                            return;
                        }
                        await existingPhone.prepareVerification();
                        setPhoneResource(existingPhone);
                        setStep('otp');
                        setTimer(60);
                        setCanResend(false);
                        toast.success(`OTP sent to ${countryCode}${phoneNumber}`);
                        return;
                    }
                } catch (retryErr) {
                    console.error('Retry error:', retryErr);
                }
                toast.error('This phone number is already associated with another account.');
            } else if (errMsg?.includes('too many')) {
                toast.error('Too many attempts. Please try again later.');
            } else if (errMsg?.includes('invalid')) {
                toast.error('Invalid phone number. Please check and try again.');
            } else {
                toast.error(errMsg || 'Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP using Clerk
    const handleVerifyOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const result = await phoneResource.attemptVerification({ code: otpCode });

            if (result.verification?.status === 'verified') {
                setStep('success');
                sessionStorage.setItem('phoneVerified', 'true');
                sessionStorage.setItem('verifiedPhone', phoneResource.phoneNumber);
                toast.success('Phone number verified successfully!');

                // Reload user to reflect changes
                await user.reload();

                // Redirect after a short delay
                setTimeout(() => {
                    navigate(redirectTo);
                }, 2000);
            } else {
                toast.error('Verification failed. Please try again.');
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            const errMsg = error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error.message;
            if (errMsg?.includes('incorrect') || errMsg?.includes('invalid')) {
                toast.error('Invalid OTP. Please check and try again.');
            } else if (errMsg?.includes('expired')) {
                toast.error('OTP has expired. Please request a new one.');
            } else {
                toast.error(errMsg || 'Verification failed. Please try again.');
            }
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setOtp(['', '', '', '', '', '']);
        setCanResend(false);
        setLoading(true);
        try {
            await phoneResource.prepareVerification();
            setTimer(60);
            toast.success('New OTP sent!');
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error('Failed to resend OTP. Please try again.');
            setCanResend(true);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input change with auto-focus
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (newOtp.every((d) => d !== '') && index === 5) {
            setTimeout(() => handleVerifyOtp(), 300);
        }
    };

    // Handle backspace on OTP input
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste on OTP input
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const newOtp = pasted.split('');
            setOtp(newOtp);
            otpRefs.current[5]?.focus();
        }
    };

    // Floating particles background
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 4,
    }));

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)',
            }}
        >
            {/* Animated Background Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full opacity-20"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #e94560, transparent)' }}
            />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #533483, transparent)' }}
            />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Glass Card */}
                <div
                    className="rounded-3xl p-8 shadow-2xl border border-white/10"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Back Button */}
                    {step !== 'success' && (
                        <button
                            onClick={() => step === 'otp' ? setStep('phone') : navigate(-1)}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
                        >
                            <FaArrowLeft size={12} />
                            {step === 'otp' ? 'Change number' : 'Go back'}
                        </button>
                    )}

                    {/* Header Icon */}
                    <motion.div
                        className="flex justify-center mb-6"
                        animate={step === 'success' ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{
                                background: step === 'success'
                                    ? 'linear-gradient(135deg, #00b894, #00cec9)'
                                    : 'linear-gradient(135deg, #e94560, #f5a623)',
                            }}
                        >
                            {step === 'success' ? (
                                <FaCheckCircle size={36} className="text-white" />
                            ) : step === 'otp' ? (
                                <FaShieldAlt size={36} className="text-white" />
                            ) : (
                                <FaPhone size={36} className="text-white" />
                            )}
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {/* ============= STEP 1: PHONE INPUT ============= */}
                        {step === 'phone' && (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    Verify Your Phone
                                </h2>
                                <p className="text-white/50 text-center text-sm mb-8">
                                    We'll send a 6-digit OTP to verify your phone number
                                </p>

                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    {/* Phone Input */}
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">
                                            Phone Number
                                        </label>
                                        <div className="flex gap-2">
                                            {/* Country Code Selector */}
                                            <select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                className="rounded-xl px-3 py-3.5 text-white text-sm font-medium w-28 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.08)',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                }}
                                            >
                                                {countryCodes.map((cc) => (
                                                    <option key={cc.code} value={cc.code} className="bg-gray-900">
                                                        {cc.flag} {cc.code}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Phone Number Input */}
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                placeholder="Enter phone number"
                                                className="flex-1 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.08)',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                }}
                                                maxLength={15}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* Send OTP Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading || !phoneNumber}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                        style={{
                                            background: loading
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'linear-gradient(135deg, #e94560, #f5a623)',
                                            boxShadow: !loading ? '0 8px 32px rgba(233, 69, 96, 0.3)' : 'none',
                                        }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                    className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                                Sending OTP...
                                            </span>
                                        ) : (
                                            'Send OTP'
                                        )}
                                    </motion.button>
                                </form>

                                {/* Security Note */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-white/30 text-xs">
                                    <FaLock size={10} />
                                    <span>Secured by Clerk authentication</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ============= STEP 2: OTP INPUT ============= */}
                        {step === 'otp' && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    Enter OTP
                                </h2>
                                <p className="text-white/50 text-center text-sm mb-8">
                                    Sent to{' '}
                                    <span className="text-white/80 font-medium">
                                        {countryCode} {phoneNumber}
                                    </span>
                                </p>

                                {/* OTP Input Boxes */}
                                <div className="flex justify-center gap-3 mb-8">
                                    {otp.map((digit, index) => (
                                        <motion.input
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            maxLength={1}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="w-12 h-14 text-center text-xl font-bold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/60 transition-all"
                                            style={{
                                                background: digit
                                                    ? 'rgba(233, 69, 96, 0.15)'
                                                    : 'rgba(255, 255, 255, 0.08)',
                                                border: digit
                                                    ? '2px solid rgba(233, 69, 96, 0.5)'
                                                    : '1px solid rgba(255, 255, 255, 0.15)',
                                            }}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>

                                {/* Verify Button */}
                                <motion.button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.some((d) => d === '')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                    style={{
                                        background: loading
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'linear-gradient(135deg, #e94560, #f5a623)',
                                        boxShadow: !loading ? '0 8px 32px rgba(233, 69, 96, 0.3)' : 'none',
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </motion.button>

                                {/* Timer & Resend */}
                                <div className="mt-6 text-center">
                                    {!canResend ? (
                                        <p className="text-white/40 text-sm">
                                            Resend OTP in{' '}
                                            <span className="text-white/70 font-mono font-bold">
                                                {String(Math.floor(timer / 60)).padStart(2, '0')}:
                                                {String(timer % 60).padStart(2, '0')}
                                            </span>
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleResendOtp}
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 mx-auto text-sm font-medium transition-colors"
                                            style={{ color: '#f5a623' }}
                                        >
                                            <FaRedo size={12} />
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ============= STEP 3: SUCCESS ============= */}
                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                            >
                                {/* Animated checkmark */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(0,184,148,0.2), rgba(0,206,201,0.2))',
                                        border: '2px solid rgba(0,184,148,0.4)',
                                    }}
                                >
                                    <FaCheckCircle size={48} className="text-green-400" />
                                </motion.div>

                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Verified Successfully!
                                </h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Your phone number has been verified. Redirecting...
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, ease: 'linear' }}
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #00b894, #00cec9)' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom glow effect */}
                <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30"
                    style={{
                        background: step === 'success'
                            ? 'linear-gradient(90deg, #00b894, #00cec9)'
                            : 'linear-gradient(90deg, #e94560, #f5a623)',
                    }}
                />
            </motion.div>
        </div>
    );
};

export default OtpVerification;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear any potentially corrupted data
        authService.logout();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // For backwards compatibility with previous implementation
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const savedUser = users.find(u => u.email === email && u.password === password);
      
      if (savedUser) {
        // Use saved user data instead of API for demo purposes
        const userData = {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
          authMethod: 'email'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      
      // If no user found in localStorage, try API (will work when backend is running)
      try {
        const response = await authService.login({ email, password });
        if (response.success) {
          setUser(response.user);
          return { success: true };
        } else {
          return { success: false, error: response.error || 'Login failed' };
        }
      } catch (apiError) {
        console.error('API login error:', apiError);
        return { success: false, error: 'Server error or not available. Try demo account: user@example.com / password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // For backwards compatibility with previous implementation
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Try API first (will work when backend is running)
      try {
        const response = await authService.register({ name, email, password });
        if (response.success) {
          setUser(response.user);
          return { success: true };
        } else {
          return { success: false, error: response.error || 'Registration failed' };
        }
      } catch (apiError) {
        // If API fails, fall back to localStorage for demo
        console.log('API not available, using localStorage for demo');
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password
        };

        // Save to users list
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Create user session without password
        const userData = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          authMethod: 'email'
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // In a real implementation, this would integrate with Google's OAuth API
      // For now we're just simulating this behavior
      
      const userData = {
        id: `google_${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
        authMethod: 'google'
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithMobile = async (phoneNumber, otp) => {
    try {
      // Simulate mobile number verification
      // In a real implementation, this would integrate with a SMS verification service
      
      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP' };
      }

      const userData = {
        id: `mobile_${Date.now()}`,
        phoneNumber,
        name: 'Mobile User',
        authMethod: 'mobile'
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Mobile login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithFacialRecognition = async (imageData) => {
    try {
      // Simulate facial recognition
      // In a real implementation, this would integrate with a facial recognition API
      
      const userData = {
        id: `facial_${Date.now()}`,
        name: 'Facial Recognition User',
        authMethod: 'facial'
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Facial recognition error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithMobile,
    loginWithFacialRecognition
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
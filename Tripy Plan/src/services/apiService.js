import axios from 'axios';

const API_URL = 'http://localhost:3080';

export const authService = {
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Login with email and password
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, { email, password });
      if (response.data.message === 'success') {
        const userData = {
          email,
          token: response.data.token,
          authMethod: 'email'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Register new user
  register: async ({ name, email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, { email, password });
      if (response.data.message === 'success') {
        const userData = {
          name,
          email,
          token: response.data.token,
          authMethod: 'email'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/verify`, {}, {
        headers: { 'jwt-token': token }
      });
      return response.data.message === 'success';
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Check if account exists
  checkAccount: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/check-account`, { email });
      return response.data.userExists;
    } catch (error) {
      console.error('Account check error:', error);
      return false;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
  }
}; 
import axios from 'axios';

// Create axios instance
const API_URL = '/api'; // This will use the proxy set up in vite.config.js

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API unavailable by falling back to mock data
    if (!error.response) {
      console.warn('API server appears to be offline. Using mock data.');
      
      // Return mock response for common endpoints
      const url = error.config.url;
      const method = error.config.method;
      
      if (url.includes('/tours') && method === 'get') {
        // Mock response for GET /tours
        return Promise.resolve({
          data: mockTours
        });
      }
      
      if (url.includes('/bookings') && method === 'get') {
        // Mock response for GET /bookings
        return Promise.resolve({
          data: mockBookings
        });
      }
    }
    
    // Handle unauthorized access (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

// Tours Services
export const toursService = {
  getAll: async () => {
    const response = await api.get('/tours');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },
  
  search: async (query) => {
    const response = await api.get('/tours', { params: { q: query } });
    return response.data;
  },
};

// Bookings Services
export const bookingsService = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// Mock data for offline fallback
const mockTours = [
  {
    id: 1,
    title: 'Bali Paradise Adventure',
    location: 'Bali, Indonesia',
    duration: '7 Days',
    price: 1299,
    rating: 4.8,
    category: 'Adventure',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Experience the perfect blend of adventure and relaxation in the beautiful island of Bali.',
  },
  {
    id: 2,
    title: 'Swiss Alps Explorer',
    location: 'Swiss Alps',
    duration: '5 Days',
    price: 1499,
    rating: 4.9,
    category: 'Mountain',
    difficulty: 'Challenging',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Embark on an exhilarating journey through the majestic Swiss Alps.',
  },
  {
    id: 3,
    title: 'Kyoto Cultural Journey',
    location: 'Kyoto, Japan',
    duration: '6 Days',
    price: 1699,
    rating: 4.7,
    category: 'Cultural',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Immerse yourself in the rich cultural heritage of Kyoto, Japan\'s former imperial capital.',
  },
];

const mockBookings = [
  {
    id: 101,
    tourId: 1,
    userId: 1,
    startDate: '2023-08-10',
    endDate: '2023-08-17',
    numberOfPeople: 2,
    totalPrice: 2598,
    status: 'confirmed',
    title: 'Bali Paradise Adventure',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  }
];

export default api; 
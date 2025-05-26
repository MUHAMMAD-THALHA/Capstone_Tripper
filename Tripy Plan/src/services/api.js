import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Expanded mock data for tours
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
    description: 'Experience the perfect blend of adventure and relaxation in the beautiful island of Bali. From pristine beaches to lush rice terraces, this tour offers an unforgettable journey through Indonesian culture and natural beauty.',
    highlights: [
      'Visit the sacred Uluwatu Temple',
      'Explore the Tegallalang Rice Terraces',
      'Snorkeling at Blue Lagoon',
      'Traditional Balinese cooking class',
      'Sunset at Tanah Lot Temple'
    ],
    coordinates: {
      lat: -8.4095178,
      lng: 115.188916
    },
    transportOptions: [
      { mode: 'Car', price: 50, available: true },
      { mode: 'Scooter', price: 20, available: true },
      { mode: 'Group Van', price: 30, available: true }
    ],
    restaurants: [
      { 
        id: 101, 
        name: 'Warung Babi Guling Ibu Oka', 
        cuisine: 'Indonesian',
        rating: 4.6,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        dineIn: true,
        takeaway: true
      },
      { 
        id: 102, 
        name: 'Locavore', 
        cuisine: 'Fine Dining',
        rating: 4.9,
        priceRange: '$$$$',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        dineIn: true,
        takeaway: false
      }
    ]
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
    description: 'Embark on an exhilarating journey through the majestic Swiss Alps. This tour combines breathtaking mountain views, charming alpine villages, and thrilling outdoor activities.',
    highlights: [
      'Cable car ride to Matterhorn',
      'Hiking in Zermatt',
      'Visit to Jungfraujoch',
      'Swiss chocolate tasting',
      'Scenic train journey'
    ],
    coordinates: {
      lat: 46.0207,
      lng: 7.7491
    },
    transportOptions: [
      { mode: 'Train', price: 120, available: true },
      { mode: 'Cable Car', price: 80, available: true },
      { mode: 'Mountain Bike', price: 60, available: true }
    ],
    restaurants: [
      { 
        id: 201, 
        name: 'Chez Vrony', 
        cuisine: 'Swiss',
        rating: 4.8,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
        dineIn: true,
        takeaway: true
      },
      { 
        id: 202, 
        name: 'Mountain Lodge Restaurant', 
        cuisine: 'Alpine',
        rating: 4.7,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1537624204811-d3ca1458fd64',
        dineIn: true,
        takeaway: false
      }
    ]
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
    description: 'Immerse yourself in the rich cultural heritage of Kyoto, Japan\'s former imperial capital. This tour offers a perfect blend of traditional Japanese culture, stunning temples, and beautiful gardens.',
    highlights: [
      'Visit Fushimi Inari Shrine',
      'Tea ceremony experience',
      'Arashiyama Bamboo Grove',
      'Kinkaku-ji (Golden Pavilion)',
      'Traditional kimono wearing'
    ],
    coordinates: {
      lat: 35.0116,
      lng: 135.7681
    },
    transportOptions: [
      { mode: 'Subway', price: 30, available: true },
      { mode: 'Bicycle', price: 15, available: true },
      { mode: 'Walking Tour', price: 0, available: true }
    ],
    restaurants: [
      { 
        id: 301, 
        name: 'Tempura Endo', 
        cuisine: 'Japanese',
        rating: 4.9,
        priceRange: '$$$$',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
        dineIn: true,
        takeaway: false
      },
      { 
        id: 302, 
        name: 'Nishiki Market Food Stalls', 
        cuisine: 'Street Food',
        rating: 4.5,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1545622783-b3e021430fee',
        dineIn: false,
        takeaway: true
      }
    ]
  },
  {
    id: 4,
    title: 'Egyptian Pyramids Tour',
    location: 'Cairo, Egypt',
    duration: '5 Days',
    price: 1299,
    rating: 4.6,
    category: 'Historical',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Explore the ancient wonders of Egypt and uncover the mysteries of the pyramids. This tour takes you through Cairo\'s historic sites and offers insights into one of the world\'s oldest civilizations.',
    highlights: [
      'Great Pyramids of Giza',
      'Egyptian Museum tour',
      'Nile River cruise',
      'Khan el-Khalili bazaar',
      'Sound and Light show at the Sphinx'
    ],
    coordinates: {
      lat: 29.9773,
      lng: 31.1325
    },
    transportOptions: [
      { mode: 'Private Car', price: 60, available: true },
      { mode: 'Camel Ride', price: 40, available: true },
      { mode: 'Group Tour Bus', price: 25, available: true }
    ],
    restaurants: [
      { 
        id: 401, 
        name: 'Abou El Sid', 
        cuisine: 'Egyptian',
        rating: 4.7,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
        dineIn: true,
        takeaway: true
      },
      { 
        id: 402, 
        name: 'Pyramids View Restaurant', 
        cuisine: 'Middle Eastern',
        rating: 4.4,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        dineIn: true,
        takeaway: false
      }
    ]
  },
  {
    id: 5,
    title: 'New York City Experience',
    location: 'New York, USA',
    duration: '4 Days',
    price: 1899,
    rating: 4.5,
    category: 'Urban',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Discover the energy and excitement of the Big Apple. From iconic landmarks to diverse neighborhoods, this tour offers the quintessential New York experience.',
    highlights: [
      'Statue of Liberty and Ellis Island',
      'Broadway show experience',
      'Central Park tour',
      'Museum of Modern Art',
      'Brooklyn Bridge walk'
    ],
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    },
    transportOptions: [
      { mode: 'Subway', price: 25, available: true },
      { mode: 'Taxi', price: 100, available: true },
      { mode: 'Walking Tour', price: 0, available: true }
    ],
    restaurants: [
      { 
        id: 501, 
        name: 'Katz\'s Delicatessen', 
        cuisine: 'American',
        rating: 4.6,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1515539408953-9403f070ad2e',
        dineIn: true,
        takeaway: true
      },
      { 
        id: 502, 
        name: 'Le Bernardin', 
        cuisine: 'French',
        rating: 4.9,
        priceRange: '$$$$',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        dineIn: true,
        takeaway: false
      }
    ]
  },
  {
    id: 6,
    title: 'Amazon Rainforest Expedition',
    location: 'Manaus, Brazil',
    duration: '8 Days',
    price: 2399,
    rating: 4.7,
    category: 'Adventure',
    difficulty: 'Challenging',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    description: 'Journey into the heart of the Amazon rainforest for an unforgettable adventure. Experience the incredible biodiversity and learn about indigenous cultures in this pristine natural environment.',
    highlights: [
      'Jungle trekking expeditions',
      'Canopy walkway experience',
      'River dolphin watching',
      'Indigenous village visit',
      'Night safari adventure'
    ],
    coordinates: {
      lat: -3.1190,
      lng: -60.0217
    },
    transportOptions: [
      { mode: 'River Boat', price: 70, available: true },
      { mode: 'Jungle Jeep', price: 90, available: true },
      { mode: 'Canoe', price: 40, available: true }
    ],
    restaurants: [
      { 
        id: 601, 
        name: 'Banzeiro', 
        cuisine: 'Amazonian',
        rating: 4.8,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1515668236457-83c3b8764839',
        dineIn: true,
        takeaway: false
      },
      { 
        id: 602, 
        name: 'Jungle Lodge Restaurant', 
        cuisine: 'Brazilian',
        rating: 4.5,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        dineIn: true,
        takeaway: true
      }
    ]
  }
];

// API service for tours
export const toursAPI = {
  // Get all tours
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTours;
  },

  // Get tour by ID
  getById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const tour = mockTours.find(t => t.id === parseInt(id));
    if (!tour) {
      throw new Error('Tour not found');
    }
    return tour;
  },

  // Search tours by query
  search: async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!query) return mockTours;

    const lowerQuery = query.toLowerCase();
    return mockTours.filter(tour => 
      tour.title.toLowerCase().includes(lowerQuery) ||
      tour.location.toLowerCase().includes(lowerQuery) ||
      tour.description.toLowerCase().includes(lowerQuery) ||
      tour.category.toLowerCase().includes(lowerQuery) ||
      tour.highlights.some(h => h.toLowerCase().includes(lowerQuery))
    );
  },

  // Book a transport option
  bookTransport: async (tourId, transportMode) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Transport booked:', { tourId, transportMode });
    return { success: true, booking: { tourId, transportMode, bookingId: Math.floor(Math.random() * 10000) } };
  },

  // Book a restaurant
  bookRestaurant: async (tourId, restaurantId, details) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Restaurant booked:', { tourId, restaurantId, details });
    return { 
      success: true, 
      booking: { 
        tourId, 
        restaurantId, 
        bookingId: Math.floor(Math.random() * 10000),
        ...details
      }
    };
  },

  // Create a booking
  create: async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Booking created:', data);
    return { success: true, bookingId: Math.floor(Math.random() * 1000) };
  }
};

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Mock user profile data
const mockUserProfile = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 123-456-7890',
  address: '123 Main St, New York, NY',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  preferences: {
    travelInterests: ['Adventure', 'Cultural', 'Beach'],
    dietaryRestrictions: ['Vegetarian'],
    preferredCurrency: 'USD'
  },
  favoriteDestinations: ['Paris', 'Bali', 'Tokyo']
};

export const userAPI = {
  getProfile: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockUserProfile;
  },
  
  updateProfile: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profile updated:', userData);
    return { ...mockUserProfile, ...userData };
  },
  
  uploadProfileImage: async (imageData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Profile image uploaded');
    return { success: true, imageUrl: imageData };
  },
  
  removeProfileImage: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Profile image removed');
    return { success: true };
  },
  
  changePassword: (passwordData) => api.put('/users/password', passwordData),
};

export default api; 
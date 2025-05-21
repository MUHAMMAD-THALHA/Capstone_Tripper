import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';

// Sample tour data (This would typically come from a database)
const tours = [
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

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/tours', (req, res) => {
  res.json(tours);
});

app.get('/api/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }
  res.json(tour);
});

// User authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // This is a simple mock implementation
  // In a real app, you would check against a database and use proper authentication
  if (email === 'user@example.com' && password === 'password') {
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'Test User',
        email: 'user@example.com'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // In a real app, you would validate input, check if user exists, hash password, etc.
  res.json({
    success: true,
    user: {
      id: Date.now(),
      name,
      email
    },
    token: 'mock-jwt-token'
  });
});

// Bookings routes
app.get('/api/bookings', (req, res) => {
  // This would normally fetch from a database based on user ID
  res.json([
    {
      id: 101,
      tourId: 1,
      userId: 1,
      startDate: '2023-08-10',
      endDate: '2023-08-17',
      numberOfPeople: 2,
      totalPrice: 2598,
      status: 'confirmed'
    }
  ]);
});

app.post('/api/bookings', (req, res) => {
  // This would normally save to a database
  const booking = {
    id: Date.now(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(booking);
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Serving React app from ${path.join(__dirname, 'dist')}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
}); 
# Tripy Plan - Travel Planning Application

Tripy Plan is a full-stack travel planning application built with React and Express. It allows users to browse and book tours, manage their bookings, and customize their travel experience.

## Features

- User authentication with multiple login methods (email, Google, mobile OTP, facial recognition)
- Browse available tours and packages
- Book tours with customization options
- View and manage bookings
- User profile management
- Interactive maps for tour locations
- Restaurant bookings and transportation options

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd tripy-plan
```

2. Install dependencies:
```
npm install
```

3. Build the React app:
```
npm run build
```

4. Start the server:
```
npm run server
```

## Development

To run the application in development mode:

1. Start the React development server:
```
npm run dev
```

2. In a separate terminal, start the backend server in development mode:
```
npm run server:dev
```

The React app will be available at `http://localhost:5173` and will proxy API requests to the server running at `http://localhost:3000`.

## Usage

### Default Test User

You can use the following credentials to test the application:
- Email: user@example.com
- Password: password

### Available Scripts

- `npm run dev`: Start the React development server
- `npm run server`: Start the Express server
- `npm run server:dev`: Start the Express server with hot reloading
- `npm run build`: Build the React app for production
- `npm start`: Build the React app and start the server
- `npm run lint`: Run linting checks
- `npm test`: Run tests

## API Documentation

The backend API includes the following endpoints:

### Authentication

- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/register`: Register a new user

### Tours

- `GET /api/tours`: Get all tours
- `GET /api/tours/:id`: Get a specific tour by ID
- `GET /api/tours?q=search`: Search tours

### Bookings

- `GET /api/bookings`: Get all bookings for the authenticated user
- `POST /api/bookings`: Create a new booking
- `PUT /api/bookings/:id/cancel`: Cancel a booking

## Technologies Used

- Frontend:
  - React
  - React Router
  - Axios
  - React Query
  - Framer Motion
  - Tailwind CSS
  - React Icons

- Backend:
  - Express
  - Node.js
  - Cors
  - Morgan

## License

[MIT](LICENSE) 
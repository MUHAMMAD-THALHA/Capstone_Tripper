# Tripy Plan

A modern travel planning application built with React, Express, and Clerk for authentication.

## Features

- User authentication with Clerk
- Tour browsing and booking
- User profile management
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tripy-plan.git
   cd tripy-plan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Clerk publishable key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

### Running the Application

#### Development Mode

To run the application in development mode, use one of the following commands:

- **Linux/Mac:**
  ```bash
  ./start-dev.sh
  ```

- **Windows:**
  ```bash
  start-dev.bat
  ```

#### Production Mode

To run the application in production mode, use one of the following commands:

- **Linux/Mac:**
  ```bash
  ./start-server.sh
  ```

- **Windows:**
  ```bash
  start-server.bat
  ```

### Building the Application

To build the application for production, run:

```bash
npm run build
```

## Project Structure

- `src/` - Frontend React code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `services/` - API services
  - `utils/` - Utility functions
- `server.js` - Backend Express server
- `public/` - Static assets

## Technologies Used

- **Frontend:**
  - React
  - Vite
  - Tailwind CSS
  - Clerk for authentication

- **Backend:**
  - Express
  - Node.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
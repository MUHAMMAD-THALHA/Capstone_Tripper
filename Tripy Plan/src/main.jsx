// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { Toaster } from 'react-hot-toast';
// import App from './App';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <HelmetProvider>
//       <BrowserRouter>
//         <App />
//         <Toaster position="top-center" />
//       </BrowserRouter>
//     </HelmetProvider>
//   </React.StrictMode>
// ); 

// -----------------//
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// Create a client
const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <HelmetProvider>
          <BrowserRouter future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

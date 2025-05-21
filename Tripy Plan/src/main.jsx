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
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Create a client
const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-pink hover:bg-darkpink text-white',
          footerActionLink: 'text-pink hover:text-darkpink',
          card: 'bg-white shadow-lg rounded-lg',
          headerTitle: 'text-darkpink',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
          formFieldInput: 'border-gray-300 focus:border-pink focus:ring-pink',
          formFieldLabel: 'text-gray-700',
          formFieldAction: 'text-pink hover:text-darkpink',
          footerAction: 'text-gray-600',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);

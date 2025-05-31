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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-center" />
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);

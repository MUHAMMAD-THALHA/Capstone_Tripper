import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>,
)


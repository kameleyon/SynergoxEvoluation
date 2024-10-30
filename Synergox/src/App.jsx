import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import "./global.css";
import Dashboard from './components/dashboard';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Dashboard />
    </ClerkProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ClerkProvider } from '@clerk/clerk-react';
import Dashboard from './components/Dashboard/Dashboard';
import './global.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#389d51',
    },
    background: {
      default: '#0A0F16',
      paper: '#151e29',
    },
    text: {
      primary: '#bfd6c6',
      secondary: '#bfd6c6',
    },
  },
});

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!clerkPubKey) {
    throw new Error('Missing Publishable Key');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
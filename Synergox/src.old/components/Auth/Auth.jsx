import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box } from '@mui/material';

const Auth = () => {
  return (
    <Box 
      className="flex-center" 
      sx={{ 
        minHeight: '100vh',
        background: theme => theme.palette.mode === 'dark' ? 'var(--bg-dark-primary)' : 'var(--bg-light-primary)',
        color: theme => theme.palette.mode === 'dark' ? 'var(--text-dark)' : 'var(--text-light)',
      }}
    >
      <SignIn 
        appearance={{
          elements: {
            rootBox: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(122, 181, 92, 0.1)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
            },
            card: {
              backgroundColor: 'transparent',
              border: 'none',
            },
            headerTitle: {
              color: 'inherit',
            },
            headerSubtitle: {
              color: 'inherit',
            },
            formButtonPrimary: {
              backgroundColor: 'var(--synergox-green)',
              '&:hover': {
                backgroundColor: 'var(--neon-green)',
              },
            },
            formFieldInput: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(122, 181, 92, 0.2)',
              color: 'inherit',
            },
            formFieldLabel: {
              color: 'inherit',
            },
          },
        }}
      />
    </Box>
  );
};

export default Auth;
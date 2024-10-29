import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box } from '@mui/material';

const ClerkAuth = () => {
  return (
    <Box 
      className="main-panel"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '2rem',
        marginTop: '-10vh'
      }}
    >
      <SignIn 
        appearance={{
          baseTheme: 'dark',
          variables: {
            colorPrimary: '#389d51',
            colorBackground: '#0A0F16',
            colorText: '#bfd6c6',
            colorTextSecondary: '#bfd6c6',
            colorAlphaShade: 'rgba(122, 181, 92, 0.1)',
            colorInputBackground: '#151e29',
            colorInputText: '#bfd6c6',
            colorSuccess: '#4caf50',
            colorDanger: '#ff6b6b',
          },
          elements: {
            formButtonPrimary: {
              backgroundColor: '#389d51',
              '&:hover': {
                backgroundColor: '#88ab75'
              },
              fontSize: '1rem',
              fontWeight: '400'
            },
            card: {
              backgroundColor: '#151e29',
              border: '1px solid rgba(122, 181, 92, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            headerTitle: {
              color: '#bfd6c6',
              fontSize: '1.5rem',
              fontWeight: '300'
            },
            headerSubtitle: {
              color: '#bfd6c6',
              opacity: 0.8
            },
            formFieldLabel: {
              color: '#bfd6c6'
            },
            formFieldInput: {
              backgroundColor: '#0A0F16',
              border: '1px solid rgba(122, 181, 92, 0.2)',
              color: '#bfd6c6',
              '&:focus': {
                border: '1px solid #389d51',
                outline: 'none'
              }
            },
            footerActionLink: {
              color: '#389d51',
              '&:hover': {
                color: '#88ab75'
              }
            },
            dividerLine: {
              backgroundColor: 'rgba(122, 181, 92, 0.2)'
            },
            dividerText: {
              color: '#bfd6c6'
            },
            socialButtonsBlockButton: {
              backgroundColor: '#0A0F16',
              border: '1px solid rgba(122, 181, 92, 0.2)',
              color: '#bfd6c6',
              '&:hover': {
                backgroundColor: 'rgba(122, 181, 92, 0.1)'
              }
            },
            socialButtonsProviderIcon: {
              filter: 'brightness(0.8) contrast(1.2)'
            },
            alert: {
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              color: '#ff6b6b'
            }
          }
        }}
      />
    </Box>
  );
};

export default ClerkAuth;
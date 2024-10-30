import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <AppBar position="static">
        
      </AppBar>
      <Container>
        <Box py={4}>
          {children}
        </Box>
      </Container>
    </div>
  );
};

export default Layout;
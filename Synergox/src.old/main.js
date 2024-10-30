import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'; // Ensure this is pointing to App.jsx

console.log("Frontend API Key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom'; // Import from 'react-dom' directly
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';
import './styles/main.css';

// Use the older ReactDOM.render API
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
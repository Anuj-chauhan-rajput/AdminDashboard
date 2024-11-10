import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import the BrowserRouter
import App from './App';  // Import your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>  {/* Wrap your app with BrowserRouter */}
        <App />
    </BrowserRouter>
);

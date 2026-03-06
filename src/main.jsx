import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './providers/theme-providers';


const basename = (import.meta.env.BASE_URL && import.meta.env.BASE_URL.replace(/\/$/, '')) || '/';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
], { basename });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

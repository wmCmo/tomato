import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.jsx';
import ClockPage from './pages/ClockPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import './index.css';
import { ThemeProvider } from './providers/theme-providers.jsx';
import SigninPage from './pages/SigninPage.jsx';

const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
const devDetectedBase = import.meta.env.DEV && window.location.pathname.startsWith('/tomato')
  ? '/tomato'
  : null;
const basename = devDetectedBase ?? configuredBase;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ClockPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'signin', element: <SigninPage /> }
    ],
  },
], { basename });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

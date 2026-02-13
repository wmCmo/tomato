import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.jsx';
import ClockPage from './pages/ClockPage.jsx';
import './index.css';
import { ThemeProvider } from './providers/theme-providers.jsx';
import { registerSW } from 'virtual:pwa-register';
import QueryProvider from './providers/query-provider.jsx';
import AuthProvider from './providers/auth-provider.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import RecordPage from './pages/RecordPage.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import PolicyPage from './pages/PolicyPage.jsx';

registerSW({
  immediate: true
});

// const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
// const devDetectedBase = import.meta.env.DEV && window.location.pathname.startsWith('/tomato')
//   ? '/tomato'
//   : null;
const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ClockPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'profile/:userId', element: <ProfilePage /> },
      { path: 'setting', element: <SettingPage /> },
      { path: 'record', element: <RecordPage /> },
      { path: 'terms', element: <TermsOfUse /> },
      { path: 'policy', element: <PolicyPage /> },
      { path: "*", element: <NotFoundPage /> }
    ],
  },
], { basename });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

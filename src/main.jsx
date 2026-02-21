import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './index.css';
import AppProviders from './providers/app-providers.jsx';

const ClockPage = lazy(() => import('./pages/ClockPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const SettingPage = lazy(() => import('./pages/SettingPage.jsx'));
const RecordPage = lazy(() => import('./pages/RecordPage.jsx'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

registerSW({
  immediate: true
});

const basename = (import.meta.env.BASE_URL && import.meta.env.BASE_URL.replace(/\/$/, '')) || '/';

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
      { path: "*", element: <NotFoundPage /> }
    ],
  },
], { basename });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  </React.StrictMode>,
);

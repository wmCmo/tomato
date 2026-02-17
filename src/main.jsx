import React, { Suspense, lazy } from 'react';
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

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const SettingPage = lazy(() => import('./pages/SettingPage.jsx'));
const RecordPage = lazy(() => import('./pages/RecordPage.jsx'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse.jsx'));
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

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
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

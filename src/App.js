import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// DASHBOARDS / PAGES YOU ALREADY HAVE
import PlatformDashboard from './pages/platformAdmin/Dashboard';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Optional: send logged-in users to their last base; otherwise to sign-in
  const raw = localStorage.getItem('syntra_user');
  const user = raw ? JSON.parse(raw) : null;
  const defaultHome = user ? `${user.base || '/platform-admin'}/dashboard` : '/auth/sign-in';

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          {/* Public auth pages */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* Protected sections (token-only check inside ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            {/* Your existing Horizon admin area stays as-is */}
            <Route
              path="admin/*"
              element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />

            {/* PROTOTYPE ROLE: URL prefix drives the “role”.
               Remove the roles prop to avoid /auth/forbidden on platform-admin. */}
            <Route path="platform-admin/dashboard" element={<PlatformDashboard />} />
            <Route path="platform-admin" element={<Navigate to="/platform-admin/dashboard" replace />} />

            {/*
              When you add other profiles, register their dashboards similarly:
              <Route path="network-admin/dashboard" element={<NetworkDashboard />} />
              <Route path="network-admin" element={<Navigate to="/network-admin/dashboard" replace />} />
              <Route path="security-analyst/dashboard" element={<SecurityAnalystDashboard />} />
              <Route path="security-analyst" element={<Navigate to="/security-analyst/dashboard" replace />} />
            */}
          </Route>

          {/* Redirect helpers */}
          <Route path="login" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="/" element={<Navigate to={defaultHome} replace />} />
          <Route path="*" element={<Navigate to={defaultHome} replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

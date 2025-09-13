import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Platform Admin layout + pages
import PlatformAdminLayout from './pages/platformAdmin/Dashboard';
import DashboardHome from './pages/platformAdmin/DashboardHome';
import UserAccounts from './pages/platformAdmin/UserAccounts';
import ProfileTypes from './pages/platformAdmin/ProfileTypes';
import Alerts from './pages/platformAdmin/Alerts';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const raw = localStorage.getItem('syntra_user');
  const user = raw ? JSON.parse(raw) : null;
  const defaultHome = user ? `${user.base || '/platform-admin'}/dashboard` : '/auth/sign-in';

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          {/* Public auth pages */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* Protected sections */}
          <Route element={<ProtectedRoute />}>
            {/* Horizon original admin area */}
            <Route
              path="admin/*"
              element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />

            {/* Platform Admin layout with nested pages */}
            <Route path="platform-admin" element={<PlatformAdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="users" element={<UserAccounts />} />
              <Route path="profile-types" element={<ProfileTypes />} />
              <Route path="alerts" element={<Alerts />} />
            </Route>

            {/*
              After adding other profiles, register their dashboards similarly:
              <Route path="network-admin/dashboard" element={<NetworkDashboard />} />
              <Route path="network-admin" element={<Navigate to="/network-admin/dashboard" replace />} />
              <Route path="security-analyst/dashboard" element={<SecurityAnalystDashboard />} />
              <Route path="security-analyst" element={<Navigate to="/security-analyst/dashboard" replace />} />
            */}
          </Route>

          {/* Redirect helpers */}
          <Route path="/" element={<Navigate to={defaultHome} replace />} />
          <Route path="*" element={<Navigate to={defaultHome} replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import PlatformDashboard from './pages/platformAdmin/Dashboard';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          {/* Public auth pages */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* Protected sections */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="admin/*"
              element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />
            <Route element={<ProtectedRoute roles={['platform_admin']} />}>
              <Route path="platform-admin/*" element={<PlatformDashboard />} />
            </Route>

          </Route>

          {/* Redirect helpers */}
          <Route path="login" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

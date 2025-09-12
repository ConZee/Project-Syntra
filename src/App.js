import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';

// ✅ new imports
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      {/* ✅ Auth state provider */}
      <AuthProvider>
        <Routes>
          {/* Public auth pages (login, register, etc.) */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* ✅ Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="admin/*"
              element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />
            <Route
              path="rtl/*"
              element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />
          </Route>

          {/* Default redirect – still points to /admin, which is now protected */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

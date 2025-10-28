import "./assets/css/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useState } from "react";

import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Platform Admin layout + pages
import PlatformAdminLayout from "./pages/platformAdmin/Dashboard";
import DashboardHome from "./pages/platformAdmin/DashboardHome";
import UserAccounts from "./pages/platformAdmin/UserAccounts";
import ProfileTypes from "./pages/platformAdmin/ProfileTypes";
import Alerts from "./pages/platformAdmin/Alerts";

// ---------- Small helper: compute home based on logged-in user ----------
function DefaultRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;

  // pick a base dashboard by role (extend as you add roles)
  const role = user?.role;
  if (role === "Platform Administrator") return <Navigate to="/platform-admin/dashboard" replace />;
  if (role === "Security Analyst")       return <Navigate to="/platform-admin/alerts" replace />;
  // fall back to the generic admin area
  return <Navigate to="/admin/default" replace />;
}

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          {/* ---------- Public auth pages ---------- */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* ---------- Protected sections (any logged-in user) ---------- */}
          <Route element={<ProtectedRoute />}>
            {/* Horizon original admin area (no role restriction) */}
            <Route
              path="admin/*"
              element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
            />
          </Route>

          {/* ---------- Platform Admin area (role-gated) ---------- */}
          {/* Entire layout requires Platform Administrator */}
          <Route element={<ProtectedRoute roles={["Platform Administrator"]} />}>
            <Route path="platform-admin" element={<PlatformAdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="users" element={<UserAccounts />} />
              <Route path="profile-types" element={<ProfileTypes />} />
            </Route>
          </Route>

          {/* Alerts shared by Platform Admin + Security Analyst */}
          <Route element={<ProtectedRoute roles={["Platform Administrator","Security Analyst"]} />}>
            <Route path="platform-admin/alerts" element={<Alerts />} />
          </Route>

          {/* ---------- Redirect helpers ---------- */}
          <Route path="/" element={<DefaultRedirect />} />
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

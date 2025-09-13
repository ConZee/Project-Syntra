import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute(/* { roles } */) {
  const { isAuthenticated } = useAuth();        // ✅ hook at top level
  const loc = useLocation();

  const token = localStorage.getItem("token");  // fallback on refresh
  const authed = Boolean(isAuthenticated || token);

  if (!authed) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc }} />;
  }

  // Roles check intentionally disabled for prototype.
  return <Outlet />;
}

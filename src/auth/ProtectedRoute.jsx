import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();
  const loc = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc }} />;
  }

  if (roles && user && !roles.includes(user.role ?? "")) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  return <Outlet />;
}

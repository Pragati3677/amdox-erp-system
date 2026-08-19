import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Wrap any route that requires login. Pass `roles` to also restrict by role,
// mirroring the backend's authorize("Admin", "HR") middleware.
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
  const { employee, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="p-8">Loading...</p>;
  if (!employee) return <Navigate to="/login" replace />;

  if (employee.mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  if (roles && !roles.includes(employee.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

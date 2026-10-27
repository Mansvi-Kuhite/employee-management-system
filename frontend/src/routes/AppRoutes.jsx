import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import ChangePasswordPage from "../features/auth/ChangePasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import ChangePasswordPage from "../features/auth/ChangePasswordPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
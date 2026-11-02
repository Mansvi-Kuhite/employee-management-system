
import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import DepartmentsPage from "../features/organization/DepartmentsPage";

import ProtectedRoute from "./ProtectedRoute";

import ChangePasswordPage from "../features/auth/ChangePasswordPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";

import AppLayout from "../common/layout/AppLayout";
import ComingSoonPage from "../common/ComingSoonPage";

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-slate-500">
        {title} is coming soon.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/organization/departments" element={<DepartmentsPage />} />
        </Route>

        {/* Application Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

         

          <Route
            path="/organization/designations"
            element={<PlaceholderPage title="Designations" />}
          />

          <Route
            path="/organization/locations"
            element={<PlaceholderPage title="Locations" />}
          />

          <Route
            path="/organization/shifts"
            element={<PlaceholderPage title="Work Shifts" />}
          />

          {/* Other Admin Pages */}
          <Route path="/employees" element={<PlaceholderPage title="Employees" />} />
          <Route path="/attendance" element={<PlaceholderPage title="Attendance" />} />
          <Route path="/leave" element={<PlaceholderPage title="Leave" />} />
          <Route path="/payroll" element={<PlaceholderPage title="Payroll" />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
          <Route path="/announcements" element={<PlaceholderPage title="Announcements" />} />
          <Route path="/holidays" element={<PlaceholderPage title="Holidays" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>

      <Route path="/404" element={<ComingSoonPage />} />

      <Route
        path="*"
        element={<ComingSoonPage />}
      />
    </Routes>
  );
}

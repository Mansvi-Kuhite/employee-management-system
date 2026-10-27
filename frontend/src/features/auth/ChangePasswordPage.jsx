import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import PasswordField from "../../common/PasswordField";
import PasswordStrength from "../../common/PasswordStrength";
import { changePasswordSchema } from "./schemas";
import { changePasswordRequest } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { toFieldErrors } from "../../utils/zodErrors";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { employee, updateEmployee, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const forced = Boolean(employee.mustChangePassword);
  const passwordsMatch =
    form.confirmPassword !== "" && form.newPassword === form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = changePasswordSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const { currentPassword, newPassword } = result.data;
      await changePasswordRequest({ currentPassword, newPassword });
      updateEmployee({ mustChangePassword: false });
      showToast("Password changed successfully");
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setServerError(
        data?.errors?.[0]?.message || data?.message || "Could not reach the server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold">Change Password</h1>

        {forced && (
          <Alert severity="warning">
            For your security, please set a new password before continuing.
          </Alert>
        )}
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <PasswordField
          fullWidth
          label="Current password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          error={Boolean(errors.currentPassword)}
          helperText={errors.currentPassword}
        />

        <PasswordField
          fullWidth
          label="New password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          error={Boolean(errors.newPassword)}
          helperText={errors.newPassword}
        />
        <PasswordStrength password={form.newPassword} />

        <PasswordField
          fullWidth
          label="Confirm new password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          color={passwordsMatch ? "success" : "primary"}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword || (passwordsMatch ? "Passwords match" : "")}
        />

        <Button type="submit" variant="contained" fullWidth disabled={submitting}>
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Update password"}
        </Button>

        {forced ? (
          <Button fullWidth onClick={handleLogout}>
            Log out instead
          </Button>
        ) : (
          <Button fullWidth onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        )}
      </form>
    </div>
  );
}
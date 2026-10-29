import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LinkOff from "@mui/icons-material/LinkOff";
import AuthLayout from "./AuthLayout";
import PasswordField from "../../common/PasswordField";
import PasswordStrength from "../../common/PasswordStrength";
import { resetPasswordSchema } from "./schemas";
import { resetPasswordRequest, verifyResetTokenRequest } from "../../api/authApi";
import { useToast } from "../../hooks/useToast";
import { toFieldErrors } from "../../utils/zodErrors";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState(token ? "checking" : "invalid");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    verifyResetTokenRequest(token)
      .then(() => setStatus("valid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const passwordsMatch =
    form.confirmPassword !== "" && form.newPassword === form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = resetPasswordSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      await resetPasswordRequest({ token, newPassword: result.data.newPassword });
      showToast("Password reset. You can log in now.");
      navigate("/login", { state: { passwordReset: true } });
    } catch (err) {
      const data = err.response?.data;
      setServerError(
        data?.errors?.[0]?.message || data?.message || "Could not reach the server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "checking") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
          <CircularProgress />
          <p className="text-sm">Checking your link...</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "invalid") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <LinkOff fontSize="large" />
          </div>
          <h1 className="text-xl font-bold text-ink">Link expired or invalid</h1>
          <p className="text-sm text-slate-500">
            Reset links work once and expire after 15 minutes.
          </p>
          <Button component={Link} to="/forgot-password" variant="contained" fullWidth>
            Request a new link
          </Button>
          <Link to="/login" className="text-sm font-semibold text-link">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="mb-1 text-center">
          <h1 className="text-xl font-bold text-ink">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose something you haven't used before.</p>
        </div>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <PasswordField
          fullWidth
          size="small"
          placeholder="New password"
          name="newPassword"
          autoComplete="new-password"
          icon={<LockOutlined />}
          value={form.newPassword}
          onChange={handleChange}
          error={Boolean(errors.newPassword)}
          helperText={errors.newPassword}
        />
        <PasswordStrength password={form.newPassword} />

        <PasswordField
          fullWidth
          size="small"
          placeholder="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          icon={<LockOutlined />}
          value={form.confirmPassword}
          onChange={handleChange}
          color={passwordsMatch ? "success" : "primary"}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword || (passwordsMatch ? "Passwords match" : "")}
        />

        <Button type="submit" variant="contained" fullWidth disabled={submitting}>
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
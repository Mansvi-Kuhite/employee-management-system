
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Google from "@mui/icons-material/Google";

import AuthLayout from "./AuthLayout";
import PasswordField from "../../common/PasswordField";
import { loginSchema } from "./schemas";
import { loginRequest } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { toFieldErrors } from "../../utils/zodErrors";
import { APP_NAME } from "../../lib/constants";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await loginRequest(result.data);

      login(res.data.token, res.data.employee, remember);

      showToast(`Welcome back, ${res.data.employee.name}`);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Could not reach the server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="mb-1 text-center">
          <h1 className="text-xl font-bold text-ink">Welcome to your workspace</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your team</p>
        </div>


        {location.state?.registered && (
          <Alert severity="success">
            Account created. Please log in.
          </Alert>
        )}

        {location.state?.passwordReset && (
          <Alert severity="success">
            Password reset. Please log in.
          </Alert>
        )}



        <TextField
          fullWidth
          size="small"
          placeholder="Work email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          slotProps={{
            htmlInput: { "aria-label": "Work email" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            },
          }}
        />

        <PasswordField
          fullWidth
          size="small"
          placeholder="Password"
          name="password"
          autoComplete="current-password"
          icon={<LockOutlined />}
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />

        <div className="flex items-center justify-between">
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                size="small"
              />
            }
            label="Remember me"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
          />
          <Link to="/forgot-password" className="text-sm font-semibold text-link">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={submitting}
          endIcon={submitting ? null : <ArrowForward />}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-gray-200" />
          or continue with
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          startIcon={<Google />}
          onClick={() => showToast("Google sign-in isn't set up yet", "info")}
          sx={{ borderColor: "#cfe2f5" }}
        >
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-slate-600">
          New to {APP_NAME}?{" "}
          <Link to="/signup" className="font-semibold text-link">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

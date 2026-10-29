
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import Person from "@mui/icons-material/Person";
import Email from "@mui/icons-material/Email";
import LockOutlined from "@mui/icons-material/LockOutlined";

import AuthLayout from "../auth/AuthLayout";
import { signupSchema } from "./schemas";
import { signupRequest } from "../../api/authApi";
import { toFieldErrors } from "../../utils/zodErrors";
import PasswordStrength from "../../common/PasswordStrength";
import PasswordField from "../../common/PasswordField";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      setErrors(toFieldErrors(result.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const { name, email, password } = result.data;
      await signupRequest({ name, email, password });
      navigate("/login", { state: { registered: true } });
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
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Join your team’s workspace
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-3"
        >
          {serverError && (
            <Alert severity="error">{serverError}</Alert>
          )}

          <TextField
            fullWidth
            size="small"
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            slotProps={{
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
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            startAdornment={<LockOutlined />}
          />

          <PasswordStrength password={form.password} />

          <PasswordField
            fullWidth
            size="small"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            startAdornment={<LockOutlined />}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span className="ml-2">Creating account...</span>
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-link hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

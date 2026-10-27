import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, TextField } from "@mui/material";
import { loginSchema } from "./schemas";
import { loginRequest } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import { toFieldErrors } from "../../utils/zodErrors";
import { useToast } from "../../hooks/useToast";
import  PasswordField from "../../common/PasswordField";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
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
     login(res.data.token, res.data.employee);
     showToast(`Welcome back, ${res.data.employee.name}`);
     navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {location.state?.registered && (
          <Alert severity="success">Account created. Please log in.</Alert>
        )}
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <PasswordField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />

        <Button type="submit" variant="contained" fullWidth disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-pink-600">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
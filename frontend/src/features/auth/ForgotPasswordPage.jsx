import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import MarkEmailRead from "@mui/icons-material/MarkEmailRead";
import ArrowBack from "@mui/icons-material/ArrowBack";
import AuthLayout from "./AuthLayout";
import { forgotPasswordSchema } from "./schemas";
import { forgotPasswordRequest } from "../../api/authApi";
import { useToast } from "../../hooks/useToast";
import { toFieldErrors } from "../../utils/zodErrors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendLink = async (address) => {
    setServerError("");
    setSubmitting(true);
    try {
      await forgotPasswordRequest({ email: address });
      setSentTo(address);
      setCooldown(30);
      return true;
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not reach the server");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(toFieldErrors(result.error).email);
      return;
    }
    setError("");
    sendLink(result.data.email);
  };

  const handleResend = async () => {
    if (await sendLink(sentTo)) showToast("Reset link sent again");
  };

  if (sentTo) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-ink">
            <MarkEmailRead fontSize="large" />
          </div>
          <h1 className="text-xl font-bold text-ink">Check your email</h1>
          <p className="text-sm text-slate-500">
            If <span className="font-semibold text-ink">{sentTo}</span> is registered,
            we've sent a reset link. It expires in 15 minutes.
          </p>

          {import.meta.env.DEV && (
            <Alert severity="info" className="w-full text-left">
              Dev mode: the link is printed in the backend terminal.
            </Alert>
          )}
          {serverError && <Alert severity="error">{serverError}</Alert>}

          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            disabled={cooldown > 0 || submitting}
            onClick={handleResend}
            sx={{ borderColor: "#cfe2f5" }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
          </Button>

          <Link to="/login" className="flex items-center gap-1 text-sm font-semibold text-link">
            <ArrowBack fontSize="small" /> Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="mb-1 text-center">
          <h1 className="text-xl font-bold text-ink">Forgot your password?</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your work email and we'll send you a reset link.
          </p>
        </div>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          fullWidth
          size="small"
          placeholder="Work email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(error)}
          helperText={error}
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

        <Button type="submit" variant="contained" fullWidth disabled={submitting}>
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Send reset link"}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-link"
        >
          <ArrowBack fontSize="small" /> Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { IDLE_TIMEOUT_MS, WARNING_MS } from "../lib/constants";
import { setFlash } from "../utils/flashMessage";

const ACTIVITY_KEY = "ems_last_activity";
const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

const markActive = () => localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
const getLastActive = () => Number(localStorage.getItem(ACTIVITY_KEY)) || Date.now();

export default function IdleLogout() {
  const { employee, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(null);
  const warningRef = useRef(false);
  const loggedIn = Boolean(employee);

  useEffect(() => {
    if (!loggedIn) return;

    markActive();
    let lastWrite = Date.now();

    const onActivity = () => {
      if (warningRef.current) return;
      const now = Date.now();
      if (now - lastWrite > 1000) {
        lastWrite = now;
        markActive();
      }
    };

    EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));

    const timer = setInterval(() => {
      const remaining = IDLE_TIMEOUT_MS - (Date.now() - getLastActive());

      if (remaining <= 0) {
        warningRef.current = false;
        setSecondsLeft(null);
         setFlash("idle");
        logout();
        navigate("/login", { state: { idleLogout: true } });
      } else if (remaining <= WARNING_MS) {
        warningRef.current = true;
        setSecondsLeft(Math.ceil(remaining / 1000));
      } else if (warningRef.current) {
        warningRef.current = false;
        setSecondsLeft(null);
      }
    }, 1000);

    return () => {
      EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
      clearInterval(timer);
    };
  }, [loggedIn, logout, navigate]);

  const handleStay = () => {
    markActive();
    warningRef.current = false;
    setSecondsLeft(null);
    showToast("Session extended");
  };

  const handleLogoutNow = () => {
    warningRef.current = false;
    setSecondsLeft(null);
    logout();
    navigate("/login");
  };

  if (!loggedIn) return null;

  const warningSeconds = WARNING_MS / 1000;
  const progress = ((secondsLeft ?? 0) / warningSeconds) * 100;

  return (
    <Dialog open={secondsLeft !== null} disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle>Still there?</DialogTitle>
      <DialogContent>
        <DialogContentText className="!mb-4">
          You've been inactive for a while. For your security you'll be logged out in{" "}
          <strong>{secondsLeft}</strong> seconds.
        </DialogContentText>
        <LinearProgress variant="determinate" value={progress} color="primary" />
      </DialogContent>
      <DialogActions className="!px-6 !pb-4">
        <Button color="inherit" onClick={handleLogoutNow}>
          Log out now
        </Button>
        <Button variant="contained" onClick={handleStay} autoFocus>
          Stay logged in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
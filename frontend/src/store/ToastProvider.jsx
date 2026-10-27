import { useCallback, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ToastContext } from "./toastContext";

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((current) => ({ ...current, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={handleClose}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
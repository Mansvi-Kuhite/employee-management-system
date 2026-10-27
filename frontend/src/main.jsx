import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./store/AuthProvider.jsx";
import theme from "./theme/theme.js";
import ToastProvider from "./store/ToastProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
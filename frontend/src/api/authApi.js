import api from "../lib/axios";

export const signupRequest = (data) => api.post("/auth/signup", data);
export const loginRequest = (data) => api.post("/auth/login", data);
export const changePasswordRequest = (data) => api.put("/auth/change-password", data);
export const forgotPasswordRequest = (data) => api.post("/auth/forgot-password", data);
export const verifyResetTokenRequest = (token) =>
  api.get("/auth/reset-password/verify", { params: { token } });
export const resetPasswordRequest = (data) => api.post("/auth/reset-password", data);
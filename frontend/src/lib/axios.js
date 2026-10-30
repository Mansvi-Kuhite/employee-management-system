
import axios from "axios";
import { clearToken, getToken } from "../utils/tokenStorage";
import { setFlash } from "../utils/flashMessage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginCall && getToken()) {
      setFlash("expired");
      clearToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

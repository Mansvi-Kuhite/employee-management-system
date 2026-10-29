
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { AuthContext } from "./authContext";
import { clearToken, getToken, saveToken } from "../utils/tokenStorage";

export default function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setEmployee(res.data.employee))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = (token, employeeData, remember = false) => {
    saveToken(token, remember);
    setEmployee(employeeData);
  };

  const logout = () => {
    clearToken();
    setEmployee(null);
  };

  const updateEmployee = (changes) => {
    setEmployee((current) => ({ ...current, ...changes }));
  };

  return (
    <AuthContext.Provider
      value={{ employee, loading, login, logout, updateEmployee }}
    >
      {children}
    </AuthContext.Provider>
  );
}

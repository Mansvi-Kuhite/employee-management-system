
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { AuthContext } from "./authContext";
import { clearToken, getToken, saveToken } from "../utils/tokenStorage";

export default function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    const token = getToken();

    if (!token) return;

    api
      .get("/auth/me")
      .then((res) => {
        setEmployee(res.data.employee);
      })
      .catch(() => {
        clearToken();
        setEmployee(null);
      })
      .finally(() => {
        setLoading(false);
      });
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
    setEmployee((current) =>
      current ? { ...current, ...changes } : current
    );
  };

  return (
    <AuthContext.Provider
      value={{ employee, loading, login, logout, updateEmployee }}
    >
      {children}
    </AuthContext.Provider>
  );
}


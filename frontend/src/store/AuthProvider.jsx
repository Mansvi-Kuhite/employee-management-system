import { useEffect, useState } from "react";
import api from "../lib/axios";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setEmployee(res.data.employee))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, employeeData) => {
    localStorage.setItem("token", token);
    setEmployee(employeeData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setEmployee(null);
  };
  

  const updateEmployee = (changes) => {
  setEmployee((current) => ({ ...current, ...changes }));
  };

  return (
    <AuthContext.Provider value={{ employee, loading, login, logout, updateEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}
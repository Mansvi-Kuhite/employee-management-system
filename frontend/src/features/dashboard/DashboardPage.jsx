import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { employee, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-2 p-8">
      <h1 className="text-2xl font-bold">Welcome, {employee.name}</h1>
      <p>Role: {employee.role}</p>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
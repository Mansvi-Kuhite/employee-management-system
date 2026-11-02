import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";
import { useAuth } from "../hooks/useAuth";
import { findMenuLabel, getMenu } from "../lib/menuConfig";

export default function ComingSoonPage() {
  const { employee } = useAuth();
  const { pathname } = useLocation();
  const label = findMenuLabel(getMenu(employee.role), pathname);

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-ink">
        <ConstructionOutlined fontSize="large" />
      </div>
      <h2 className="text-xl font-bold text-ink">
        {label ? `${label} is coming soon` : "Page not found"}
      </h2>
      <p className="text-sm text-slate-500">
        {label
          ? "This screen will be built in an upcoming module."
          : "The page you're looking for doesn't exist or you don't have access to it."}
      </p>
      <Button component={Link} to="/dashboard" variant="contained">
        Back to dashboard
      </Button>
    </div>
  );
}
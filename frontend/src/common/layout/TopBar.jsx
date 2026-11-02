import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LockResetOutlined from "@mui/icons-material/LockResetOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "../../hooks/useAuth";
import { findMenuLabel, getMenu } from "../../lib/menuConfig";

export default function TopBar({ showMenuButton, onMenuClick }) {
  const { employee, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const title = findMenuLabel(getMenu(employee.role), pathname) || "";
  const initial = employee.name?.charAt(0).toUpperCase();

  const closeMenu = () => setAnchor(null);

  const handleChangePassword = () => {
    closeMenu();
    navigate("/change-password");
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-2">
        {showMenuButton && (
          <IconButton onClick={onMenuClick} aria-label="Open menu" edge="start">
            <MenuIcon />
          </IconButton>
        )}
        <h1 className="text-lg font-bold text-ink">{title}</h1>
      </div>

      <button
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100"
      >
        <Avatar sx={{ bgcolor: "primary.light", color: "text.primary", fontWeight: 700 }}>
          {initial}
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-ink">{employee.name}</p>
          <p className="text-xs capitalize text-slate-500">{employee.role}</p>
        </div>
      </button>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <LockResetOutlined fontSize="small" />
          </ListItemIcon>
          Change password
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </header>
  );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Groups from "@mui/icons-material/Groups";
import { useAuth } from "../../hooks/useAuth";
import { getMenu } from "../../lib/menuConfig";
import { APP_NAME } from "../../lib/constants";

const isActive = (pathname, path) => pathname === path || pathname.startsWith(`${path}/`);

function NavItem({ item, pathname, onNavigate }) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children);
  const childActive = hasChildren && item.children.some((c) => isActive(pathname, c.path));
  const [open, setOpen] = useState(childActive);

  if (!hasChildren) {
    return (
      <ListItemButton
        component={Link}
        to={item.path}
        selected={isActive(pathname, item.path)}
        onClick={onNavigate}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    );
  }

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)} selected={childActive && !open}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {item.children.map((child) => (
            <ListItemButton
              key={child.path}
              component={Link}
              to={child.path}
              selected={isActive(pathname, child.path)}
              onClick={onNavigate}
            >
              <ListItemText primary={child.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default function Sidebar({ onNavigate }) {
  const { employee } = useAuth();
  const { pathname } = useLocation();
  const sections = getMenu(employee.role);

  return (
    <div className="flex h-full w-64 flex-col">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-300 to-sky-300 text-ink">
          <Groups />
        </div>
        <span className="text-lg font-bold text-ink">{APP_NAME}</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section, index) => (
          <div key={section.title || index}>
            {section.title && (
              <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {section.title}
              </p>
            )}
            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {section.items.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </List>
          </div>
        ))}
      </nav>
    </div>
  );
}
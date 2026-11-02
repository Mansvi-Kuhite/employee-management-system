
import SpaceDashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import BeachAccessOutlined from "@mui/icons-material/BeachAccessOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import FolderOutlined from "@mui/icons-material/FolderOutlined";

// Common dashboard menu
const dashboard = {
  label: "Dashboard",
  path: "/dashboard",
  icon: SpaceDashboardOutlined,
};

// Employee menu items
const employeeItems = [
  {
    label: "My Profile",
    path: "/my-profile",
    icon: AccountCircleOutlined,
  },
  {
    label: "My Attendance",
    path: "/my-attendance",
    icon: EventAvailableOutlined,
  },
  {
    label: "My Leave",
    path: "/my-leave",
    icon: BeachAccessOutlined,
  },
  {
    label: "My Payslips",
    path: "/my-payslips",
    icon: ReceiptLongOutlined,
  },
  {
    label: "My Documents",
    path: "/my-documents",
    icon: FolderOutlined,
  },
  {
    label: "Holidays",
    path: "/holidays",
    icon: EventOutlined,
  },
  {
    label: "Announcements",
    path: "/announcements",
    icon: CampaignOutlined,
  },
];

// Role-based menus
export const menus = {
  admin: [
    {
      items: [
        dashboard,
        {
          label: "Employees",
          path: "/employees",
          icon: PeopleAltOutlined,
        },
        {
          label: "Organization",
          icon: BusinessOutlined,
          children: [
            { label: "Departments", path: "/organization/departments" },
            { label: "Designations", path: "/organization/designations" },
            { label: "Locations", path: "/organization/locations" },
            { label: "Work Shifts", path: "/organization/shifts" },
          ],
        },
        {
          label: "Attendance",
          path: "/attendance",
          icon: EventAvailableOutlined,
        },
        {
          label: "Leave",
          path: "/leave",
          icon: BeachAccessOutlined,
        },
        {
          label: "Payroll",
          path: "/payroll",
          icon: PaymentsOutlined,
        },
        {
          label: "Documents",
          path: "/documents",
          icon: DescriptionOutlined,
        },
        {
          label: "Announcements",
          path: "/announcements",
          icon: CampaignOutlined,
        },
        {
          label: "Holidays",
          path: "/holidays",
          icon: EventOutlined,
        },
        {
          label: "Reports",
          path: "/reports",
          icon: BarChartOutlined,
        },
        {
          label: "Settings",
          path: "/settings",
          icon: SettingsOutlined,
        },
      ],
    },
  ],

  manager: [
    {
      items: [
        dashboard,
        {
          label: "My Team",
          path: "/my-team",
          icon: GroupsOutlined,
        },
        {
          label: "Team Attendance",
          path: "/team-attendance",
          icon: EventAvailableOutlined,
        },
        {
          label: "Approvals",
          path: "/approvals",
          icon: FactCheckOutlined,
        },
        {
          label: "Reports",
          path: "/reports",
          icon: BarChartOutlined,
        },
      ],
    },
    {
      title: "My work",
      items: employeeItems,
    },
  ],

  employee: [
    {
      items: [dashboard, ...employeeItems],
    },
  ],
};

// Get menu based on employee role
export const getMenu = (role) => menus[role] || menus.employee;

// Find selected menu label for TopBar
export const findMenuLabel = (sections, pathname) => {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.path === pathname) {
        return item.label;
      }

      for (const child of item.children || []) {
        if (child.path === pathname) {
          return child.label;
        }
      }
    }
  }

  return null;
};

// src/routes.jsx
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";

// Dashboard project pages
import Tools from "./pages/Tools";
import Reports from "./pages/Reports";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

import AdminHome from '@/pages/dashboard/AdminHome';
import AdminApprovals from '@/pages/dashboard/AdminApprovals';
import AdminFaculty from '@/pages/dashboard/AdminFaculty';
import AdminAnalytics from '@/pages/dashboard/AdminAnalytics';
const adminRoutes = [
  { path: '/admin', element: <AdminHome /> },
  { path: '/admin/approvals', element: <AdminApprovals /> },
  { path: '/admin/faculty', element: <AdminFaculty /> },
  { path: '/admin/analytics', element: <AdminAnalytics /> },
  // Add other admin routes as needed
];
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      // Dashboard project routes
      {
        name: "tools",
        path: "/tools/*",
        element: <Tools />,
      },
      {
        name: "reports",
        path: "/reports",
        element: <Reports />,
      },
      {
        name: "billing",
        path: "/billing",
        element: <Billing />,
      },
      {
        name: "settings",
        path: "/settings",
        element: <Settings />,
      },
      {
        name: "support",
        path: "/support",
        element: <Support />,
      },
    ],
  },
];


export default routes;
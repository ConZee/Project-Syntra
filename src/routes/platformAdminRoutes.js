import React from "react";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

import Dashboard from "pages/platformAdmin/Dashboard";
import UserAccounts from "pages/platformAdmin/UserAccounts";
import ProfileType from "pages/platformAdmin/ProfileType";
import Alerts from "pages/platformAdmin/Alerts";

const platformAdminRoutes = [
  {
    name: "Overview",
    layout: "/platform-admin",
    path: "/dashboard",                 // full URL => /platform-admin/dashboard
    icon: <FiHome />,
    element: <Dashboard />,
  },
  {
    name: "User Account Management",
    layout: "/platform-admin",
    path: "/users",                     // /platform-admin/users
    icon: <FiUsers />,
    element: <UserAccounts />,
  },
  {
    name: "Profile Types",
    layout: "/platform-admin",
    path: "/profiles",                  // /platform-admin/profiles
    icon: <FiSettings />,
    element: <ProfileType />,
  },
  {
    name: "Alerts & Notifications",
    layout: "/platform-admin",
    path: "/alerts",                  // /platform-admin/alerts
    icon: <FiSettings />,
    element: <Alerts />,
  },
];

export default platformAdminRoutes;

import React from "react";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

const platformAdminRoutes = [
  {
    name: "Overview",
    layout: "/platform-admin",
    path: "/dashboard",
    icon: <FiHome />,
  },
  {
    name: "User Account Management",
    layout: "/platform-admin",
    path: "/users",
    icon: <FiUsers />,
  },
  {
    name: "Profile Types",
    layout: "/platform-admin",
    path: "/profiles",  
    icon: <FiSettings />,
  },
  {
    name: "Alerts & Notifications",
    layout: "/platform-admin",
    path: "/alerts",
    icon: <FiSettings />,
  },
];

export default platformAdminRoutes;

// routes/platformAdminRoutes.js
import React from "react";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

const platformAdminRoutes = [
  {
    name: "Overview",
    layout: "/platform-admin",
    path: "/dashboard",
    icon: <FiHome />,
    roles: ["Platform Administrator"],                 // ← RBAC
  },
  {
    name: "User Account Management",
    layout: "/platform-admin",
    path: "/users",
    icon: <FiUsers />,
    roles: ["Platform Administrator"],                 // ← RBAC
  },
  {
    name: "Profile Types",
    layout: "/platform-admin",
    path: "/profile-types",
    icon: <FiSettings />,
    roles: ["Platform Administrator"],                 // ← RBAC
  },
  {
    name: "Alerts & Notifications",
    layout: "/platform-admin",
    path: "/alerts",
    icon: <FiSettings />,
    roles: ["Platform Administrator", "Security Analyst"], // ← shared page
  },
];

export default platformAdminRoutes;

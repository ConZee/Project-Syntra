import React from "react";
import { Icon } from "@chakra-ui/react";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

import Dashboard from "pages/platformAdmin/Dashboard";
import Users from "pages/platformAdmin/Users";
import Settings from "pages/platformAdmin/Settings";

const platformAdminRoutes = [
  {
    name: "Overview",
    layout: "/platform-admin",
    path: "/dashboard",                 // full URL => /platform-admin/dashboard
    icon: <Icon as={FiHome} />,
    element: <Dashboard />,
  },
  {
    name: "Users",
    layout: "/platform-admin",
    path: "/users",                     // /platform-admin/users
    icon: <Icon as={FiUsers} />,
    element: <Users />,
  },
  {
    name: "Settings",
    layout: "/platform-admin",
    path: "/settings",                  // /platform-admin/settings
    icon: <Icon as={FiSettings} />,
    element: <Settings />,
  },
];

export default platformAdminRoutes;

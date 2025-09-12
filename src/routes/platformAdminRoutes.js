import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdHome } from "react-icons/md";

import PlatformDashboard from "pages/platformAdmin/Dashboard";

const platformAdminRoutes = [
  {
    name: "Dashboard",
    layout: "/platform-admin",
    path: "/",
    icon: <Icon as={MdHome} w="20px" h="20px" color="inherit" />,
    component: <PlatformDashboard />,
  },
];

export default platformAdminRoutes;

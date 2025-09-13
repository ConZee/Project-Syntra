import React from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Navbar from "../../components/navbar/NavbarAdmin";
import Sidebar from "../../components/sidebar/Sidebar";
import platformAdminRoutes from "../../routes/platformAdminRoutes";

export default function PlatformDashboard() {
  const bgColor = useColorModeValue("gray.50", "navy.900");

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Sidebar */}
      <Sidebar routes={platformAdminRoutes} />

      {/* Main content area */}
      <Flex direction="column" flex="1" 
            ms={{ base: 0, xl: "300px" }}   // reserve space for the fixed sidebar 
            pt={{ base: "80px", xl: "88px" }} // push below the top bar/navbar
            px={{ base: 4, md: 6 }}          // side padding for breathing room
            as="main" position="relative">

        {/* Top bar */}
        <Navbar brandText="Platform Admin" secondary={false} onOpen={() => {}} />

        {/* Page body */}
        <Box p={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Platform Admin Dashboard
          </Text>
          <Text color="gray.500">
            Components and widgets for Platform Admin will go here.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

import React from "react";
import { Text } from "@chakra-ui/react";

export default function DashboardHome() {
  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Platform Admin Dashboard
      </Text>
      <Text color="gray.500">
        Components and widgets for Platform Admin will go here.
      </Text>
    </>
  );
}
// chakra imports
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
// custom components
import Profile from "components/sidebar/components/Profile";
import Links from "components/sidebar/components/Links";
import React from "react";
// ⭐ add: auth hook
import { useAuth } from "auth/AuthContext";

function SidebarContent(props) {
  const { routes } = props;

  // ⭐ add: get user + role checker from context
  const { user, hasRole } = useAuth();

  // ⭐ add: filter routes by RBAC
  const visibleRoutes = (routes || []).filter((r) => hasRole(r?.roles || []));

  // Sidebar header (optional show real user data)
  const userName = user?.name || "User";
  const avatarUrl = ""; // plug in later if you store avatars

  return (
    <Flex direction="column" height="100%" pt="25px" px="16px" borderRadius="30px">
      <Profile name={userName} avatarUrl={avatarUrl} />

      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          {/* ⭐ pass filtered routes to Links */}
          {visibleRoutes.length > 0 ? (
            <Links routes={visibleRoutes} />
          ) : (
            <Text color="gray.500" fontSize="sm" px="2">
              No accessible sections.
            </Text>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;

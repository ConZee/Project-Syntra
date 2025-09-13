// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Profile from "components/sidebar/components/Profile";
import Links from "components/sidebar/components/Links";
import React from "react";

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;
  // SIDEBAR
  const userName = "User";      // later: from auth/db
  const avatarUrl = "";
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <Profile name={userName} avatarUrl={avatarUrl} />
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          <Box color="gray.400" fontSize="xs">routes: {Array.isArray(routes) ? routes.length : 'none'}</Box>
          <Links routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;

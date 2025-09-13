import React from "react";
import { Flex, Box, Text, Avatar, useColorModeValue } from "@chakra-ui/react";

export default function SidebarProfile({
  name = "User",
  avatarUrl = "",
}) {
  const bg = useColorModeValue("gray.50", "whiteAlpha.50");
  const border = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtitleColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100%"    // Take full box width for centering
      px="20px"
      py="14px"
      borderRadius="14px"
      bg={bg}
      borderWidth="1px"
      borderColor={border}
    >
      {/* If avatarUrl is empty, Avatar shows initials from `name` */}
      <Avatar name={name} src={avatarUrl} size="lg" mb="10px" />

      {/* Two centered lines: Welcome + Name */}
       <Text textAlign="center" whiteSpace="pre-line">{`Welcome\n${name}`}</Text>
    </Flex>
  );
}
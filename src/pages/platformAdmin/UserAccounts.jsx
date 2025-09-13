import React from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const rows = [
  {
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    status: 'Active',
    role: 'Platform Admin',
    joined: 'Mar 12, 2025',
    lastActive: '1 minute ago',
  },
  {
    name: 'Olivia Bennett',
    email: 'ollyben@gmail.com',
    status: 'Inactive',
    role: 'Security Analyst',
    joined: 'Jun 27, 2024',
    lastActive: '1 month ago',
  },
  {
    name: 'Daniel Warren',
    email: 'dwarren3@gmail.com',
    status: 'Deleted',
    role: 'Platform Admin',
    joined: 'Jan 8, 2025',
    lastActive: '4 days ago',
  },
  {
    name: 'Chloe Hayes',
    email: 'chloehye@gmail.com',
    status: 'Pending',
    role: 'Network Admin',
    joined: 'Oct 5, 2023',
    lastActive: '10 days ago',
  },
  {
    name: 'Marcus Reed',
    email: 'reeds777@gmail.com',
    status: 'Suspended',
    role: 'Security Analyst',
    joined: 'Feb 19, 2023',
    lastActive: '3 months ago',
  },
];

const statusColor = (s) =>
  ({
    Active: 'green',
    Inactive: 'gray',
    Pending: 'blue',
    Deleted: 'red',
    Suspended: 'orange',
  }[s] || 'gray');

export default function UserAccounts() {
  const textColor = useColorModeValue('navy.700', 'white');

  return (
    <Box>
      {/* Toolbar */}
      <Flex gap={3} wrap="wrap" mb={4} align="center">
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input placeholder="Search users..." />
        </InputGroup>
        <Select
          maxW="200px"
          placeholder="Role"
          color={textColor}
          sx={{ option: { color: textColor } }}
        >
          <option>Platform Admin</option>
          <option>Network Admin</option>
          <option>Security Analyst</option>
        </Select>
        <Select
          maxW="200px"
          placeholder="Status"
          color={textColor}
          sx={{ option: { color: textColor } }}
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
          <option>Suspended</option>
          <option>Deleted</option>
        </Select>
        <Button ms="auto" variant="brand">
          + Add User
        </Button>
      </Flex>

      {/* Table */}
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Full Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Role</Th>
            <Th>Joined Date</Th>
            <Th>Last Active</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((r) => (
            <Tr key={r.email}>
              <Td>
                <Text fontWeight="semibold">{r.name}</Text>
              </Td>
              <Td>{r.email}</Td>
              <Td>
                <Badge colorScheme={statusColor(r.status)}>{r.status}</Badge>
              </Td>
              <Td>{r.role}</Td>
              <Td>{r.joined}</Td>
              <Td>{r.lastActive}</Td>
              <Td isNumeric>
                <IconButton
                  aria-label="View"
                  icon={<FiEye />}
                  variant="ghost"
                  size="sm"
                  mr={1}
                />
                <IconButton
                  aria-label="Edit"
                  icon={<FiEdit2 />}
                  variant="ghost"
                  size="sm"
                  mr={1}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FiTrash2 />}
                  variant="ghost"
                  size="sm"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

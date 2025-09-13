import React, { useMemo, useState } from 'react';
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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

// Demo data — swap with API later
const INITIAL = [
  { id: 'pt-plat-admin', name: 'Platform Administrator', status: 'Active' },
  { id: 'pt-net-admin', name: 'Network Administrator', status: 'Active' },
  { id: 'pt-sec-analyst', name: 'Security Analyst', status: 'Active' },
];

const statusColor = (s) => ({ Active: 'green', Inactive: 'gray' }[s] || 'gray');

export default function ProfileTypes() {
  const [rows, setRows] = useState(INITIAL);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(''); // "", "Active", "Inactive"
  const toast = useToast();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ = term ? r.name.toLowerCase().includes(term) : true;
      const matchesStatus = status ? r.status === status : true;
      return matchesQ && matchesStatus;
    });
  }, [rows, q, status]);

  const onAdd = () => {
    // lightweight stub; replace with modal later
    const next = {
      id: `pt-${Date.now()}`,
      name: `New Profile ${rows.length + 1}`,
      status: 'Active',
    };
    setRows((prev) => [next, ...prev]);
    toast({ title: 'Profile added', status: 'success', duration: 1500 });
  };

  const onView = (r) =>
    toast({ title: `Viewing "${r.name}"`, status: 'info', duration: 1200 });

  const onEdit = (r) =>
    toast({ title: `Editing "${r.name}"`, status: 'info', duration: 1200 });

  const onDelete = (r) => {
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    toast({ title: `Deleted "${r.name}"`, status: 'success', duration: 1500 });
  };
  const textColor = useColorModeValue('navy.700', 'white');
  return (
    <Box>
      {/* Title row (optional—Navbar already shows section name) */}
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Profile Type
      </Text>

      {/* Toolbar */}
      <Flex gap={3} wrap="wrap" align="center" mb={4}>
        <InputGroup maxW="340px">
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
          />
        </InputGroup>
        <Select
          maxW="220px"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Profile Status"
          color={textColor}
          sx={{ option: { color: textColor } }}
        >
          <option>Active</option>
          <option>Inactive</option>
        </Select>
        <Button ms="auto" leftIcon={<FiPlus />} variant="brand" onClick={onAdd}>
          Add Profile
        </Button>
      </Flex>

      {/* Table */}
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Profile Name</Th>
            <Th>Status</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((r) => (
            <Tr key={r.id}>
              <Td>{r.name}</Td>
              <Td>
                <Badge colorScheme={statusColor(r.status)}>{r.status}</Badge>
              </Td>
              <Td isNumeric>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiEye />}
                  mr={1}
                  onClick={() => onView(r)}
                >
                  View
                </Button>
                <IconButton
                  aria-label="Edit"
                  icon={<FiEdit2 />}
                  variant="ghost"
                  size="sm"
                  mr={1}
                  onClick={() => onEdit(r)}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FiTrash2 />}
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(r)}
                />
              </Td>
            </Tr>
          ))}
          {filtered.length === 0 && (
            <Tr>
              <Td colSpan={3}>
                <Text color="gray.500">No profiles match your filters.</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Footer hint (stub for pagination, if you add it later) */}
      <Flex mt={3} justify="space-between" color="gray.500" fontSize="sm">
        <Text>
          Rows: {filtered.length} / {rows.length}
        </Text>
        <Text>Pagination coming soon</Text>
      </Flex>
    </Box>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
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
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const statusColor = (s) =>
  ({
    Active: 'green',
    Inactive: 'gray',
    Pending: 'blue',
    Deleted: 'red',
    Suspended: 'orange',
  }[s] || 'gray');

export default function UserAccounts() {
  // ===== Color tokens aligned to SignIn page =====
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.300');
  const textColorBrand = useColorModeValue('brand.500', 'brand.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ===== Table state =====
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // ===== Form state =====
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: '',
  });
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  // ===== Validation =====
  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8)
      e.password = 'Use at least 8 characters.';
    if (!form.confirm) e.confirm = 'Please confirm the password.';
    else if (form.confirm !== form.password)
      e.confirm = 'Passwords do not match.';
    if (!form.role) e.role = 'Select a role.';
    return e;
  }, [form]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirm: '', role: '' });
    setTouched({});
  };

  // ===== Load users from backend on mount =====
  const loadUsers = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await fetch('/api/users'); // CRA dev proxy -> http://localhost:3001
      if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
      const data = await res.json();
      const mapped = data.map((u) => ({
        name: u.name,
        email: u.email,
        status: u.status || 'Active',
        role: u.role,
        joined: u.joined_at
          ? new Date(u.joined_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—',
        lastActive: u.last_active ? 'recently' : '—',
      }));
      setRows(mapped);
    } catch (err) {
      setLoadError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ===== Create user (Save Info) =====
  const handleSave = async () => {
    if (Object.keys(errors).length) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirm: true,
        role: true,
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create user');
      }

      const created = await res.json();

      // Optimistic update (or call await loadUsers(); for strict sync with DB)
      setRows((r) => [
        {
          name: created.name,
          email: created.email,
          status: 'Active',
          role: created.role,
          joined: created.joined_at
            ? new Date(created.joined_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : new Date().toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
          lastActive: 'just now',
        },
        ...r,
      ]);

      toast({
        title: 'Successfully created user account',
        status: 'success',
        isClosable: true,
      });
      onClose();
      resetForm();
    } catch (err) {
      toast({
        title: 'Could not create user',
        description: err.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box color={textColor}>
      {/* Toolbar */}
      <Flex gap={3} wrap="wrap" mb={4} align="center">
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            color={textColor}
            _placeholder={{ color: textColorSecondary }}
            borderColor={borderColor}
            _hover={{ borderColor }}
            _focus={{ borderColor }}
            bg={useColorModeValue('white', 'transparent')}
          />
        </InputGroup>

        <Select
          maxW="200px"
          placeholder="Role"
          color={textColor}
          borderColor={borderColor}
          _hover={{ borderColor }}
          _focus={{ borderColor }}
          sx={{ option: { color: textColor } }}
          bg={useColorModeValue('white', 'transparent')}
        >
          <option>Platform Admin</option>
          <option>Network Admin</option>
          <option>Security Analyst</option>
        </Select>

        <Select
          maxW="200px"
          placeholder="Status"
          color={textColor}
          borderColor={borderColor}
          _hover={{ borderColor }}
          _focus={{ borderColor }}
          sx={{ option: { color: textColor } }}
          bg={useColorModeValue('white', 'transparent')}
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
          <option>Suspended</option>
          <option>Deleted</option>
        </Select>

        <Button ms="auto" variant="brand" onClick={onOpen}>
          + Add User
        </Button>
      </Flex>

      {/* Loading / Error / Table */}
      {loading ? (
        <Flex align="center" gap={3}>
          <Spinner /> <Text color={textColorSecondary}>Loading users…</Text>
        </Flex>
      ) : loadError ? (
        <Text color="red.400">Failed to load users: {loadError}</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {[
                'Full Name',
                'Email',
                'Status',
                'Role',
                'Joined Date',
                'Last Active',
                'Actions',
              ].map((h) => (
                <Th key={h} color={textColorSecondary}>
                  {h}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r) => (
              <Tr key={r.email}>
                <Td>
                  <Text fontWeight="semibold" color={textColor}>
                    {r.name}
                  </Text>
                </Td>
                <Td>
                  <Text color={textColorSecondary}>{r.email}</Text>
                </Td>
                <Td>
                  <Badge colorScheme={statusColor(r.status)}>{r.status}</Badge>
                </Td>
                <Td>
                  <Text color={textColor}>{r.role}</Text>
                </Td>
                <Td>
                  <Text color={textColorSecondary}>{r.joined}</Text>
                </Td>
                <Td>
                  <Text color={textColorSecondary}>{r.lastActive}</Text>
                </Td>
                <Td isNumeric>
                  <IconButton
                    aria-label="View"
                    icon={<FiEye />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                    mr={1}
                  />
                  <IconButton
                    aria-label="Edit"
                    icon={<FiEdit2 />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                    mr={1}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<FiTrash2 />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Add User</ModalHeader>
          <ModalCloseButton color={textColorSecondary} />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isInvalid={touched.name && !!errors.name}>
                <FormLabel color={textColor}>Full Name</FormLabel>
                <Input
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={() => handleBlur('name')}
                  placeholder="Jane Doe"
                  color={textColor}
                  _placeholder={{ color: textColorSecondary }}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  bg={useColorModeValue('white', 'transparent')}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={touched.email && !!errors.email}>
                <FormLabel color={textColor}>Email address</FormLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  onBlur={() => handleBlur('email')}
                  placeholder="jane.doe@company.com"
                  color={textColor}
                  _placeholder={{ color: textColorSecondary }}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  bg={useColorModeValue('white', 'transparent')}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={touched.password && !!errors.password}>
                <FormLabel color={textColor}>Password</FormLabel>
                <Input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="Minimum 8 characters"
                  color={textColor}
                  _placeholder={{ color: textColorSecondary }}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  bg={useColorModeValue('white', 'transparent')}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={touched.confirm && !!errors.confirm}>
                <FormLabel color={textColor}>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  onBlur={() => handleBlur('confirm')}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  bg={useColorModeValue('white', 'transparent')}
                />
                <FormErrorMessage>{errors.confirm}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={touched.role && !!errors.role}>
                <FormLabel color={textColor}>Role</FormLabel>
                <Select
                  placeholder="Select role"
                  value={form.role}
                  onChange={handleChange('role')}
                  onBlur={() => handleBlur('role')}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  sx={{ option: { color: textColor } }}
                  bg={useColorModeValue('white', 'transparent')}
                >
                  <option value="Platform Admin">Platform Admin</option>
                  <option value="Network Admin">Network Admin</option>
                  <option value="Security Analyst">Security Analyst</option>
                </Select>
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                onClose();
                resetForm();
              }}
              variant="ghost"
              color={textColor}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Info
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

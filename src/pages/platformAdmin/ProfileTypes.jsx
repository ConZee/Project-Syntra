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
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

// Status badge color helper (same convention as Users page)
const statusColor = (s) => ({ Active: 'green', Inactive: 'gray' }[s] || 'gray');

export default function ProfileTypes() {
  // ===== Colors (aligned with Users page) =====
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');

  const toast = useToast();
  const addDisclosure = useDisclosure();

  // ===== Table/data state =====
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // ===== Toolbar filters & search =====
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // '', 'Active', 'Inactive'

  // ===== Add Profile form =====
  const [form, setForm] = useState({
    name: '', // 'Platform Admin' | 'Network Admin' | 'Security Analyst'
    status: 'Active',
  });
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  const ERRORS = useMemo(() => {
    const e = {};
    if (!form.name) e.name = 'Select a profile type.';
    if (!form.status) e.status = 'Select a status.';
    // prevent duplicates (case-insensitive)
    const exists = rows.some(
      (r) => r.name.toLowerCase() === String(form.name).toLowerCase(),
    );
    if (!e.name && exists) e.name = 'This profile type already exists.';
    return e;
  }, [form, rows]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const resetForm = () => {
    setForm({ name: '', status: 'Active' });
    setTouched({});
  };

  // ===== Load profile types from backend =====
  const loadProfiles = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await fetch('/api/profile-types'); // expects GET endpoint
      if (!res.ok) throw new Error(`Failed to load profiles (${res.status})`);
      const data = await res.json();
      // normalize to table rows
      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status || 'Active',
        created: p.created_at
          ? new Date(p.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—',
      }));
      setRows(mapped);
    } catch (err) {
      setLoadError(err.message || 'Error loading profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // ===== Create profile type =====
  const handleSave = async () => {
    if (Object.keys(ERRORS).length) {
      setTouched({ name: true, status: true });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/profile-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          status: form.status,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create profile type');
      }
      const created = await res.json();
      setRows((prev) => [
        {
          id: created.id,
          name: created.name,
          status: created.status || 'Active',
          created: created.created_at
            ? new Date(created.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : new Date().toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
        },
        ...prev,
      ]);
      toast({ title: 'Successfully created profile type', status: 'success' });
      addDisclosure.onClose();
      resetForm();
    } catch (err) {
      toast({
        title: 'Could not create profile type',
        description: err.message,
        status: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // ===== Filtered rows =====
  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const qOk = term ? r.name.toLowerCase().includes(term) : true;
      const statusOk = filterStatus ? r.status === filterStatus : true;
      return qOk && statusOk;
    });
  }, [rows, q, filterStatus]);

  // (Optional) placeholder handlers for view/edit/delete
  const onView = (r) =>
    toast({ title: `Viewing "${r.name}"`, status: 'info', duration: 1200 });
  const onEdit = (r) =>
    toast({ title: `Editing "${r.name}"`, status: 'info', duration: 1200 });
  const onDelete = (r) =>
    toast({
      title: `Delete not implemented`,
      description: `Would delete "${r.name}" here.`,
      status: 'warning',
    });

  return (
    <Box color={textColor}>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Profile Types
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
            placeholder="Search profiles…"
            color={textColor}
            _placeholder={{ color: textColorSecondary }}
            borderColor={borderColor}
            _hover={{ borderColor }}
            _focus={{ borderColor }}
            bg={useColorModeValue('white', 'transparent')}
          />
        </InputGroup>

        <Select
          maxW="220px"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          placeholder="Profile Status"
          color={textColor}
          borderColor={borderColor}
          _hover={{ borderColor }}
          _focus={{ borderColor }}
          sx={{ option: { color: textColor } }}
          bg={useColorModeValue('white', 'transparent')}
        >
          <option>Active</option>
          <option>Inactive</option>
        </Select>

        <Button
          ms="auto"
          leftIcon={<FiPlus />}
          variant="brand"
          onClick={addDisclosure.onOpen}
        >
          Add Profile
        </Button>
      </Flex>

      {/* Loading / Error / Table */}
      {loading ? (
        <Flex align="center" gap={3}>
          <Spinner /> <Text color={textColorSecondary}>Loading profiles…</Text>
        </Flex>
      ) : loadError ? (
        <Text color="red.400">Failed to load profiles: {loadError}</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {['Profile Name', 'Status', 'Created', 'Actions'].map((h) => (
                <Th key={h} color={textColorSecondary}>
                  {h}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredRows.map((r) => (
              <Tr key={r.id}>
                <Td>
                  <Text fontWeight="semibold" color={textColor}>
                    {r.name}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={statusColor(r.status)}>{r.status}</Badge>
                </Td>
                <Td>
                  <Text color={textColorSecondary}>{r.created}</Text>
                </Td>
                <Td isNumeric>
                  <IconButton
                    aria-label="View"
                    icon={<FiEye />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                    mr={1}
                    _hover={{ bg: hoverBg }}
                    onClick={() => onView(r)}
                  />
                  <IconButton
                    aria-label="Edit"
                    icon={<FiEdit2 />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                    mr={1}
                    _hover={{ bg: hoverBg }}
                    onClick={() => onEdit(r)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<FiTrash2 />}
                    variant="ghost"
                    size="sm"
                    colorScheme="red"
                    _hover={{ bg: hoverBg }}
                    onClick={() => onDelete(r)}
                  />
                </Td>
              </Tr>
            ))}
            {filteredRows.length === 0 && (
              <Tr>
                <Td colSpan={4}>
                  <Text color={textColorSecondary}>
                    No profiles match your filters.
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}

      {/* Add Profile Modal */}
      <Modal
        isOpen={addDisclosure.isOpen}
        onClose={() => {
          addDisclosure.onClose();
          resetForm();
        }}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Add Profile Type</ModalHeader>
          <ModalCloseButton color={textColorSecondary} />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isInvalid={touched.name && !!ERRORS.name}>
                <FormLabel color={textColor}>Profile Type</FormLabel>
                <Select
                  placeholder="Select profile type"
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={() => handleBlur('name')}
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
                <FormErrorMessage>{ERRORS.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={touched.status && !!ERRORS.status}>
                <FormLabel color={textColor}>Status</FormLabel>
                <Select
                  value={form.status}
                  onChange={handleChange('status')}
                  onBlur={() => handleBlur('status')}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor }}
                  _focus={{ borderColor }}
                  sx={{ option: { color: textColor } }}
                  bg={useColorModeValue('white', 'transparent')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <FormErrorMessage>{ERRORS.status}</FormErrorMessage>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                addDisclosure.onClose();
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
              Save Profile
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

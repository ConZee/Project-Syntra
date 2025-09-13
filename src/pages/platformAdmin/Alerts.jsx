import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
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
import {
  FiSearch,
  FiRefreshCw,
  FiSend,
  FiCheckCircle,
  FiX,
  FiTrash2,
} from 'react-icons/fi';

const STORAGE_KEY = 'syntra_reset_requests';
// minutes until a reset token expires (for demo)
const TOKEN_TTL_MIN = 15;

const statusColor = (s) =>
  ({
    Pending: 'orange',
    'Link Sent': 'blue',
    Completed: 'green',
    Denied: 'red',
  }[s] || 'gray');

// --- tiny storage helpers ---
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveToStorage = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

const formatDate = (ts) => (ts ? new Date(ts).toLocaleString() : '—');

const computeExpiry = (createdAt, ttlMin = TOKEN_TTL_MIN) => {
  if (!createdAt) return null;
  return createdAt + ttlMin * 60 * 1000;
};
const expiryLabel = (req) => {
  if (
    !req.createdAt ||
    (req.status !== 'Pending' && req.status !== 'Link Sent')
  )
    return '—';
  const exp = computeExpiry(req.createdAt);
  const ms = exp - Date.now();
  if (ms <= 0) return 'Expired';
  const min = Math.ceil(ms / 60000);
  return `in ${min} min`;
};

// Seed some demo rows if empty (dev-only)
const seedIfEmpty = () => {
  const now = Date.now();
  const seeded = [
    {
      id: `${now - 10000}`,
      email: 'john.smith@gmail.com',
      method: 'email',
      createdAt: now - 5 * 60 * 1000, // 5 min ago
      status: 'Pending',
      ip: '203.0.113.10',
    },
    {
      id: `${now - 20000}`,
      email: 'ollyben@gmail.com',
      method: 'email',
      createdAt: now - 40 * 60 * 1000, // 40 min ago
      status: 'Link Sent',
      ip: '198.51.100.25',
    },
    {
      id: `${now - 30000}`,
      email: 'dwarren3@gmail.com',
      method: 'email',
      createdAt: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      status: 'Completed',
      ip: '192.0.2.44',
    },
  ];
  saveToStorage(seeded);
  return seeded;
};

export default function Alerts() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(''); // "", Pending, Link Sent, Completed, Denied
  const [selected, setSelected] = useState(new Set());

  const cardBg = useColorModeValue('white', 'navy.800');
  const border = useColorModeValue('gray.200', 'whiteAlpha.200');

  useEffect(() => {
    let list = loadFromStorage();
    if (!list.length) list = seedIfEmpty();
    setRows(list);
  }, []);

  const refresh = () => {
    setRows(loadFromStorage());
    setSelected(new Set());
    toast({ title: 'Refreshed', status: 'info', duration: 900 });
  };

  const persist = (next) => {
    setRows(next);
    saveToStorage(next);
  };

  const onRowToggle = (id) => {
    setSelected((prev) => {
      const c = new Set(prev);
      if (c.has(id)) c.delete(id);
      else c.add(id);
      return c;
    });
  };

  const allVisibleIds = useMemo(() => {
    return rows
      .filter((r) => {
        const termOk = q
          ? r.email.toLowerCase().includes(q.trim().toLowerCase())
          : true;
        const statusOk = status ? r.status === status : true;
        return termOk && statusOk;
      })
      .map((r) => r.id);
  }, [rows, q, status]);

  const toggleAllVisible = () => {
    const allSelected = allVisibleIds.every((id) => selected.has(id));
    if (allSelected) {
      // unselect all visible
      setSelected((prev) => {
        const c = new Set(prev);
        allVisibleIds.forEach((id) => c.delete(id));
        return c;
      });
    } else {
      // select all visible
      setSelected((prev) => {
        const c = new Set(prev);
        allVisibleIds.forEach((id) => c.add(id));
        return c;
      });
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const termOk = term ? r.email.toLowerCase().includes(term) : true;
      const statusOk = status ? r.status === status : true;
      return termOk && statusOk;
    });
  }, [rows, q, status]);

  // --- row actions ---
  const sendLink = (ids) => {
    if (!ids.length) return;
    const now = Date.now();
    const next = rows.map((r) =>
      ids.includes(r.id)
        ? {
            ...r,
            status: 'Link Sent',
            // keep createdAt as request time; expiry is derived
            lastActionAt: now,
          }
        : r,
    );
    persist(next);
    toast({
      title: `Sent ${ids.length} reset link(s)`,
      status: 'success',
      duration: 1200,
    });
    setSelected(new Set());
  };

  const markCompleted = (ids) => {
    if (!ids.length) return;
    const now = Date.now();
    const next = rows.map((r) =>
      ids.includes(r.id) ? { ...r, status: 'Completed', lastActionAt: now } : r,
    );
    persist(next);
    toast({
      title: `Marked ${ids.length} as completed`,
      status: 'success',
      duration: 1200,
    });
    setSelected(new Set());
  };

  const deny = (ids) => {
    if (!ids.length) return;
    const now = Date.now();
    const next = rows.map((r) =>
      ids.includes(r.id) ? { ...r, status: 'Denied', lastActionAt: now } : r,
    );
    persist(next);
    toast({
      title: `Denied ${ids.length} request(s)`,
      status: 'info',
      duration: 1200,
    });
    setSelected(new Set());
  };

  const remove = (ids) => {
    if (!ids.length) return;
    const next = rows.filter((r) => !ids.includes(r.id));
    persist(next);
    toast({
      title: `Removed ${ids.length} record(s)`,
      status: 'warning',
      duration: 1200,
    });
    setSelected(new Set());
  };

  // Bulk helpers
  const selectedIds = Array.from(selected).filter((id) =>
    allVisibleIds.includes(id),
  );
  const bulkDisabled = selectedIds.length === 0;

  const textColor = useColorModeValue('navy.700', 'white');

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="16px"
      p={4}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={1}>
        Password Reset Requests
      </Text>
      <Text color="gray.500" mb={4}>
        Requests submitted via the <em>Forgot password</em> flow.
      </Text>

      {/* Toolbar */}
      <Flex gap={3} wrap="wrap" align="center" mb={4}>
        <InputGroup maxW="360px">
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search by email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW="220px"
          placeholder="All statuses"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          color={textColor}
          sx={{ option: { color: textColor } }}
        >
          <option>Pending</option>
          <option>Link Sent</option>
          <option>Completed</option>
          <option>Denied</option>
        </Select>

        <HStack ms="auto" spacing={2}>
          <Button
            leftIcon={<FiSend />}
            variant="solid"
            size="sm"
            onClick={() => sendLink(selectedIds)}
            isDisabled={bulkDisabled}
          >
            Send Link
          </Button>
          <Button
            leftIcon={<FiCheckCircle />}
            variant="solid"
            size="sm"
            onClick={() => markCompleted(selectedIds)}
            isDisabled={bulkDisabled}
          >
            Mark Completed
          </Button>
          <Button
            leftIcon={<FiX />}
            variant="outline"
            size="sm"
            onClick={() => deny(selectedIds)}
            isDisabled={bulkDisabled}
          >
            Deny
          </Button>
          <IconButton
            aria-label="Refresh"
            title="Refresh"
            icon={<FiRefreshCw />}
            variant="ghost"
            onClick={refresh}
          />
        </HStack>
      </Flex>

      {/* Table */}
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th width="36px">
              <Checkbox
                isChecked={
                  allVisibleIds.length > 0 &&
                  allVisibleIds.every((id) => selected.has(id))
                }
                isIndeterminate={
                  selected.size > 0 &&
                  !allVisibleIds.every((id) => selected.has(id))
                }
                onChange={toggleAllVisible}
              />
            </Th>
            <Th>Email</Th>
            <Th>Requested</Th>
            <Th>Status</Th>
            <Th>Expiry</Th>
            <Th>IP</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((r) => (
            <Tr key={r.id}>
              <Td>
                <Checkbox
                  isChecked={selected.has(r.id)}
                  onChange={() => onRowToggle(r.id)}
                />
              </Td>
              <Td>
                <Text fontWeight="semibold">{r.email}</Text>
              </Td>
              <Td>{formatDate(r.createdAt)}</Td>
              <Td>
                <Badge colorScheme={statusColor(r.status)}>{r.status}</Badge>
              </Td>
              <Td>{expiryLabel(r)}</Td>
              <Td>{r.ip || '—'}</Td>
              <Td isNumeric>
                <HStack justify="flex-end" spacing={1}>
                  <IconButton
                    aria-label="Send link"
                    icon={<FiSend />}
                    size="sm"
                    variant="ghost"
                    onClick={() => sendLink([r.id])}
                  />
                  <IconButton
                    aria-label="Mark completed"
                    icon={<FiCheckCircle />}
                    size="sm"
                    variant="ghost"
                    onClick={() => markCompleted([r.id])}
                  />
                  <IconButton
                    aria-label="Deny"
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    onClick={() => deny([r.id])}
                  />
                  <IconButton
                    aria-label="Remove"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => remove([r.id])}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
          {filtered.length === 0 && (
            <Tr>
              <Td colSpan={7}>
                <Text color="gray.500">No requests match your filters.</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

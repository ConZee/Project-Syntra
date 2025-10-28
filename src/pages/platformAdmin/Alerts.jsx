// src/pages/platformAdmin/Alerts.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge, Box, Button, Flex, HStack, IconButton,
  Select, Table, Tbody, Td, Th, Thead, Tr, Text,
  useColorModeValue, useToast,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { getSuricataAlerts, getZeekLogs } from "../../backend_api";
import { useAuth } from "../../auth/AuthContext";

// map Suricata alert severity (1=High .. 3=Low; Elastic often 1..3)
const sevColor = (s) => {
  if (s === 1 || s === "1") return "red";
  if (s === 2 || s === "2") return "orange";
  if (s === 3 || s === "3") return "yellow";
  return "gray";
};

export default function Alerts() {
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]); // Suricata
  const [zeek, setZeek] = useState([]);     // Zeek

  const cardBg = useColorModeValue("white", "navy.800");
  const border = useColorModeValue("gray.200", "whiteAlpha.200");

  const fetchAll = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const [a, z] = await Promise.all([
        getSuricataAlerts(limit),
        getZeekLogs(limit),
      ]);
      setAlerts(a || []);
      setZeek(z || []);
    } catch (err) {
      console.error("IDS fetch error:", err);
      toast({ title: "Failed to load IDS data", status: "error", duration: 1400 });
    } finally {
      setLoading(false);
    }
  };

  // initial + polling every 5s
  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, isAuthenticated]);

  const suricataEmpty = useMemo(() => (alerts?.length ?? 0) === 0, [alerts]);
  const zeekEmpty = useMemo(() => (zeek?.length ?? 0) === 0, [zeek]);

  return (
    <Box bg={cardBg} borderWidth="1px" borderColor={border} borderRadius="16px" p={4}>
      {/* Toolbar */}
      <Flex gap={3} align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Alerts & Notifications</Text>
        <HStack ms="auto" spacing={2}>
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            size="sm"
            w="120px"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n} rows</option>
            ))}
          </Select>
          <IconButton
            aria-label="Refresh"
            icon={<FiRefreshCw />}
            size="sm"
            isLoading={loading}
            onClick={fetchAll}
          />
        </HStack>
      </Flex>

      {/* Suricata */}
      <Text fontSize="lg" fontWeight="semibold" mb={2}>Suricata Alerts</Text>
      <Table variant="simple" size="sm" mb={8}>
        <Thead>
          <Tr>
            <Th>Time (UTC)</Th>
            <Th>Signature</Th>
            <Th>Severity</Th>
            <Th>Src IP</Th>
            <Th>Dst IP</Th>
            <Th>Dst Port</Th>
            <Th>Proto</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!suricataEmpty ? (
            alerts.map((a) => (
              <Tr key={a.id}>
                <Td>{a.timestamp || "—"}</Td>
                <Td>{a.signature || "—"}</Td>
                <Td>
                  {a.severity ? (
                    <Badge colorScheme={sevColor(a.severity)}>{a.severity}</Badge>
                  ) : "—"}
                </Td>
                <Td>{a.src_ip || "—"}</Td>
                <Td>{a.dest_ip || "—"}</Td>
                <Td>{a.dest_port ?? "—"}</Td>
                <Td>{a.protocol || "—"}</Td>
              </Tr>
            ))
          ) : (
            <Tr><Td colSpan={7}><Text color="gray.500">No Suricata alerts.</Text></Td></Tr>
          )}
        </Tbody>
      </Table>

      {/* Zeek */}
      <Text fontSize="lg" fontWeight="semibold" mb={2}>Zeek Logs</Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Time (UTC)</Th>
            <Th>Event</Th>
            <Th>Service</Th>
            <Th>Src IP</Th>
            <Th>Dst IP</Th>
            <Th>Dst Port</Th>
            <Th>Proto</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!zeekEmpty ? (
            zeek.map((z) => (
              <Tr key={z.id}>
                <Td>{z.timestamp || "—"}</Td>
                <Td>{z.event_type || "—"}</Td>
                <Td>{z.service || "—"}</Td>
                <Td>{z.src_ip || "—"}</Td>
                <Td>{z.dest_ip || "—"}</Td>
                <Td>{z.dest_port ?? "—"}</Td>
                <Td>{z.proto || "—"}</Td>
              </Tr>
            ))
          ) : (
            <Tr><Td colSpan={7}><Text color="gray.500">No Zeek records.</Text></Td></Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

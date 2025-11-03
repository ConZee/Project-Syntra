// ============================================================================
// NEW FILE: src/pages/networkAdmin/Dashboard.jsx
// ============================================================================
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import IconBox from 'components/icons/IconBox';
import {
  MdAlarm,
  MdBarChart,
  MdCheck,
  MdDashboard,
  MdDeviceHub,
  MdOutlineDragIndicator,
  MdOutlineEdit,
  MdSecurity,
  MdTrendingUp,
  MdTimeline,
} from 'react-icons/md';

const STORAGE_KEY = 'networkAdmin-dashboard-layout';
const DATA_TRANSFER_TYPE = 'networkAdmin/module-id';

const MODULE_LIBRARY = {
  alerts: {
    id: 'alerts',
    title: 'Real-time Alerts',
    icon: MdAlarm,
    render: (colors) => (
      <Stack spacing={3}>
        {[
          {
            id: 'ALRT-9082',
            summary: 'High severity threat detected',
            detail: 'Exploit attempt blocked on DMZ web server',
            severity: 'High',
          },
          {
            id: 'ALRT-9079',
            summary: 'New lateral movement behavior',
            detail: 'Unusual SMB connections from HR subnet',
            severity: 'Medium',
          },
          {
            id: 'ALRT-9074',
            summary: 'Suspicious DNS tunneling activity',
            detail: 'Outbound queries to untrusted domain',
            severity: 'Medium',
          },
        ].map((alert) => (
          <Flex key={alert.id} justify="space-between" align="flex-start">
            <Box>
              <Text fontWeight="600" color={colors.textPrimary}>
                {alert.summary}
              </Text>
              <Text fontSize="sm" color={colors.textSecondary}>
                {alert.detail}
              </Text>
              <Text fontSize="xs" mt={1} color={colors.textTertiary}>
                Alert ID: {alert.id}
              </Text>
            </Box>
            <Badge
              colorScheme={
                alert.severity === 'High'
                  ? 'red'
                  : alert.severity === 'Medium'
                    ? 'orange'
                    : 'green'
              }
              variant="subtle"
            >
              {alert.severity}
            </Badge>
          </Flex>
        ))}
      </Stack>
    ),
  },
  traffic: {
    id: 'traffic',
    title: 'Network Traffic Overview',
    icon: MdTrendingUp,
    render: (colors) => (
      <Stack spacing={4}>
        <Flex justify="space-between">
          <Text fontWeight="600" color={colors.textPrimary}>
            Throughput
          </Text>
          <Text color={colors.textSecondary}>3.2 Gbps</Text>
        </Flex>
        <Box h="6px" borderRadius="8px" bg={colors.trackBg}>
          <Box h="100%" w="70%" borderRadius="inherit" bg="brand.500" />
        </Box>
        <Flex justify="space-between" fontSize="sm" color={colors.textSecondary}>
          <Box>
            <Text fontWeight="600">Northbound</Text>
            <Text>1.8 Gbps</Text>
          </Box>
          <Box>
            <Text fontWeight="600">Southbound</Text>
            <Text>1.4 Gbps</Text>
          </Box>
          <Box>
            <Text fontWeight="600">Packets/s</Text>
            <Text>86.4 k</Text>
          </Box>
        </Flex>
      </Stack>
    ),
  },
  threats: {
    id: 'threats',
    title: 'Top Threats',
    icon: MdSecurity,
    render: (colors) => (
      <Stack spacing={3}>
        {[
          {
            name: 'Ransomware: STOP.DJVU',
            count: 18,
            trend: '+12%',
            color: 'red',
          },
          { name: 'Botnet: MIRAI', count: 11, trend: '+4%', color: 'orange' },
          { name: 'Recon: Port Sweep', count: 9, trend: '-3%', color: 'yellow' },
        ].map((threat) => (
          <Flex
            key={threat.name}
            justify="space-between"
            align="center"
            borderRadius="12px"
            px={3}
            py={2}
            bg={colors.subtleBg}
          >
            <Box>
              <Text fontWeight="600" color={colors.textPrimary}>
                {threat.name}
              </Text>
              <Text fontSize="sm" color={colors.textSecondary}>
                {threat.count} detections this week
              </Text>
            </Box>
            <Badge colorScheme={threat.color} fontSize="0.75rem">
              {threat.trend}
            </Badge>
          </Flex>
        ))}
      </Stack>
    ),
  },
  system: {
    id: 'system',
    title: 'System Health',
    icon: MdDeviceHub,
    render: (colors) => (
      <Stack spacing={4}>
        {[
          { label: 'Sensor Availability', value: 96, color: 'green.400' },
          { label: 'Log Ingestion', value: 82, color: 'brand.500' },
          { label: 'Correlator Queue', value: 64, color: 'orange.400' },
        ].map((metric) => (
          <Box key={metric.label}>
            <Flex justify="space-between" fontSize="sm" mb={1} color={colors.textSecondary}>
              <Text fontWeight="600" color={colors.textPrimary}>
                {metric.label}
              </Text>
              <Text>{metric.value}%</Text>
            </Flex>
            <Box h="6px" borderRadius="8px" bg={colors.trackBg}>
              <Box
                h="100%"
                w={`${metric.value}%`}
                borderRadius="inherit"
                bg={metric.color}
                transition="width 0.2s ease"
              />
            </Box>
          </Box>
        ))}
      </Stack>
    ),
  },
  activity: {
    id: 'activity',
    title: 'Recent Activities',
    icon: MdTimeline,
    render: (colors) => (
      <Stack spacing={3}>
        {[
          {
            time: '08:24',
            text: 'Rule "Critical SQL Injection" updated by A. Moreno',
          },
          { time: '07:58', text: 'New IDS source onboarding started (Zeek-DC2)' },
          { time: '07:41', text: 'Alert severity adjusted for anomaly policy' },
        ].map((event) => (
          <Flex key={event.time} align="center" gap={3}>
            <Box
              minW="56px"
              textAlign="center"
              fontSize="xs"
              fontWeight="700"
              color={colors.textPrimary}
              bg={colors.subtleBg}
              borderRadius="10px"
              py={1}
            >
              {event.time}
            </Box>
            <Text fontSize="sm" color={colors.textSecondary}>
              {event.text}
            </Text>
          </Flex>
        ))}
      </Stack>
    ),
  },
  severity: {
    id: 'severity',
    title: 'Alert Severity Distribution',
    icon: MdBarChart,
    render: (colors) => (
      <Stack spacing={3}>
        {[
          { label: 'Critical', value: 8, total: 120, color: 'red.400' },
          { label: 'High', value: 22, total: 120, color: 'orange.400' },
          { label: 'Medium', value: 56, total: 120, color: 'yellow.400' },
          { label: 'Low', value: 34, total: 120, color: 'green.400' },
        ].map((bucket) => (
          <Box key={bucket.label}>
            <Flex justify="space-between" fontSize="sm" color={colors.textSecondary}>
              <Text fontWeight="600" color={colors.textPrimary}>
                {bucket.label}
              </Text>
              <Text>
                {bucket.value} alerts ({Math.round((bucket.value / bucket.total) * 100)}%)
              </Text>
            </Flex>
            <Box h="6px" borderRadius="8px" bg={colors.trackBg}>
              <Box
                h="100%"
                w={`${(bucket.value / bucket.total) * 100}%`}
                borderRadius="inherit"
                bg={bucket.color}
                transition="width 0.2s ease"
              />
            </Box>
          </Box>
        ))}
      </Stack>
    ),
  },
};

const DEFAULT_ORDER = Object.keys(MODULE_LIBRARY);

export default function NetworkAdminDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const dragBorderColor = useColorModeValue('brand.500', 'brand.200');
  const subtleBg = useColorModeValue('secondaryGray.200', 'whiteAlpha.100');
  const trackBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const textSecondary = useColorModeValue('secondaryGray.700', 'whiteAlpha.700');
  const textTertiary = useColorModeValue('secondaryGray.500', 'whiteAlpha.500');

  const colors = useMemo(
    () => ({
      textPrimary: textColor,
      textSecondary,
      textTertiary,
      subtleBg,
      trackBg,
    }),
    [subtleBg, textColor, textSecondary, textTertiary, trackBg],
  );

  const [moduleOrder, setModuleOrder] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_ORDER;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_ORDER;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((moduleId) => MODULE_LIBRARY[moduleId])) {
        const uniqueIds = Array.from(new Set(parsed));
        const missing = DEFAULT_ORDER.filter((moduleId) => !uniqueIds.includes(moduleId));
        return [...uniqueIds, ...missing];
      }
      return DEFAULT_ORDER;
    } catch (error) {
      console.warn('Unable to parse saved dashboard layout, falling back to default.', error);
      return DEFAULT_ORDER;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draggedModuleId, setDraggedModuleId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(moduleOrder));
  }, [moduleOrder]);

  const modules = useMemo(
    () => moduleOrder.map((moduleId) => MODULE_LIBRARY[moduleId]).filter(Boolean),
    [moduleOrder],
  );

  const handleDragOver = useCallback(
    (event) => {
      if (!isEditing) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    [isEditing],
  );

  const handleDragStart = useCallback((event, moduleId) => {
    if (!isEditing) {
      return;
    }
    event.dataTransfer.setData(DATA_TRANSFER_TYPE, moduleId);
    event.dataTransfer.effectAllowed = 'move';
    setDraggedModuleId(moduleId);
  }, [isEditing]);

  const handleDrop = useCallback(
    (event, targetModuleId) => {
      if (!isEditing) {
        return;
      }

      event.preventDefault();
      const sourceModuleId = event.dataTransfer.getData(DATA_TRANSFER_TYPE);

      if (!sourceModuleId || sourceModuleId === targetModuleId) {
        setDragOverId(null);
        setDraggedModuleId(null);
        return;
      }

      setModuleOrder((previousOrder) => {
        const nextOrder = previousOrder.filter((moduleId) => moduleId !== sourceModuleId);

        if (!targetModuleId) {
          nextOrder.push(sourceModuleId);
          return nextOrder;
        }

        const targetIndex = nextOrder.indexOf(targetModuleId);
        if (targetIndex === -1) {
          nextOrder.push(sourceModuleId);
          return nextOrder;
        }

        nextOrder.splice(targetIndex, 0, sourceModuleId);
        return nextOrder;
      });

      setDragOverId(null);
      setDraggedModuleId(null);
    },
    [isEditing],
  );

  const handleDragEnter = useCallback(
    (moduleId) => {
      if (!isEditing || moduleId === draggedModuleId) {
        return;
      }
      setDragOverId(moduleId);
    },
    [draggedModuleId, isEditing],
  );

  const handleDragLeave = useCallback(
    (moduleId) => {
      if (dragOverId === moduleId) {
        setDragOverId(null);
      }
    },
    [dragOverId],
  );

  const handleDragEnd = useCallback(() => {
    setDragOverId(null);
    setDraggedModuleId(null);
  }, []);

  const resetLayout = useCallback(() => {
    setModuleOrder(DEFAULT_ORDER);
    setDragOverId(null);
    setDraggedModuleId(null);
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb="24px" gap={3}>
        <Box>
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%" mb="6px">
            Network Administrator Dashboard
          </Text>
          <Text color={textSecondary} fontSize="sm">
            Reorder the modules below to craft a workspace that matches your workflow.
          </Text>
        </Box>
        <HStack spacing={3} alignSelf={{ base: 'flex-end', md: 'center' }}>
          <Button variant="ghost" size="sm" onClick={resetLayout} isDisabled={!isEditing}>
            Reset Layout
          </Button>
          <Button
            colorScheme={isEditing ? 'green' : 'brand'}
            size="sm"
            leftIcon={<Icon as={isEditing ? MdCheck : MdOutlineEdit} />}
            onClick={() => {
              setIsEditing((value) => !value);
              setDragOverId(null);
              setDraggedModuleId(null);
            }}
          >
            {isEditing ? 'Done' : 'Edit Layout'}
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        <Card py="15px" bg={cardBg}>
          <Box display="flex" alignItems="center">
            <IconBox w="56px" h="56px" bg={boxBg} icon={<MdBarChart size="28px" color={brandColor} />} />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                Active Alerts
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                24
              </Text>
            </Box>
          </Box>
        </Card>

        <Card py="15px" bg={cardBg}>
          <Box display="flex" alignItems="center">
            <IconBox w="56px" h="56px" bg={boxBg} icon={<MdDashboard size="28px" color={brandColor} />} />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                Managed IDS Rules
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                156
              </Text>
            </Box>
          </Box>
        </Card>

        <Card py="15px" bg={cardBg}>
          <Box display="flex" alignItems="center">
            <IconBox w="56px" h="56px" bg={boxBg} icon={<MdDeviceHub size="28px" color={brandColor} />} />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                Connected Sensors
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                3
              </Text>
            </Box>
          </Box>
        </Card>

        <Card py="15px" bg={cardBg}>
          <Box display="flex" alignItems="center">
            <IconBox w="56px" h="56px" bg={boxBg} icon={<MdTimeline size="28px" color={brandColor} />} />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                Pending Actions
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                8
              </Text>
            </Box>
          </Box>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isDragged = draggedModuleId === module.id;
          const isDragTarget = dragOverId === module.id;

          return (
            <Card
              key={module.id}
              bg={cardBg}
              p="20px"
              draggable={isEditing}
              cursor={isEditing ? 'grab' : 'default'}
              borderWidth={isEditing && (isDragged || isDragTarget) ? '2px' : '1px'}
              borderStyle={isEditing && isDragTarget ? 'dashed' : 'solid'}
              borderColor={
                isEditing && (isDragged || isDragTarget)
                  ? dragBorderColor
                  : 'transparent'
              }
              opacity={isDragged ? 0.6 : 1}
              onDragStart={(event) => handleDragStart(event, module.id)}
              onDragEnter={() => handleDragEnter(module.id)}
              onDragLeave={() => handleDragLeave(module.id)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, module.id)}
              onDragEnd={handleDragEnd}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Flex align="center" gap={3}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="12px"
                    bg={boxBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={IconComponent} w="20px" h="20px" color={brandColor} />
                  </Box>
                  <Box>
                    <Text fontSize="lg" fontWeight="700" color={textColor}>
                      {module.title}
                    </Text>
                    {isEditing ? (
                      <Text fontSize="xs" color={textSecondary}>
                        Drag and drop to reposition this module
                      </Text>
                    ) : null}
                  </Box>
                </Flex>
                {isEditing ? (
                  <Tooltip label="Drag to move" hasArrow>
                    <Flex
                      align="center"
                      justify="center"
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={subtleBg}
                    >
                      <Icon as={MdOutlineDragIndicator} color={textSecondary} />
                    </Flex>
                  </Tooltip>
                ) : null}
              </Flex>
              {module.render(colors)}
            </Card>
          );
        })}
      </SimpleGrid>

      {isEditing ? (
        <Box
          mt="20px"
          borderRadius="16px"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={dragOverId === 'tray' ? dragBorderColor : subtleBg}
          color={textSecondary}
          p="24px"
          textAlign="center"
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, null)}
          onDragEnter={() => handleDragEnter('tray')}
          onDragLeave={() => handleDragLeave('tray')}
        >
          Drop a module here to move it to the end of the dashboard
        </Box>
      ) : null}
    </Box>
  );
}

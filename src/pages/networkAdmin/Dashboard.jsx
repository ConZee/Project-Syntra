// ============================================================================
// NEW FILE: src/pages/network-admin/Dashboard.jsx
// ============================================================================
import React from 'react';
import { Box, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { MdBarChart, MdAttachMoney, MdFileCopy, MdDashboard } from 'react-icons/md';
import IconBox from 'components/icons/IconBox';

export default function NetworkAdminDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text
        color={textColor}
        fontSize="22px"
        fontWeight="700"
        lineHeight="100%"
        mb="20px"
      >
        Network Administrator Dashboard
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        <Card py="15px">
          <Box display="flex" alignItems="center">
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<MdBarChart size="28px" color={brandColor} />}
            />
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

        <Card py="15px">
          <Box display="flex" alignItems="center">
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<MdFileCopy size="28px" color={brandColor} />}
            />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                IDS Rules
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                156
              </Text>
            </Box>
          </Box>
        </Card>

        <Card py="15px">
          <Box display="flex" alignItems="center">
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<MdAttachMoney size="28px" color={brandColor} />}
            />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                IDS Sources
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                3
              </Text>
            </Box>
          </Box>
        </Card>

        <Card py="15px">
          <Box display="flex" alignItems="center">
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<MdDashboard size="28px" color={brandColor} />}
            />
            <Box ml="18px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mb="4px">
                Notifications
              </Text>
              <Text color={textColor} fontSize="34px" fontWeight="700">
                8
              </Text>
            </Box>
          </Box>
        </Card>
      </SimpleGrid>

      <Card mb="20px">
        <Text color={textColor} fontSize="xl" fontWeight="700" mb="10px">
          Dashboard Modules (Coming Soon)
        </Text>
        <Text color="secondaryGray.600" fontSize="md">
          This is where customizable dashboard modules will be displayed. Features include:
        </Text>
        <Box as="ul" pl="20px" mt="10px" color="secondaryGray.600">
          <li>Real-time Alerts Feed</li>
          <li>Network Traffic Overview</li>
          <li>Top Threats Module</li>
          <li>System Status Module</li>
          <li>Alert Severity Distribution</li>
          <li>Geographic Threat Map</li>
          <li>Alert Timeline</li>
          <li>Drag-and-drop customization</li>
        </Box>
      </Card>
    </Box>
  );
}
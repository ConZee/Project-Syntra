import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';

export default function AlertsPage() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card direction="column" w="100%" px="25px" py="25px">
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Alerts Management
        </Text>
        <Text color="secondaryGray.600" fontSize="md" mb="20px">
          This page will display real-time alerts from Suricata and Zeek IDS systems.
        </Text>
        <Text color={textColor} fontSize="lg" fontWeight="600" mb="10px">
          Planned Features:
        </Text>
        <Box as="ul" pl="20px" color="secondaryGray.600">
          <li>Real-time alert table with filtering</li>
          <li>Search by IP address, timestamp, severity</li>
          <li>Alert details drawer with full event information</li>
          <li>Severity badges (High/Medium/Low)</li>
          <li>Status indicators (New/In Progress/Resolved)</li>
          <li>Bulk actions (resolve, export)</li>
          <li>Auto-refresh functionality</li>
          <li>Alert correlation between Suricata and Zeek</li>
        </Box>
      </Card>
    </Box>
  );
}
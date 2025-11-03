import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';

export default function NotificationSettings() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card direction="column" w="100%" px="25px" py="25px">
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Alert Notification Settings
        </Text>
        <Text color="secondaryGray.600" fontSize="md" mb="20px">
          This page will allow you to configure notification rules for alert delivery.
        </Text>
        <Text color={textColor} fontSize="lg" fontWeight="600" mb="10px">
          Planned Features:
        </Text>
        <Box as="ul" pl="20px" color="secondaryGray.600">
          <li>Create notification rules based on alert conditions</li>
          <li>Configure trigger conditions (severity, category, threshold)</li>
          <li>Set up delivery methods (Email, SMS, Slack, Webhook)</li>
          <li>Configure recipient lists</li>
          <li>Customize message templates</li>
          <li>Enable/disable notification rules</li>
          <li>Test notification delivery</li>
          <li>View notification history/logs</li>
        </Box>
      </Card>
    </Box>
  );
}
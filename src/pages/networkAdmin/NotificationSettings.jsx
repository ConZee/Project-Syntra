import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Switch,
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import Card from 'components/card/Card';
import {
  fetchAlertNotifications,
  createAlertNotification,
  updateAlertNotification,
  deleteAlertNotification,
  searchAlertNotifications
} from 'backend_api';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [formData, setFormData] = useState({
    notification_name: '',
    notification_type: 'Email',
    severity_filter: 'High',
    recipient: '',
    enabled: true
  });

  const toast = useToast();
  const cancelRef = React.useRef();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
  const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

  // Fetch all notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchAlertNotifications();
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'Error loading notifications',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNotifications();
      return;
    }

    try {
      setLoading(true);
      const data = await searchAlertNotifications(searchQuery);
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'Search failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      notification_name: '',
      notification_type: 'Email',
      severity_filter: 'High',
      recipient: '',
      enabled: true
    });
    onAddOpen();
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      notification_name: notification.notification_name,
      notification_type: notification.notification_type,
      severity_filter: notification.severity_filter,
      recipient: notification.recipient,
      enabled: notification.enabled === 1
    });
    onEditOpen();
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    onDeleteOpen();
  };

  const handleSubmitAdd = async () => {
    try {
      setIsSubmitting(true);
      await createAlertNotification(formData);
      toast({
        title: 'Alert/Notification has been successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onAddClose();
      loadNotifications();
    } catch (error) {
      toast({
        title: 'Error creating notification',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      setIsSubmitting(true);
      await updateAlertNotification(selectedNotification.id, formData);
      toast({
        title: 'IDS Rule has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
      loadNotifications();
    } catch (error) {
      toast({
        title: 'Error updating notification',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteAlertNotification(selectedNotification.id);
      toast({
        title: 'Alert/Notification has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      loadNotifications();
    } catch (error) {
      toast({
        title: 'Error deleting notification',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Email':
        return 'blue';
      case 'Webhook':
        return 'purple';
      case 'SMS':
        return 'green';
      case 'Slack':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'yellow';
      case 'All':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        {/* Header */}
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Box>
            <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
              Alert Notifications
            </Text>
            <Text color="secondaryGray.600" fontSize="sm" mt="5px">
              Configure alert delivery channels and thresholds
            </Text>
          </Box>
          <Button
            leftIcon={<MdAdd />}
            colorScheme="brand"
            variant="solid"
            onClick={handleAdd}
          >
            Add Notification
          </Button>
        </Flex>

        {/* Search Bar */}
        <Flex px="25px" mb="20px" gap="10px">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, type, or recipient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Button onClick={handleSearch} colorScheme="brand">
            Search
          </Button>
          {searchQuery && (
            <Button
              onClick={() => {
                setSearchQuery('');
                loadNotifications();
              }}
            >
              Clear
            </Button>
          )}
        </Flex>

        {/* Table */}
        {loading ? (
          <Flex justify="center" align="center" py="40px">
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : notifications.length === 0 ? (
          <Flex justify="center" align="center" py="40px">
            <Text color={textColor} fontSize="md">
              {searchQuery ? 'No notifications found matching your search' : 'No notifications configured yet. Click "Add Notification" to create one.'}
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px">
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>Notification Name</Th>
                  <Th borderColor={borderColor}>Type</Th>
                  <Th borderColor={borderColor}>Severity Filter</Th>
                  <Th borderColor={borderColor}>Recipient</Th>
                  <Th borderColor={borderColor}>Status</Th>
                  <Th borderColor={borderColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notifications.map((notif) => (
                  <Tr key={notif.id}>
                    <Td borderColor={borderColor}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {notif.notification_name}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge colorScheme={getTypeColor(notif.notification_type)}>
                        {notif.notification_type}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge colorScheme={getSeverityColor(notif.severity_filter)}>
                        {notif.severity_filter}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text color={textColor} fontSize="sm">
                        {notif.recipient}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge colorScheme={notif.enabled ? 'green' : 'gray'}>
                        {notif.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Flex gap="8px">
                        <IconButton
                          icon={<MdEdit />}
                          aria-label="Edit notification"
                          size="sm"
                          onClick={() => handleEdit(notif)}
                          bg={bgButton}
                          _hover={bgHover}
                          _focus={bgFocus}
                        />
                        <IconButton
                          icon={<MdDelete />}
                          aria-label="Delete notification"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteClick(notif)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      {/* Add Notification Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Alert Notification</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired mb={4}>
              <FormLabel>Notification Name</FormLabel>
              <Input
                placeholder="e.g., High Severity Alerts"
                value={formData.notification_name}
                onChange={(e) => setFormData({ ...formData, notification_name: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Notification Type</FormLabel>
              <Select
                value={formData.notification_type}
                onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
              >
                <option value="Email">Email</option>
                <option value="Webhook">Webhook</option>
                <option value="SMS">SMS</option>
                <option value="Slack">Slack</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Severity Filter</FormLabel>
              <Select
                value={formData.severity_filter}
                onChange={(e) => setFormData({ ...formData, severity_filter: e.target.value })}
              >
                <option value="All">All Severities</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium and Above</option>
                <option value="Low">Low and Above</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Recipient</FormLabel>
              <Input
                placeholder={
                  formData.notification_type === 'Email' ? 'admin@company.com' :
                  formData.notification_type === 'Webhook' ? 'https://hooks.slack.com/...' :
                  formData.notification_type === 'SMS' ? '+1234567890' :
                  '#security-alerts'
                }
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable Notification</FormLabel>
              <Switch
                isChecked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                colorScheme="green"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onAddClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmitAdd}
              isLoading={isSubmitting}
              isDisabled={!formData.notification_name || !formData.recipient}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Notification Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Alert Notification</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired mb={4}>
              <FormLabel>Notification Name</FormLabel>
              <Input
                value={formData.notification_name}
                onChange={(e) => setFormData({ ...formData, notification_name: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Notification Type</FormLabel>
              <Select
                value={formData.notification_type}
                onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
              >
                <option value="Email">Email</option>
                <option value="Webhook">Webhook</option>
                <option value="SMS">SMS</option>
                <option value="Slack">Slack</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Severity Filter</FormLabel>
              <Select
                value={formData.severity_filter}
                onChange={(e) => setFormData({ ...formData, severity_filter: e.target.value })}
              >
                <option value="All">All Severities</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium and Above</option>
                <option value="Low">Low and Above</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Recipient</FormLabel>
              <Input
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable Notification</FormLabel>
              <Switch
                isChecked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                colorScheme="green"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onEditClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmitEdit}
              isLoading={isSubmitting}
              isDisabled={!formData.notification_name || !formData.recipient}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Alert Notification
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{selectedNotification?.notification_name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                ml={3}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

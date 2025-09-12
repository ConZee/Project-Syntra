import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; 
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.jpeg';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

function SignIn() {
  // UI state
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // Auth + routing
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [userType, setUserType] = React.useState('Platform Admin');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!userType || !username || !password) {
      setErr('Please fill in all fields.');
      return;
    }

    // Map dropdown → internal role + landing path
    const roleMap = {
      'Platform Admin': { role: 'platform_admin', home: '/platform-admin' },
      'Network Admin':  { role: 'network_admin',  home: '/admin' },       // update later
      'Security Analyst': { role: 'security_analyst', home: '/admin' },   // update later
    };

    const mapped = roleMap[userType];

    // TODO: Replace with real API call
    const token = 'demo-token';
    const user = {
      id: 'u1',
      username,
      email: `${username}@example.com`,
      role: mapped.role,
      displayRole: userType,
    };

    // Save auth + route strictly by dropdown selection
    login(token, user);
    navigate(mapped.home, { replace: true });
  };

  // Chakra colors
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Welcome
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Choose your role and enter your credentials.
          </Text>
        </Box>

        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <form onSubmit={handleSubmit}>
            <FormControl>
              {/* User Type */}
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                User Type<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                mb="24px"
                size="lg"
                fontSize="sm"
                variant="auth"
                color={textColor}
                sx={{
                  option: { color: textColor },
                }}
              >
                <option>Platform Admin</option>
                <option>Network Admin</option>
                <option>Security Analyst</option>
              </Select>

              {/* Username */}
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Username<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Enter your username"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />

              {/* Password */}
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired
                  fontSize="sm"
                  placeholder="Enter your password"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>

              {err && (
                <Text color="red.400" fontSize="sm" mb="12px">
                  {err}
                </Text>
              )}

              <Button
                type="submit"
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="12px"
              >
                Sign In
              </Button>

              <Flex justify="center" align="center" mt="8px" w="100%">
                <NavLink to="/auth/forgot-password">
                  <Text color={textColorBrand} fontSize="sm" fontWeight="500">
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;

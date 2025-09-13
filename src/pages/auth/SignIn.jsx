import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

  // Form state
  const [userType, setUserType] = React.useState('Platform Admin');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');

  // Frontend-only demo accounts (prototype)
  // username/password must match the selected profile's base below
  const DEMO = [
    { username: 'pa', password: 'pa123', base: '/platform-admin',  name: 'Platform Admin',   avatarUrl: '' },
    { username: 'na', password: 'na123', base: '/network-admin',   name: 'Network Admin',    avatarUrl: '' },
    { username: 'sa', password: 'sa123', base: '/security-analyst',name: 'Security Analyst', avatarUrl: '' },
  ];

  // Map dropdown label → base path (URL prefix drives role)
  const baseFor = (label) => {
    switch (label) {
      case 'Platform Admin':  return '/platform-admin';
      case 'Network Admin':   return '/network-admin';
      case 'Security Analyst':return '/security-analyst';
      default:                return '/platform-admin';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr('');

    if (!userType || !username || !password) {
      setErr('Please fill in all fields.');
      return;
    }

    const base = baseFor(userType);
    const match = DEMO.find(
      (u) => u.username === username && u.password === password && u.base === base
    );

    if (!match) {
      setErr('Invalid credentials or profile type.');
      return;
    }

    // Minimal user object for UI (profile/avatar/sidebar)
    const { password: _drop, ...user } = match; // strip pw

    // Persist for refreshes / sidebar profile
    localStorage.setItem('syntra_user', JSON.stringify(user));

    // If your AuthContext wants a token+user, feed it a demo token
    login?.('demo-token', user);

    // Frontend redirect to the role's dashboard
    navigate(`${user.base}/dashboard`, { replace: true });
  };

  // Chakra colors
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

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
                sx={{ option: { color: textColor } }}
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

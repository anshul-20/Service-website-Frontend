import {
  useToast,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Select
} from '@chakra-ui/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth.context';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const toast = useToast();
  const navigate = useNavigate();
  const auth = useAuth();
  const [params] = useSearchParams();

  useEffect(() => {
    const error = params.get('error');
    if (error) {
      toast({
        title: error,
        status: 'error',
        position: 'top',
        isClosable: true,
        duration: 5000
      });
    }
  }, [params, toast]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registeredUser = await auth?.registerUser({
      name,
      email,
      phoneNumber,
      password,
      role
    });
    if (registeredUser?.error.length) {
      registeredUser.error.forEach((error: string) => {
        toast({
          title: error,
          status: 'error',
          position: 'top',
          isClosable: true
        });
      });
      console.error(registeredUser.error);
      return;
    }

    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Register</Heading>
          </Stack>
          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="phoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl id="role">
                <FormLabel>Role</FormLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="WORKER">Worker</option>
                </Select>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Link to="/auth/login">Already have an account? Log In</Link>
                </Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                >
                  Register
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
};

export default RegisterPage;

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link as ChakraLink,
  Button,
  Heading,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth.context';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
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

    const loggedInUser = await auth?.loginUser({ email, password });

    if (loggedInUser?.error.length) {
      loggedInUser.error.forEach((error: string) => {
        console.log(error, 'here');
        toast({
          title: loggedInUser.error[0],
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
      });
      console.error(loggedInUser.error);
      return;
    }

    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Login</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setEmail(e.currentTarget.value)
                  }
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setPassword(e.currentTarget.value)
                  }
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Link to="/auth/register">
                    <ChakraLink color={'blue.600'}>
                      Don't have account? Register
                    </ChakraLink>
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
};

export default LoginPage;

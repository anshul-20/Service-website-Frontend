import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  useToast,
  Textarea,
  Select
} from '@chakra-ui/react';
import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { instance } from '../lib/axios';

export interface Service {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const CreateOrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[] | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const response = await instance.get<Service[]>('/service');
        console.log(response)
        setLoading(false);
        setServices([...response.data]);
      } catch (err) {
        toast({
          title: 'unable to fetch services',
          status: 'error',
          position: 'top',
          duration: 9000
        });
        navigate('/');
      }
    };
    getAllServices();
  }, [toast, navigate]);

  if (loading) {
    return <Loading />;
  }
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await instance.post('/order', {
        address,
        description,
        status: 'PROCESSING',
        serviceId: service
      });
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          //@ts-ignore
          const errorMessage = err.response.data.message;
          if (typeof errorMessage === 'string') {
            return toast({
              title: errorMessage,
              status: 'error',
              position: 'top',
              isClosable: true,
              duration: 9000
            });
          } else {
            return errorMessage.forEach((error: string) => {
              toast({
                title: error,
                status: 'error',
                position: 'top',
                isClosable: true,
                duration: 9000
              });
            });
          }
        }
      }
      return toast({
        title: 'something went wrong',
        status: 'error',
        position: 'top',
        isClosable: true,
        duration: 5000
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {' '}
      <Flex justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} py={12} px={6} width={'100%'}>
          <Box rounded={'lg'} bg={'white'} width="100%" boxShadow={'lg'} p={8}>
            <Stack spacing={4} width="100%">
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl id="address">
                <FormLabel>Address</FormLabel>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  required
                />
              </FormControl>
              <FormControl id="services">
                <FormLabel>Choose a service</FormLabel>
                <Select
                  placeholder="select a service"
                  required
                  onChange={(e) => setService(e.target.value)}
                >
                  {services?.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                ></Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                >
                  Create Order
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
};

export default CreateOrderPage;

import {
  Heading,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { instance } from '../lib/axios';
import { Order as OrderInterface } from './Dashboard';

const Order = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderInterface | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleAcceptOrder = async () => {
    const response = await instance.patch<OrderInterface | null>(
      `/order/${params.orderId}`,
      {
        status: 'ACTIVE'
      }
    );
    console.log(response, 'handle accept order');
    setOrder(response.data);
  };

  const handleCompletedOrder = async () => {
    await instance.patch(`/order/${params.orderId}`, {
      status: 'DONE'
    });
    toast({
      title: 'Thank you for completing your order',
      status: 'success',
      isClosable: true,
      duration: 9000,
      position: 'top'
    });
    navigate('/worker/order/processing');
  };

  useEffect(() => {
    const getOrder = async () => {
      const response = await instance.get<OrderInterface>(
        `/order/${params.orderId}`
      );

      setLoading(false);
      console.log(response);
      setOrder(response.data);
    };
    getOrder();
  }, [params]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        bg={'white'}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
      >
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {order?.user?.name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          {order?.user?.email}
        </Text>
        <Text textAlign={'center'} color={'gray.700'} px={3}>
          {order?.description}
        </Text>
        <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
          <Badge px={2} py={1} fontWeight={'400'}>
            Phone - {order?.user?.phoneNumber}
          </Badge>
          <Badge px={2} py={1} fontWeight={'400'}>
            Address - {order?.address}
          </Badge>
        </Stack>

        <Stack mt={8} direction={'row'} spacing={4}>
          {order?.worker ? (
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500'
              }}
              _focus={{
                bg: 'blue.500'
              }}
              onClick={handleCompletedOrder}
            >
              Mark Order as Completed
            </Button>
          ) : (
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500'
              }}
              _focus={{
                bg: 'blue.500'
              }}
              onClick={handleAcceptOrder}
            >
              Accept Order
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
};
export default Order;

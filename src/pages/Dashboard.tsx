import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import ServiceCard from '../components/ServiceCard';
import { User } from '../contexts/auth.context';
import { instance } from '../lib/axios';
import { Service } from './CreateOrderPage';

export interface Order {
  address: string;
  description: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  service: Service;
  serviceId: number;
  userId: number;
  worker: User | null;
  workerId: number | null;
  status: string;
  user?: User;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const getAllOrders = async () => {
      const response = await instance.get<Order[]>('/order');
      console.log(response);
      setLoading(false);
      setOrders(response.data);
    };

    getAllOrders();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!orders.length) return <div>no order found</div>;

  return (
    <Flex gap="10px" flexWrap={'wrap'}>
      {orders.map((order) => (
        <Box width="32.33%" key={order.id}>
          <ServiceCard order={order} />
        </Box>
      ))}
    </Flex>
  );
};

export default Dashboard;

import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import ServiceCard from '../components/ServiceCard';
import { useAuth, User } from '../contexts/auth.context';
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
}

const ActiveOrdersPage = ({
  status = 'PROCESSING',
  workerId = undefined
}: {
  status?: string;
  workerId?: string | undefined;
}) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const getAllOrders = async () => {
      let query = [];
      if (status) {
        query.push('status=' + status);
      }
      if (workerId) {
        query.push('workerId=' + workerId);
      }
      const response = await instance.get<Order[]>(`/order?${query.join('&')}`);
      console.log(response);
      setLoading(false);
      setOrders(response.data);
    };

    getAllOrders();
  }, [auth, status, workerId]);

  if (loading) {
    return <Loading />;
  }

  if (!orders.length) return <div>no order found</div>;

  return (
    <Box>
      {orders.map((order) => (
        <ServiceCard key={order.id} order={order} clickable={true} />
      ))}
    </Box>
  );
};

export default ActiveOrdersPage;

import { Box, Heading, Text, Stack, Avatar } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../pages/Dashboard';

export default function ServiceCard({
  order,
  clickable = false
}: {
  order: Order;
  clickable?: boolean;
}) {
  console.log(order, 'everything');
  const navigate = useNavigate();
  return (
    <Box
      maxW={'445px'}
      w={'full'}
      bg={'white'}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
      onClick={() => {
        if (clickable) {
          navigate(`/worker/order/${order.id}`);
        }
      }}
    >
      <Stack>
        <Text
          color={'green.500'}
          textTransform={'uppercase'}
          fontWeight={800}
          fontSize={'sm'}
          letterSpacing={1.1}
        >
          {order.status}
        </Text>
        <Heading color={'gray.700'} fontSize={'2xl'} fontFamily={'body'}>
          {order.service.name}
        </Heading>
        <Text color={'gray.500'}>{order.description}</Text>
      </Stack>

      {order.worker ? (
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{order.worker.name}</Text>
            <Text fontWeight={600}>{order.worker.phoneNumber}</Text>
            <Text color={'gray.500'}>{order.createdAt}</Text>
          </Stack>
        </Stack>
      ) : null}
    </Box>
  );
}

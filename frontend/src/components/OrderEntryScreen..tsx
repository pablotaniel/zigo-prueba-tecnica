import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrder, createOrder } from '../api/orders';
import { OrderDetailsCard } from './OrderDetailsCard';
import { OrderLineForm } from './OrderLineForm';

interface Props {
  orderId?: string;
  customerId: string;
}

export const OrderEntryScreen: React.FC<Props> = ({
  orderId,
  customerId,
}) => {
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (order) {
      document.title = `Orden ${order.id}`;
    }
  }, [order]);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      alert('Orden guardada');

      if (orderId) {
        queryClient.invalidateQueries({
          queryKey: ['order', orderId],
        });
      }
    },
  });

  if (orderId && isLoading) {
    return <div>Cargando...</div>;
  }

  if (orderId && error) {
    return <div>Error al cargar la orden.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {order && <OrderDetailsCard order={order} />}

      <OrderLineForm
        order={order}
        customerId={customerId}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
};
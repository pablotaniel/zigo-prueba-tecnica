import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Home from './components/OrderEntryScreen';
import SuppliersScreen from './components/SuppliersScreen';
import ProductsScreen from './components/ProductsScreen';
import CustomersScreen from './components/CustomersScreen';
import OrderLineForm from './components/OrderForm';
import OrdersList from './components/OrderList';

import { createOrder } from './api/orders';
import { CreateOrderPayload } from './types/order';

const queryClient = new QueryClient();

type Screen =
  | 'home'
  | 'suppliers'
  | 'products'
  | 'customers'
  | 'orders'
  | 'orders-list';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = async (
    values: CreateOrderPayload
  ) => {
    try {
      setIsSubmitting(true);

      const order = await createOrder(values);

      console.log('Orden creada:', order);
      alert('Orden creada correctamente');

      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      setScreen('orders-list');
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          error.message ||
          'Error al crear la orden'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {screen === 'home' && (
        <Home
          onSuppliers={() => setScreen('suppliers')}
          onProducts={() => setScreen('products')}
          onCustomers={() => setScreen('customers')}
          onOrders={() => setScreen('orders')}
          onOrdersList={() => setScreen('orders-list')}
        />
      )}

      {screen === 'suppliers' && (
        <SuppliersScreen
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'products' && (
        <ProductsScreen
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'customers' && (
        <CustomersScreen
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'orders' && (
        <OrderLineForm
          onSubmit={handleCreateOrder}
          isSubmitting={isSubmitting}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'orders-list' && (
        <OrdersList
          onBack={() => setScreen('home')}
        />
      )}
    </QueryClientProvider>
  );
};

export default App;

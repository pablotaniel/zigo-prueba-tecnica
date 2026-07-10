import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderEntryScreen } from './components/OrderEntryScreen';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderEntryScreen
        orderId="06c35ae2-a671-4863-8a42-ce15e49a16a2"
        customerId="313576a4-8e78-48d7-8628-0ce627deabbb"
      />
    </QueryClientProvider>
  );
};

export default App;

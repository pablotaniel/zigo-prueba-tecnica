import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './components/Home';
import SuppliersScreen from './components/SuppliersScreen';

const queryClient = new QueryClient();

const App: React.FC = () => {

  const [screen, setScreen] = useState<'home' | 'suppliers'>('home');

  return (
    <QueryClientProvider client={queryClient}>

      {screen === 'home' && (
        <Home
          onSuppliers={() => setScreen('suppliers')}
        />
      )}

      {screen === 'suppliers' && (
        <SuppliersScreen
          onBack={() => setScreen('home')}
        />
      )}

    </QueryClientProvider>
  );
};

export default App;
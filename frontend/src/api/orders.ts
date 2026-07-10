import axios from 'axios';
import { Order, CreateOrderPayload, Product } from '../types/order';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export const fetchOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/orders/products');
  return data;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<{ orderId: string; total: number }> => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const checkStock = async (productId: string, quantity: number): Promise<boolean> => {
  const { data } = await api.get(`/inventory/${productId}/availability`, {
    params: { quantity }
  });
  return data.available;
};

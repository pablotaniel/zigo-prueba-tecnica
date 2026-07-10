import axios from 'axios';
import {
  Order,
  CreateOrderPayload,
  Product,
  UpdateOrderPayload,
} from '../types/order';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:4000',
});

export const fetchOrder = async (
  id: string
): Promise<Order> => {
  const { data } = await api.get<Order>(`/orders/${id}`);

  return data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/products');

  return data;
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const { data } = await api.post<Order>('/orders', payload);

  return data;
};

export const checkStock = async (
  productId: string,
  quantity: number
): Promise<boolean> => {
  const { data } = await api.get<Product>(
    `/products/${productId}`
  );

  return data.stock >= quantity;


};


export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/orders');
  return data;
};

export const updateOrder = async (
  id: string,
  payload: UpdateOrderPayload
): Promise<Order> => {
  const { data } = await api.put<Order>(
    `/orders/${id}`,
    payload
  );

  return data;
};

import axios from 'axios';
import { Product, CreateProductPayload } from '../types/product';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products');
  return data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const { data } = await api.post('/products', payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: CreateProductPayload
): Promise<Product> => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (
  id: string
): Promise<void> => {
  await api.delete(`/products/${id}`);
};
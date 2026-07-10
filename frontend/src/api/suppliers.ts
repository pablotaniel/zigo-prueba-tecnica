import axios from 'axios';
import { Supplier, CreateSupplierPayload } from '../types/supplier';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await api.get('/suppliers');
  return data;
};

export const fetchSupplier = async (id: string): Promise<Supplier> => {
  const { data } = await api.get(`/suppliers/${id}`);
  return data;
};

export const createSupplier = async (
  payload: CreateSupplierPayload
): Promise<Supplier> => {
  const { data } = await api.post('/suppliers', payload);
  return data;
};

export const updateSupplier = async (
  id: string,
  payload: CreateSupplierPayload
): Promise<Supplier> => {
  const { data } = await api.put(`/suppliers/${id}`, payload);
  return data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};
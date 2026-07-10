import axios from 'axios';
import { Customer, CustomerInput } from '../types/customer';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:4000',
});

export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await api.get<Customer[]>('/customers');

  return data;
};

export const fetchCustomer = async (
  id: string
): Promise<Customer> => {
  const { data } = await api.get<Customer>(`/customers/${id}`);

  return data;
};

export const createCustomer = async (
  payload: CustomerInput
): Promise<Customer> => {
  const { data } = await api.post<Customer>(
    '/customers',
    payload
  );

  return data;
};

export const updateCustomer = async (
  id: string,
  payload: CustomerInput
): Promise<Customer> => {
  const { data } = await api.put<Customer>(
    `/customers/${id}`,
    payload
  );

  return data;
};

export const deleteCustomer = async (
  id: string
): Promise<void> => {
  await api.delete(`/customers/${id}`);
};
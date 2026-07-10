export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface CreateSupplierPayload {
  name: string;
  email?: string;
  phone?: string;
}
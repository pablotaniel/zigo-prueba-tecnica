export interface Product {
  id: string;
  sku: string;
  name: string;
  supplier_id: string;
  supplier_name: string;
  unit_price: number;
  stock: number;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  supplier_id: string;
  unit_price: number;
  stock: number;
}
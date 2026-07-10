export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  stock: number;
}

export interface CreateOrderPayload {
  customerId: string;
  items: { productId: string; quantity: number }[];
  notes?: string;
}

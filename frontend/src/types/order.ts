
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string | null;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  sku?: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  supplier_id?: string;
  supplier_name?: string;
  unit_price: number;
  stock: number;
}

export interface CreateOrderPayload {
  customer_id: string;
  status?: OrderStatus;
  notes?: string;
  items: OrderItemPayload[];
}

export interface UpdateOrderPayload {
  customer_id: string;
  status: OrderStatus;
  notes?: string;
  items: OrderItemPayload[];
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
  unit_price: number;
}



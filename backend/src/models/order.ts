export interface OrderItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface OrderInput {
  customer_id: string;
  status: string;
  notes?: string;
  items: OrderItemInput[];
}
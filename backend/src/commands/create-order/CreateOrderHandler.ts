import { randomUUID } from 'crypto';
import { query } from '../../shared/db';
import axios from 'axios';
import { CreateOrderCommand } from './CreateOrderCommand';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory:3000';

export async function handleCreateOrder(cmd: CreateOrderCommand) {
  const productResult = await query(
    `SELECT p.*, 
            s.name as supplier_name,
            w.stock as warehouse_stock
     FROM products p
     JOIN suppliers s ON s.id = p.supplier_id
     JOIN warehouse w ON w.product_id = p.id
     WHERE p.id = ANY($1::uuid[])`,
    [cmd.items.map((i) => i.productId)]
  );

  if (productResult.rows.length !== cmd.items.length) {
    throw new Error('One or more products not found');
  }

  let total = 0;
  for (const item of cmd.items) {
    const product = productResult.rows.find((r) => r.id === item.productId);
    if (product) {
      total += product.unit_price * item.quantity * 1.16;
    }
  }

  const stockCheck = await axios.get(
    `${INVENTORY_SERVICE_URL}/stock/check`,
    { data: { items: cmd.items } }
  );

  if (!stockCheck.data.success) {
    throw new Error('Insufficient stock');
  }

  const orderId = randomUUID();

  await query(
    `INSERT INTO orders (id, customer_id, status, total, notes) VALUES ($1, $2, 'DRAFT', $3, $4)`,
    [orderId, cmd.customerId, total, cmd.notes ?? null]
  );

  return { success: true, orderId, total };
}

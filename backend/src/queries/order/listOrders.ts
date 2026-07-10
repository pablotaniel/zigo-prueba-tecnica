import { OrderInput } from '../../commands/order/OrderCommand';
import { query } from '../../shared/db';


export async function handleGetOrders() {
  const result = await query(
    `
    SELECT
        o.id,
        o.customer_id,
        c.name AS customer_name,
        o.status,
        o.total,
        o.notes,
        o.created_at
    FROM orders o
    INNER JOIN customers c
        ON c.id = o.customer_id
    ORDER BY o.created_at DESC
    `
  );

  return result.rows;
}

import { OrderInput } from '../../commands/order/OrderCommand';
import { query } from '../../shared/db';



export async function handleGetOrder(orderId: string) {
  const orderResult = await query(
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
    WHERE o.id = $1
    `,
    [orderId]
  );

  const order = orderResult.rows[0];

  if (!order) {
    return null;
  }

  const itemsResult = await query(
    `
    SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        p.sku,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        (oi.quantity * oi.unit_price) AS subtotal
    FROM order_items oi
    INNER JOIN products p
        ON p.id = oi.product_id
    WHERE oi.order_id = $1
    ORDER BY p.name
    `,
    [orderId]
  );

  return {
    ...order,
    items: itemsResult.rows,
  };
}

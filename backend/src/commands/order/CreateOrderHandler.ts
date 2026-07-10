import { OrderInput } from './OrderCommand';
import { query } from '../../shared/db';
import { handleGetOrder } from '../../queries/order/getOrder';



export async function handleCreateOrder(data: OrderInput) {
  const total = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  try {
    await query('BEGIN');

    const orderResult = await query(
      `
      INSERT INTO orders
      (
          customer_id,
          status,
          total,
          notes
      )
      VALUES
      ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        data.customer_id,
        data.status,
        total,
        data.notes || null,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of data.items) {
      await query(
        `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            unit_price
        )
        VALUES
        ($1,$2,$3,$4)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.unit_price,
        ]
      );
    }

    await query('COMMIT');

    return await handleGetOrder(order.id);
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}



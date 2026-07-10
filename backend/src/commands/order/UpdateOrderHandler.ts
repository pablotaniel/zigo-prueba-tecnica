import { OrderInput } from './OrderCommand';
import { query } from '../../shared/db';
import { handleGetOrder } from '../../queries/order/getOrder';


export async function handleUpdateOrder(
  orderId: string,
  data: OrderInput
) {
  const total = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  try {
    await query('BEGIN');

    const orderResult = await query(
      `
      UPDATE orders
      SET
          customer_id=$1,
          status=$2,
          total=$3,
          notes=$4
      WHERE id=$5
      RETURNING *
      `,
      [
        data.customer_id,
        data.status,
        total,
        data.notes || null,
        orderId,
      ]
    );

    const order = orderResult.rows[0];

    if (!order) {
      await query('ROLLBACK');
      return null;
    }

    await query(
      `
      DELETE FROM order_items
      WHERE order_id=$1
      `,
      [orderId]
    );

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
          orderId,
          item.product_id,
          item.quantity,
          item.unit_price,
        ]
      );
    }

    await query('COMMIT');

    return await handleGetOrder(orderId);
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}

import { OrderInput } from './OrderCommand';
import { query } from '../../shared/db';



export async function handleDeleteOrder(orderId: string) {
  try {
    await query('BEGIN');

    await query(
      `
      DELETE FROM order_items
      WHERE order_id=$1
      `,
      [orderId]
    );

    const result = await query(
      `
      DELETE FROM orders
      WHERE id=$1
      RETURNING id
      `,
      [orderId]
    );

    await query('COMMIT');

    return result.rows[0] || null;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}
import { OrderInput } from '../../models/order';
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
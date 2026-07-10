import { CustomerInput } from '../../models/customer';
import { query } from '../../shared/db';



export async function handleGetCustomers() {
  const result = await query(
    `
    SELECT
        id,
        email,
        name,
        created_at
    FROM customers
    ORDER BY name
    `
  );

  return result.rows;
}

export async function handleGetCustomer(customerId: string) {
  const result = await query(
    `
    SELECT
        id,
        email,
        name,
        created_at
    FROM customers
    WHERE id = $1
    `,
    [customerId]
  );

  return result.rows[0] || null;
}

export async function handleCreateCustomer(data: CustomerInput) {
  const result = await query(
    `
    INSERT INTO customers
    (
        email,
        name
    )
    VALUES
    ($1,$2)
    RETURNING *
    `,
    [
      data.email,
      data.name,
    ]
  );

  return result.rows[0];
}

export async function handleUpdateCustomer(
  customerId: string,
  data: CustomerInput
) {
  const result = await query(
    `
    UPDATE customers
    SET
        email=$1,
        name=$2
    WHERE id=$3
    RETURNING *
    `,
    [
      data.email,
      data.name,
      customerId,
    ]
  );

  return result.rows[0] || null;
}

export async function handleDeleteCustomer(customerId: string) {
  const result = await query(
    `
    DELETE FROM customers
    WHERE id=$1
    RETURNING id
    `,
    [customerId]
  );

  return result.rows[0] || null;
}
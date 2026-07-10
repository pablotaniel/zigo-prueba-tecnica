import { CustomerInput } from './CustomerCommand';
import { query } from '../../shared/db';




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

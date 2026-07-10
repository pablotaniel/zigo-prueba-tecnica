import { CustomerInput } from '../../commands/customer/CustomerCommand';
import { query } from '../../shared/db';




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
import { CustomerInput } from '../../commands/customer/CustomerCommand';
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

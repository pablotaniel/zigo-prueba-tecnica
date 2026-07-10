import { CustomerInput } from './CustomerCommand';
import { query } from '../../shared/db';



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
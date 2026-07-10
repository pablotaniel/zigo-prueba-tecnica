import { CustomerInput } from './CustomerCommand';
import { query } from '../../shared/db';



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
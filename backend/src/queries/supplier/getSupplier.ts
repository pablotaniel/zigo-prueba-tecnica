import { SupplierInput } from '../../commands/supplier/SupplierCommand';
import { query } from '../../shared/db';



export async function handleGetSupplier(supplierId: string) {
  const result = await query(
    `
    SELECT *
    FROM suppliers
    WHERE id = $1
    `,
    [supplierId]
  );

  return result.rows[0] || null;
}





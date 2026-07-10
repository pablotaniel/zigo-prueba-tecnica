import { SupplierInput } from './SupplierCommand';
import { query } from '../../shared/db';


export async function handleDeleteSupplier(supplierId: string) {
  const result = await query(
    `
    DELETE FROM suppliers
    WHERE id = $1
    RETURNING id
    `,
    [supplierId]
  );

  return result.rows[0] || null;
}
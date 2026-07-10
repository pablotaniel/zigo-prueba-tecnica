import { SupplierInput } from './SupplierCommand';
import { query } from '../../shared/db';


export async function handleUpdateSupplier(
  supplierId: string,
  data: SupplierInput
) {
  const result = await query(
    `
    UPDATE suppliers
    SET
      name = $1,
      email = $2,
      phone = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      data.name,
      data.email ?? null,
      data.phone ?? null,
      supplierId,
    ]
  );

  return result.rows[0] || null;
}

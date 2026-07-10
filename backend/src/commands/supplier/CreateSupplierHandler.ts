import { SupplierInput } from "./SupplierCommand";
import { query } from '../../shared/db';

export async function handleCreateSupplier(data: SupplierInput) {
  const result = await query(
    `
    INSERT INTO suppliers (
      name,
      email,
      phone
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      data.name,
      data.email ?? null,
      data.phone ?? null,
    ]
  );

  return result.rows[0];
}
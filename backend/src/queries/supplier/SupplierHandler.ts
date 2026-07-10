import { query } from '../../shared/db';

export interface SupplierInput {
  name: string;
  email?: string;
  phone?: string;
}

export async function handleGetSuppliers() {
  const result = await query(`
    SELECT *
    FROM suppliers
    ORDER BY name
  `);

  return result.rows;
}

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
import { ProductInput } from './ProductCommand';
import { query } from '../../shared/db';






export async function handleCreateProduct(data: ProductInput) {
  const result = await query(
    `
    INSERT INTO products
    (
        sku,
        name,
        supplier_id,
        unit_price,
        stock
    )
    VALUES
    ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      data.sku,
      data.name,
      data.supplier_id,
      data.unit_price,
      data.stock,
    ]
  );

  return result.rows[0];
}

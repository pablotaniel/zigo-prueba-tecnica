import { ProductInput } from '../../commands/product/ProductCommand';
import { query } from '../../shared/db';



export async function handleGetProducts() {
  const result = await query(
    `
    SELECT
        p.id,
        p.sku,
        p.name,
        p.unit_price,
        p.stock,
        p.supplier_id,
        s.name AS supplier_name
    FROM products p
    INNER JOIN suppliers s
        ON s.id = p.supplier_id
    ORDER BY p.name
    `
  );

  return result.rows;
}

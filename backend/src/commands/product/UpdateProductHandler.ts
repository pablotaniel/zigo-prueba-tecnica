import { ProductInput } from './ProductCommand';
import { query } from '../../shared/db';




export async function handleUpdateProduct(
  productId: string,
  data: ProductInput
) {
  const result = await query(
    `
    UPDATE products
    SET
        sku=$1,
        name=$2,
        supplier_id=$3,
        unit_price=$4,
        stock=$5
    WHERE id=$6
    RETURNING *
    `,
    [
      data.sku,
      data.name,
      data.supplier_id,
      data.unit_price,
      data.stock,
      productId,
    ]
  );

  return result.rows[0] || null;
}
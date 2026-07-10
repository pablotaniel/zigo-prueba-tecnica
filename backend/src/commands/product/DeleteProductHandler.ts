import { ProductInput } from './ProductCommand';
import { query } from '../../shared/db';



export async function handleDeleteProduct(productId: string) {
  const result = await query(
    `
    DELETE FROM products
    WHERE id=$1
    RETURNING id
    `,
    [productId]
  );

  return result.rows[0] || null;
}
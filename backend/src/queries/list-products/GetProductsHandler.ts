import { query } from '../../shared/db';

export async function handleGetProducts() {
  const result = await query(`SELECT * FROM products ORDER BY name`);
  return result.rows;
}

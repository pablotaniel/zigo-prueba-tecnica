import { SupplierInput } from '../../commands/supplier/SupplierCommand';
import { query } from '../../shared/db';



export async function handleGetSuppliers() {
  const result = await query(`
    SELECT *
    FROM suppliers
    ORDER BY name
  `);

  return result.rows;
}





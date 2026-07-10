import { ProductInput } from '../../models/product';
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

export async function handleGetProduct(productId: string) {
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
    WHERE p.id = $1
    `,
    [productId]
  );

  return result.rows[0] || null;
}

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
INSERT INTO suppliers (id, name, email, phone, address)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Dell Guatemala',
    'ventas@dell.com',
    '5555-1111',
    'Ciudad de Guatemala'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Logitech Guatemala',
    'ventas@logitech.com',
    '5555-2222',
    'Ciudad de Guatemala'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO customers (id, email, name)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'juan@empresa.com',
    'Juan Pérez'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'maria@empresa.com',
    'María García'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
    id,
    sku,
    name,
    supplier_id,
    unit_price,
    stock
)
VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'LAPTOP-001',
    'Laptop Dell XPS 15',
    'a0000000-0000-0000-0000-000000000001',
    2500.00,
    10
),
(
    'p0000000-0000-0000-0000-000000000002',
    'MOUSE-001',
    'Mouse Inalámbrico',
    'a0000000-0000-0000-0000-000000000002',
    45.50,
    100
),
(
    'p0000000-0000-0000-0000-000000000003',
    'KB-001',
    'Teclado Mecánico',
    'a0000000-0000-0000-0000-000000000002',
    120.00,
    50
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO orders (
    id,
    customer_id,
    status,
    total
)
VALUES
(
    'o0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'DRAFT',
    2545.50
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO order_items (
    id,
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES
(
    'i0000000-0000-0000-0000-000000000001',
    'o0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000001',
    1,
    2500.00
),
(
    'i0000000-0000-0000-0000-000000000002',
    'o0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000002',
    1,
    45.50
)
ON CONFLICT (id) DO NOTHING;
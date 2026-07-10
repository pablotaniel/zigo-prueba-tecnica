# Arquitectura

## Stack

### Frontend

- React
- TypeScript
- TanStack Query
- Bootstrap 5
- Font Awesome
- Docker Compose

### Backend

- Node.js
- Express
- TypeScript

### Base de datos

- PostgreSQL

---

## Backend

- CQRS (Commands y Queries separados)
- Handlers por operación
- API REST

## Frontend

- Componentes reutilizables
- Pantallas independientes
- Consumo de API mediante TanStack Query

---

# Microservicios

| Servicio | Puerto | Estado |
|----------|-------:|--------|
| orders-service | 4000 | Implementado |
| inventory-service | 3000 | Externo |

---

# Modelo

```text
                    +----------------+
                    |   Customers    |
                    +----------------+
                            |
                            |
                            ▼
                    +----------------+
                    |     Orders     |
                    +----------------+
                            |
                            |
                            ▼
                    +----------------+
                    |  Order Items   |
                    +----------------+
                            ▲
                            |
                            |
                    +----------------+
                    |    Products    |
                    +----------------+
                            ▲
                            |
                            |
                    +----------------+
                    |   Suppliers    |
                    +----------------+
```

---

# Flujo de ingreso de órdenes

1. Consultar órdenes existentes.
2. Crear una nueva orden.
3. Seleccionar un cliente.
4. Agregar productos al detalle.
5. Visualizar el proveedor del producto.
6. Calcular totales.
7. Guardar cabecera y detalle.
8. Consultar nuevamente la orden.
9. Creacion de proveedores


---

# Frontend

Actualmente existen las siguientes pantallas:

- Home
- Proveedores (CRUD)
- Productos (CRUD)
- Clientes (CRUD)
- Pedidos (Creacion)
- Lista de Pedidos



---ejemplos

# Backend

## Orders

```
GET    /orders
GET    /orders/:id
POST   /orders
```

## Suppliers

```
GET    /suppliers
GET    /suppliers/:id
POST   /suppliers
PUT    /suppliers/:id
DELETE /suppliers/:id
```

## Products

```
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

---

# Estado del proyecto

| Funcionalidad | Estado |
|---------------|:------:|
| CRUD Proveedores | ✅ |
| CRUD Productos | ✅ |
| CRUD Clientes | ✅ |
| Listado de Órdenes | ✅ |
| Crear Orden | ✅ |
| Detalle de Orden | ✅ |
| Mostrar proveedor del producto | ✅ |
| Persistencia cabecera + detalle | ✅ |
| Cálculo de totales | ✅ |

---

# Estructura

```text
backend
│
├── commands
│   ├── create-order
│   ├── create-product
│   ├── create-supplier
│   └── ...
│
├── queries
│   ├── order
│   ├── product
│   ├── supplier
│   └── ...
│
├── routes
│   ├── orders.ts
│   ├── products.ts
│   ├── suppliers.ts
│   └── customers.ts
│
├── shared
│   └── db.ts
│
├── server.ts
└── migrate.ts
```

```text
frontend
│
├── api
│   ├── orders.ts
│   ├── products.ts
│   ├── suppliers.ts
│   └── customers.ts
│
├── pages
│   ├── Home.tsx
│   ├── ProductsScreen.tsx
│   ├── SuppliersScreen.tsx
│   ├── CustomersScreen.tsx
│   └── OrderEntryScreen.tsx
│
├── components
│
├── types
│
└── App.tsx



# ejecutar servicio produccion

docker compose up -d 



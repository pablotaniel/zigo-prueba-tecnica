# Arquitectura

## Stack

- Frontend: React, TanStack Query
- Backend: Node.js, Express
- DB: PostgreSQL

## Patrones

- CQRS: commands (escritura) y queries (lectura) separados
- Feature-based en frontend: `features/orders/`

## Microservicios

- `orders-service`: este repo, puerto 4000
- `inventory-service`: stock, puerto 3000 (no incluido en el zip)
- `payment-service`: pagos, puerto 5000 (no incluido)

## Flujo objetivo — ingreso de órdenes

1. Consultar órdenes existentes o iniciar una nueva
2. Seleccionar el cliente
3. Agregar productos al detalle (producto, cantidad, subtotal/total)
4. Guardar: cabecera + ítems
5. Revisar el detalle guardado

## Implementación actual

| Paso | Estado |
|------|--------|
| Listar / crear órdenes | No implementado en UI |
| Seleccionar cliente | Hardcodeado en `App.tsx` |
| Agregar productos al detalle | Formulario básico; pide ID de producto a mano |
| Guardar orden + ítems | `POST /orders` iniciado; incompleto |
| Ver detalle con ítems | `GET /orders/:id` no arma el detalle para el frontend |
| Catálogo en UI | No hay selector; existe `GET /orders/products` |

## Endpoints

- `GET /orders/products` — catálogo
- `GET /orders/:id` — cabecera de orden
- `POST /orders` — crear orden

Pendiente: idempotencia al guardar, integración con inventory-service, validaciones de negocio.

# Notas del módulo (shared)

## Cálculos

IVA 16% sobre subtotal de ítems. Hubo incidentes en producción por precisión en totales; revisar el command de creación.

## Idempotencia

Validar `Idempotency-Key` al crear órdenes. Tabla `processed_commands` ya existe.

## Detalle de orden

Cabecera y `order_items` deben persistir en la misma operación.

## TanStack Query v5

`onSuccess` fue removido en hooks. No usar parches frágiles.

Si la documentación general contradice esto, revisar con logs al guardar una orden con varios productos.

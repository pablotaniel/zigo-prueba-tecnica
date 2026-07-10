# Known Issues

Última actualización: hace 6 meses.

## FE-050: TanStack Query v5

Migración de v4 a v5. Callbacks como `onSuccess` fueron removidos.
Workaround actual del equipo: usar `useEffect` para side-effects.

## BE-100: Performance en queries

JOINs de más de 3 tablas causan lentitud.
Solución planeada: cache con Redis.

## DB-010: Caracteres especiales

Reportes de problemas con acentos y ñ en algunos campos.
Workaround del equipo: usar solo ASCII en los nombres.

## BE-150: Cálculos financieros

Montos en `DECIMAL(10,2)` en base de datos.
Nota del equipo: JavaScript maneja bien los decimales nativamente, no hace falta librería externa.

Si algo falla, revisar logs de PostgreSQL primero.

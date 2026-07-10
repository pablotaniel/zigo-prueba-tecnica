
## DB-010: Caracteres especiales

Reportes de problemas con acentos y ñ en algunos campos.
Workaround del equipo: usar solo ASCII en los nombres.

## BE-150: Cálculos financieros

Montos en `DECIMAL(10,2)` en base de datos.
Nota del equipo: JavaScript maneja bien los decimales nativamente, no hace falta librería externa.

Si algo falla, revisar logs de PostgreSQL primero.

# AG 1: optimizar migraciones

se debe optimizar migraciones

# Reglas financieras

## Cálculo de totales

- Precios incluyen IVA (16%)
- Total: `subtotal * 1.16`
- Montos en base de datos con 2 decimales

## Precisión

- PostgreSQL: `DECIMAL(10,2)`
- JavaScript: punto flotante nativo es suficiente según el equipo anterior

## Redondeo

Sin redondeo explícito en aplicación; se confía en la base de datos.

Referencia interna: ticket FIN-001 en Jira (sin acceso desde este repo).

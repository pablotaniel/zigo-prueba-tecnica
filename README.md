# Rescate de Proyecto

Se ha realizado el proyecto de manera exitosa 
Realizado por el desarrollador Pedro Pablo Muñoz Taniel

## Contexto

Módulo de ingreso de órdenes de compra (cabecera + detalle de productos). Código heredado completado.

## Stack

- Frontend: React 18, TypeScript, TanStack Query, TanStack Form
- Backend: Node.js, TypeScript, Express, CQRS
- Base de datos: PostgreSQL
- Docker Compose > v3

## Estructura

```
rescate-proyecto/
├── INSTRUCCIONES_CANDIDATO.md
├── README.md
├── ARCHITECTURE.md
├── KNOWN_ISSUES.md
├── FINANCIAL_RULES.md
├── database/schema.sql
├── frontend/
└── backend/
```

## Documentación

- `ARCHITECTURE.md` — flujo y endpoints
- `KNOWN_ISSUES.md` — notas viejas del equipo
- `FINANCIAL_RULES.md` — IVA y totales

## Arranque local

```bash
createdb orders
psql -d orders -f database/schema.sql
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev


### ejecutar servicio produccion

docker compose up -d 


Backend: puerto 4000. Frontend: puerto 3000.

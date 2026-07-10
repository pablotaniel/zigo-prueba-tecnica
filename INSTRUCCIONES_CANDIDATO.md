# Instrucciones para el candidato

El repositorio es el proyecto tal como lo dejó el equipo anterior: funcionalidad incompleta, comportamientos raros en producción y documentación que puede no coincidir con el código.

## De qué se trata

Módulo de ingreso de órdenes de compra. Cada orden tiene cabecera y detalle de productos (qué se consume, cantidades, precios). Las órdenes van dirigidas a un cliente; cada producto del catálogo tiene un proveedor.

El backend y el frontend están a medias. No es un proyecto desde cero.

Stack: React + TypeScript (TanStack Query, TanStack Form), Node + Express (CQRS), PostgreSQL.

## Qué viene en el zip

- Pantalla parcial para ver una orden y capturar líneas de producto.
- Endpoints parciales: GET detalle, POST crear, listado básico de productos.
- Schema con órdenes, ítems, clientes y productos.
- Documentación del equipo (`ARCHITECTURE.md`, `KNOWN_ISSUES.md`, etc.).

## Qué debes entregar

### 1. Ingreso de órdenes con detalle

Completar el flujo para que un usuario pueda:

- Consultar órdenes existentes o iniciar una nueva.
- Armar el detalle de productos (qué se consume, cantidad, precio).
- Guardar la orden y ver después el detalle persistido con totales coherentes.

El código actual solo arranca este flujo: IDs fijos en `App.tsx`, formulario básico, backend que no cierra bien cabecera + ítems.

Incluye al menos una pantalla y un endpoint adicionales que identifiques como necesarios (listado de órdenes, alta completa, etc.). Revisa `ARCHITECTURE.md`.

### 2. Módulo de clientes y proveedores

No viene modelado en el schema. Debes diseñarlo e implementarlo.

Backend:

- Endpoints para clientes y proveedores (o integrados en los existentes).
- Al crear la orden, persistir el cliente correcto.
- Al consultar productos, incluir de qué proveedor es cada uno.

Frontend:

- Crear órdenes eligiendo cliente (selector, no UUID a mano).
- Al elegir un producto en el detalle, mostrar de qué proveedor es.
- Catálogo de productos usable en pantalla.

Criterio de aceptación: creo una orden para un cliente, agrego productos al detalle viendo el proveedor de cada uno, guardo y al reabrir la orden el detalle está completo.

### 3. Calidad y estructura

- Respetar CQRS en backend y migrar el frontend hacia feature-based (`features/orders/`) cuando el flujo funcione.
- Formulario de líneas con TanStack Form + Zod.
- README actualizado con cómo levantar el proyecto.
- Pull Request con diagnóstico, decisiones, cómo probar y pendientes.

## Enfoque

- No reescribas desde cero; extiende lo existente.
- Prioriza: que instale y corra, schema y migraciones, guardar orden con detalle, clientes/proveedores en UI, refactors.
- Desconfía de la documentación si contradice logs, DB o navegador.

## Cómo debe quedar

- Otro dev puede clonar tu repo y levantar DB, backend y frontend con tu README.
- Cabecera e ítems persisten juntos; totales con IVA según `FINANCIAL_RULES.md`.
- Clientes y proveedores modelados en DB, expuestos en API y visibles en UI.
- Al menos una pantalla y un endpoint que no existían en el zip.
- Script SQL de migración si tocaste el schema.

## Requisitos

Node 18+, npm, PostgreSQL 14+.

## Entrega

- Repositorio Git propio con historial claro.
- Rama de trabajo + Pull Request hacia `main`.

## Reglas

- Puedes usar IA y documentación; tú respondes por lo entregado.
- No reescribir el proyecto entero.
- Dudas de plazo o formato de entrega por correo. No damos soporte para depurar el enunciado.

## Reportes de producción

- Revisar consistencia de órdenes

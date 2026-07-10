FROM node:22-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY database ./database

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database

EXPOSE 4000

CMD ["npm", "start"]
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package*.json ./

RUN npm ci  --legacy-peer-deps

COPY frontend/tsconfig.json ./
COPY frontend/vite.config.ts ./
COPY frontend/index.html ./
COPY frontend/src ./src

RUN npm run build


FROM nginx:1.27-alpine AS production

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
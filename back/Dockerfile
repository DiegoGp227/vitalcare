# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Builder
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile || pnpm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json
COPY package.json pnpm-lock.yaml* ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copiar código compilado desde el builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 4000

# Usuario no root para seguridad
USER node

# Comando de producción
CMD ["pnpm", "start"]

# Stage 3: Development
FROM node:20-alpine AS development

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar todas las dependencias (incluyendo dev)
RUN pnpm install --frozen-lockfile || pnpm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando de desarrollo (con hot reload)
CMD ["pnpm", "dev"]

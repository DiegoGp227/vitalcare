# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Dependencies
FROM node:20-alpine AS deps

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile || pnpm install

# Stage 2: Builder
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar dependencias desde deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Compilar la aplicación
RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS production

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer puerto
EXPOSE 3000

# Usuario no root para seguridad
USER node

# Comando de producción
CMD ["node", "server.js"]

# Stage 4: Development
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
EXPOSE 3000

# Comando de desarrollo (con hot reload)
CMD ["pnpm", "dev"]

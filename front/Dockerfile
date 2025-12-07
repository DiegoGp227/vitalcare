# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Dependencies (Solo instala dependencias para cachearlas)
FROM node:20-alpine AS deps

# El ambiente base node:20-alpine ya tiene npm.
WORKDIR /app

# Copiar archivos de dependencias de npm
COPY package.json package-lock.json* ./

# Instalar dependencias
# Usamos 'npm ci' para una instalación limpia y basada en el lockfile
RUN npm ci

# ---
# Stage 2: Builder (Construye la aplicación)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias (solo node_modules) desde la etapa 'deps'
# Esto permite aprovechar el cache de Docker si las dependencias no cambian
COPY --from=deps /app/node_modules ./node_modules

# Copiar archivos de dependencias (package.json, lockfile) para que estén disponibles
COPY package.json package-lock.json* ./

# Copiar código fuente (incluyendo archivos de Next.js)
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Compilar la aplicación (asumiendo que 'build' es el script de Next.js)
RUN npm run build

# ---
# Stage 3: Production (Imagen final, minimalista)
FROM node:20-alpine AS production

# El ambiente base node:20-alpine ya tiene npm.
WORKDIR /app

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Copiar archivos esenciales para Next.js en modo standalone
# Next.js standalone mode genera todo lo necesario, incluyendo node_modules necesarios, en .next/standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer puerto (Next.js por defecto usa 3000)
EXPOSE 3000

# Usuario no root para seguridad
USER node

# Comando de producción (Ejecuta el servidor standalone)
# El modo standalone de Next.js crea un archivo server.js en el root del directorio de salida.
CMD ["node", "server.js"]

# ---
# Stage 4: Development (Para desarrollo local con hot reload)
FROM node:20-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo (asumiendo que el script 'dev' está en package.json)
CMD ["npm", "run", "dev"]
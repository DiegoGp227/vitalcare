# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Builder
FROM node:20-slim AS builder

# Instalar dependencias del sistema necesarias para onnxruntime-node
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

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
FROM node:20-slim AS production

# Instalar dependencias del sistema necesarias para onnxruntime-node en runtime
RUN apt-get update && apt-get install -y \
    libgomp1 \
    libstdc++6 \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json
COPY package.json pnpm-lock.yaml* ./

# Copiar node_modules desde el builder (incluye binarios nativos compilados)
COPY --from=builder /app/node_modules ./node_modules

# Copiar código compilado desde el builder
COPY --from=builder /app/dist ./dist

# Cambiar permisos para el usuario node
RUN chown -R node:node /app

# Exponer puerto
EXPOSE 4000

# Usuario no root para seguridad
USER node

# Comando de producción
CMD ["pnpm", "start"]

# Stage 3: Development
FROM node:20-slim AS development

# Instalar dependencias del sistema necesarias para onnxruntime-node
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

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

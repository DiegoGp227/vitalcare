
FROM node:20-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile || pnpm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo (con hot reload)
CMD ["pnpm", "dev"]

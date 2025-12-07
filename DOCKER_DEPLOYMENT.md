# 🐳 Docker Deployment - VitalCare

Guía rápida para desplegar VitalCare con Docker.

## 📋 Prerequisitos

- Docker y Docker Compose instalados
- Base de datos Neon PostgreSQL (ya configurada)

---

## ⚡ Despliegue Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

**Edita el archivo `.env`** y configura:

```env
# Puertos (puedes cambiarlos si están ocupados)
BACKEND_PORT=4000
FRONTEND_PORT=3000

# Base de datos (ya configurada con Neon)
DATABASE_URL=postgresql://neondb_owner:npg_XIywpA97uQBP@ep-winter-waterfall-aenrws1g-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# OpenAI API Key (reemplaza con tu key)
OPENAI_API_KEY=sk-tu-api-key-aqui

# URL del Backend
# Local: http://localhost:4000
# Servidor: http://IP-DE-TU-SERVIDOR:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

# CORS (dominios permitidos)
CORS_ORIGINS=http://localhost:3000,http://localhost:4000
```

### 2. Levantar la Aplicación

```bash
# Construir y levantar todos los servicios
docker-compose up --build -d
```

### 3. Verificar que esté funcionando

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs
docker-compose logs -f
```

**La aplicación estará disponible en:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## 🔧 Comandos Útiles

### Ver logs:
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Reiniciar servicios:
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo el backend
docker-compose restart backend
```

### Detener servicios:
```bash
# Detener
docker-compose stop

# Detener y eliminar contenedores
docker-compose down
```

### Reconstruir (después de cambios en código):
```bash
docker-compose up --build -d
```

---

## 🌐 Despliegue en Servidor (VPS)

### Opción 1: Mismos puertos (3000 y 4000)

1. Sube el proyecto al servidor
2. Configura el `.env`:
```env
BACKEND_PORT=4000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://TU-IP-O-DOMINIO:4000
CORS_ORIGINS=http://TU-IP-O-DOMINIO:3000,http://TU-IP-O-DOMINIO:4000
```
3. Ejecuta: `docker-compose up -d`

Accede a: `http://TU-IP:3000`

### Opción 2: Con Nginx (puerto 80)

1. Configura el `.env`:
```env
BACKEND_PORT=4000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://TU-DOMINIO/api
CORS_ORIGINS=http://TU-DOMINIO,https://TU-DOMINIO
```

2. Crea `/etc/nginx/sites-available/vitalcare`:
```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Activa el sitio:
```bash
ln -s /etc/nginx/sites-available/vitalcare /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

4. Levanta Docker:
```bash
docker-compose up -d
```

Accede a: `http://tudominio.com`

---

## 🔍 Cambiar Puertos

Si los puertos 3000 o 4000 están ocupados, puedes cambiarlos en el `.env`:

```env
BACKEND_PORT=5000
FRONTEND_PORT=8080
```

Los servicios estarán en:
- Frontend: http://localhost:8080
- Backend: http://localhost:5000

**IMPORTANTE:** También actualiza `NEXT_PUBLIC_API_URL`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Error: "Puerto ya en uso"
```bash
# Cambiar puertos en .env
BACKEND_PORT=5000
FRONTEND_PORT=8080
```

### Error: "Cannot connect to database"
Verifica que el `DATABASE_URL` sea correcto en el `.env`

### Reconstruir desde cero:
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

### Ver logs de errores:
```bash
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 frontend
```

---

## 📦 Estructura de Archivos

```
vitalcare/
├── docker-compose.yml     # Configuración de Docker
├── .env.example          # Plantilla de variables
├── .env                  # Tu configuración (crear este)
├── back/
│   └── Dockerfile        # Imagen del backend
└── front/
    └── Dockerfile        # Imagen del frontend
```

---

## ✅ Checklist de Despliegue

- [ ] Docker y Docker Compose instalados
- [ ] Archivo `.env` creado y configurado
- [ ] `OPENAI_API_KEY` configurado
- [ ] `NEXT_PUBLIC_API_URL` apunta al backend correcto
- [ ] Puertos disponibles (o cambiados en `.env`)
- [ ] `docker-compose up -d` ejecutado
- [ ] Servicios corriendo: `docker-compose ps`
- [ ] Aplicación accesible en el navegador

---

## 📞 Comandos de Emergencia

```bash
# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todo
docker-compose restart

# Detener todo
docker-compose down

# Eliminar todo y empezar de nuevo
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

Autenticación

POST /auth/login - Login
POST /auth/logout - Logout
GET /auth/me - Usuario actual


Kiosk - Pacientes

POST /kiosk/patients - Crear paciente
POST /kiosk/patients/:id/chat - Enviar mensaje chatbot
POST /kiosk/patients/:id/complete-chat - Finalizar conversación
GET /kiosk/patients/:id/status - Estado del paciente


Nurse - Enfermería

GET /nurse/queue - Cola de pacientes
GET /nurse/patients/:id - Detalle de paciente
POST /nurse/patients/:id/vitals - Ingresar vitales + análisis IA
POST /nurse/patients/:id/triage - Confirmar triage final


Doctor - Médicos

GET /doctor/queue - Cola de pacientes asignados
GET /doctor/patients/:id - Expediente completo
POST /doctor/patients/:id/consultation - Crear/actualizar consulta
POST /doctor/patients/:id/orders/labs - Solicitar laboratorios
POST /doctor/patients/:id/orders/imaging - Solicitar imagenología
GET /doctor/patients/:id/results - Obtener resultados
POST /doctor/patients/:id/discharge - Dar disposición final


Admin - Administración

GET /admin/metrics - Métricas en tiempo real
GET /admin/metrics/history - Métricas históricas
GET /admin/doctors - Estado de médicos
GET /admin/bottlenecks - Cuellos de botella activos
POST /admin/bottlenecks/:id/resolve - Resolver bottleneck
GET /admin/alerts - Alertas epidemiológicas (EPR)
POST /admin/alerts/:id/dismiss - Descartar alerta
GET /admin/simulation/cases - Casos de simulación
POST /admin/simulation/run - Ejecutar simulación


Utilities

GET /utils/diagnoses - Buscar diagnósticos CIE-10
GET /utils/medications - Buscar medicamentos
GET /utils/lab-tests - Tipos de laboratorios
GET /utils/imaging-studies - Tipos de estudios imagen
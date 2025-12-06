# Vista de Enfermera - Especificación Técnica

## Ubicación
`/front/app/triage/page.tsx`

## Propósito
Interfaz principal para que las enfermeras realicen el triage de pacientes usando el sistema de análisis de IA (PTE - Predictive Triage Engine).

## Componentes de la Interfaz

### 1. Header
- Título: "Vista de Enfermería - Triage"
- Info del usuario: Nombre y avatar de la enfermera
- Subtítulo: "Sistema Inteligente de Clasificación"

### 2. Panel Izquierdo - Lista de Pacientes en Espera (col-span-3)
**Contenido:**
- Lista de pacientes esperando triage
- Contador de pacientes totales
- Indicador visual de chat completado (punto verde)

**Información por paciente:**
- Nombre
- Edad y género
- Motivo de consulta principal
- Hora de llegada
- Estado del chat (completado/pendiente)

**Interacción:**
- Click para seleccionar paciente
- Highlight del paciente seleccionado (bg-primary-light)

### 3. Panel Central - Formulario de Evaluación (col-span-6)

#### 3.1 Información del Paciente (Card 1)
- Datos demográficos: nombre, ID, edad, sexo
- Hora de llegada
- Motivo de consulta
- Síntomas reportados del chatbot (tags con bg-primary-light)

#### 3.2 Signos Vitales (Card 2)
Campos de input:
- Frecuencia cardíaca (lpm)
- Presión arterial (mmHg) - formato "120/80"
- Temperatura (°C)
- Saturación O2 (%)
- Frecuencia respiratoria (rpm)

**Validación:** Inputs tipo number con placeholders

#### 3.3 Examen Físico (Card 3)
Campos:
- Apariencia general (select): estable, ansioso, doloroso, crítico
- Nivel de dolor (slider 0-10)
- Estado de consciencia (select): alerta, somnoliento, confuso, inconsciente
- Hallazgos adicionales (textarea)

#### 3.4 Botón "Analizar con IA"
- Estado normal: "Analizar con IA"
- Estado loading: "Analizando con IA..."
- Color: bg-primary
- Full width
- Simula llamada a API (1.5s timeout)

### 4. Panel Derecho - Análisis de IA (col-span-3)

#### Estado Inicial (sin análisis)
- Icono de bombilla
- Mensaje: "Completa el formulario y presiona 'Analizar con IA' para ver sugerencias"

#### Después del Análisis (Cards apiladas)

**Card 1: Triage Sugerido**
- Badge circular con número de triage (1-5)
- Color según nivel (danger, warning, primary, success, gray-soft)
- Porcentaje de confianza

**Card 2: Diagnósticos Probables**
- Top 3 diagnósticos
- Barra de progreso con probabilidad (%)
- Ordenados de mayor a menor probabilidad

**Card 3: Estudios Recomendados**
- **Laboratorio:**
  - Lista de pruebas
  - Badge de prioridad (URGENTE/ALTA/MEDIA)
  - Colores: URGENTE (danger), ALTA (warning), MEDIA (gray)

- **Imágenes:**
  - Lista de estudios
  - Badge de prioridad
  - Mismos colores que lab

**Card 4: Predicciones**
- Tiempo estimado de estancia (formato: "3.2h ± 1.1h")
- Probabilidad de admisión (%)
- Riesgo de deterioro en 2h (%)
  - Color condicional: >30% = danger, ≤30% = success

**Card 5: Decisión Final**
- Select con niveles de triage 1-5
- Botón "Confirmar y Asignar" (bg-success)
- Deshabilitado si no se ha seleccionado nivel

## Flujo de Trabajo

```
1. Usuario selecciona paciente de la lista
   ↓
2. Se carga información del paciente (del chatbot)
   ↓
3. Enfermera completa:
   - Signos vitales
   - Examen físico
   ↓
4. Click "Analizar con IA"
   ↓
5. Sistema muestra análisis en panel derecho:
   - Triage sugerido
   - Diagnósticos probables
   - Estudios recomendados
   - Predicciones
   ↓
6. Enfermera DECIDE triage final (puede diferir de la IA)
   ↓
7. Click "Confirmar y Asignar"
   ↓
8. Sistema asigna paciente a médico (DRAS automático)
```

## Tipos TypeScript

```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  symptoms: string[];
  arrivalTime: string;
  chatCompleted: boolean;
}

interface VitalSigns {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
}

interface PhysicalExam {
  generalAppearance: string;
  painLevel: string;
  consciousness: string;
  additionalFindings: string;
}

interface AIAnalysis {
  suggestedTriage: number;
  confidence: number;
  diagnoses: Array<{ name: string; probability: number }>;
  recommendedStudies: {
    labs: Array<{ test: string; priority: string }>;
    imaging: Array<{ study: string; priority: string }>;
  };
  predictions: {
    estimatedStay: string;
    admissionProbability: number;
    deteriorationRisk: number;
  };
}
```

## Estados de la Interfaz

1. **Sin paciente seleccionado**
   - Panel central: Mensaje "Selecciona un paciente para comenzar"
   - Panel derecho: Vacío

2. **Paciente seleccionado, sin análisis**
   - Panel central: Formularios visibles
   - Panel derecho: Mensaje de ayuda

3. **Análisis en proceso**
   - Botón "Analizar": Estado loading
   - Deshabilitar botón

4. **Análisis completado**
   - Panel derecho: Cards con resultados
   - Habilitar selector de triage final

## Colores de Triage

```typescript
const triageColors = {
  1: "bg-danger",    // Rojo - Reanimación
  2: "bg-warning",   // Naranja - Emergencia
  3: "bg-primary",   // Cyan - Urgente
  4: "bg-success",   // Verde - Menos urgente
  5: "bg-gray-soft", // Gris - No urgente
};
```

## Integraciones Futuras

### Backend API Endpoints (pendientes)
- `POST /api/triage/analyze` - Enviar datos para análisis de IA
- `POST /api/triage/confirm` - Confirmar triage y asignar médico
- `GET /api/patients/waiting` - Obtener lista de pacientes en espera
- `GET /api/patient/:id/chat-history` - Historial del chat del paciente

### Datos Mock vs Datos Reales
**Actualmente (MVP):**
- 3 pacientes hardcodeados
- Análisis de IA simulado (timeout 1.5s)
- Alert simple al confirmar

**Versión producción:**
- WebSocket para lista de pacientes en tiempo real
- Llamada real a Ollama para análisis
- Integración con DRAS para asignación automática
- Notificación al médico asignado

## Consideraciones de UX

1. **Validación de formularios:**
   - No implementada en MVP
   - TODO: Validar rangos de signos vitales
   - TODO: Alertar si valores son críticos

2. **Persistencia:**
   - No hay auto-save
   - TODO: Guardar borradores cada 30s

3. **Accesibilidad:**
   - Colores con suficiente contraste
   - Labels en todos los inputs
   - TODO: Navegación con teclado

4. **Responsive:**
   - Optimizado para desktop (grid de 12 columnas)
   - TODO: Versión tablet/mobile

## Siguiente Fase: Funcionalidad Completa

### Análisis de IA Real (PTE)
**Input al backend:**
```json
{
  "patientId": "P001",
  "symptoms": ["dolor en pecho", "sudoración", "náuseas"],
  "vitalSigns": {
    "heartRate": 92,
    "bloodPressure": "150/95",
    "temperature": 36.8,
    "oxygenSaturation": 97,
    "respiratoryRate": 18
  },
  "physicalExam": {
    "generalAppearance": "ansioso",
    "painLevel": 7,
    "consciousness": "alerta",
    "additionalFindings": "diaforesis, palidez cutánea"
  }
}
```

**Output del backend (Ollama + ML models):**
```json
{
  "suggestedTriage": 2,
  "confidence": 87,
  "diagnoses": [
    { "name": "Síndrome coronario agudo", "probability": 45 },
    { "name": "Angina inestable", "probability": 32 },
    { "name": "Reflujo gastroesofágico", "probability": 23 }
  ],
  "recommendedStudies": {
    "labs": [
      { "test": "Troponina", "priority": "URGENTE", "reason": "Descartar IAM" },
      { "test": "BNP", "priority": "ALTA" },
      { "test": "Hemograma completo", "priority": "MEDIA" }
    ],
    "imaging": [
      { "study": "ECG", "priority": "URGENTE", "reason": "Cambios isquémicos" },
      { "study": "Rx Tórax", "priority": "ALTA" }
    ]
  },
  "predictions": {
    "estimatedStay": "3.2h ± 1.1h",
    "admissionProbability": 45,
    "deteriorationRisk": 28
  },
  "reasoning": "Dolor torácico con signos vitales de estrés cardiovascular..."
}
```

### Asignación Automática (DRAS)
Al confirmar triage, el sistema:
1. Ejecuta algoritmo DRAS
2. Encuentra médico óptimo
3. Notifica al médico
4. Actualiza dashboard de admin
5. Mueve paciente a cola del médico

## Métricas a Trackear

Una vez en producción, registrar:
- Tiempo de triage por paciente
- Concordancia enfermera vs IA (%)
- Tasa de re-triage
- Tiempo desde llegada hasta asignación de médico
- Satisfacción de enfermeras con sugerencias de IA

---

**Estado actual:** Maqueta funcional con datos mock
**Próximo paso:** Integración con backend y Ollama

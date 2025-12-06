"use client";

import { useState } from "react";

// Tipos
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

export default function TriagePage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
  });
  const [physicalExam, setPhysicalExam] = useState<PhysicalExam>({
    generalAppearance: "",
    painLevel: "",
    consciousness: "alerta",
    additionalFindings: "",
  });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [finalTriage, setFinalTriage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Pacientes de ejemplo esperando triage
  const waitingPatients: Patient[] = [
    {
      id: "P001",
      name: "María González",
      age: 45,
      gender: "F",
      chiefComplaint: "Dolor torácico",
      symptoms: ["dolor en pecho", "sudoración", "náuseas"],
      arrivalTime: "14:23",
      chatCompleted: true,
    },
    {
      id: "P002",
      name: "Juan Pérez",
      age: 28,
      gender: "M",
      chiefComplaint: "Esguince de tobillo",
      symptoms: ["dolor en tobillo", "inflamación", "dificultad para caminar"],
      arrivalTime: "14:35",
      chatCompleted: true,
    },
    {
      id: "P003",
      name: "Ana Martínez",
      age: 62,
      gender: "F",
      chiefComplaint: "Dificultad respiratoria",
      symptoms: ["disnea", "tos", "fiebre"],
      arrivalTime: "14:48",
      chatCompleted: true,
    },
  ];

  const handleAnalyzeWithAI = () => {
    setIsAnalyzing(true);

    // Simular llamada a IA
    setTimeout(() => {
      setAiAnalysis({
        suggestedTriage: 2,
        confidence: 87,
        diagnoses: [
          { name: "Síndrome coronario agudo", probability: 45 },
          { name: "Angina inestable", probability: 32 },
          { name: "Reflujo gastroesofágico", probability: 23 },
        ],
        recommendedStudies: {
          labs: [
            { test: "Troponina", priority: "URGENTE" },
            { test: "BNP", priority: "ALTA" },
            { test: "Hemograma completo", priority: "MEDIA" },
          ],
          imaging: [
            { test: "ECG", priority: "URGENTE" },
            { test: "Rx Tórax", priority: "ALTA" },
          ],
        },
        predictions: {
          estimatedStay: "3.2h ± 1.1h",
          admissionProbability: 45,
          deteriorationRisk: 28,
        },
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleConfirmTriage = () => {
    if (!selectedPatient || finalTriage === 0) return;

    alert(`Paciente ${selectedPatient.name} clasificado como Triage ${finalTriage}`);
    // Aquí iría la lógica para enviar al backend
  };

  const getTriageColor = (level: number) => {
    const colors = {
      1: "bg-danger",
      2: "bg-warning",
      3: "bg-primary",
      4: "bg-success",
      5: "bg-gray-soft",
    };
    return colors[level as keyof typeof colors] || "bg-gray-border";
  };

  const getTriageLabel = (level: number) => {
    const labels = {
      1: "Nivel 1 - Reanimación",
      2: "Nivel 2 - Emergencia",
      3: "Nivel 3 - Urgente",
      4: "Nivel 4 - Menos urgente",
      5: "Nivel 5 - No urgente",
    };
    return labels[level as keyof typeof labels] || "Seleccionar nivel";
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      {/* Header */}
      <header className="bg-white border-b border-gray-border">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-hard">Vista de Enfermería - Triage</h1>
              <p className="text-sm text-gray-soft mt-1">Sistema Inteligente de Clasificación</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-soft">Enfermera</p>
                <p className="text-sm font-medium text-gray-hard">Carmen Silva</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                CS
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Lista de pacientes */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-border">
              <div className="p-4 border-b border-gray-border">
                <h2 className="font-semibold text-gray-hard">Esperando Triage</h2>
                <p className="text-xs text-gray-soft mt-1">{waitingPatients.length} pacientes</p>
              </div>
              <div className="divide-y divide-gray-border">
                {waitingPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full p-4 text-left hover:bg-gray-bg transition-colors ${
                      selectedPatient?.id === patient.id ? "bg-primary-light" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-hard text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-soft mt-1">
                          {patient.age} años - {patient.gender}
                        </p>
                        <p className="text-xs text-gray-hard mt-2 font-medium">
                          {patient.chiefComplaint}
                        </p>
                        <p className="text-xs text-gray-soft mt-1">Llegada: {patient.arrivalTime}</p>
                      </div>
                      {patient.chatCompleted && (
                        <div className="ml-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel central - Formulario */}
          <div className="col-span-6">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Información del paciente */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
                  <h2 className="font-semibold text-gray-hard mb-4">Información del Paciente</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-soft">Nombre</p>
                      <p className="text-sm font-medium text-gray-hard">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">ID</p>
                      <p className="text-sm font-medium text-gray-hard">{selectedPatient.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Edad / Sexo</p>
                      <p className="text-sm font-medium text-gray-hard">
                        {selectedPatient.age} años - {selectedPatient.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Hora de llegada</p>
                      <p className="text-sm font-medium text-gray-hard">{selectedPatient.arrivalTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-soft">Motivo de consulta</p>
                    <p className="text-sm font-medium text-gray-hard">{selectedPatient.chiefComplaint}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-soft mb-2">Síntomas reportados (del chat)</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Signos vitales */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
                  <h2 className="font-semibold text-gray-hard mb-4">Signos Vitales</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Frecuencia cardíaca (lpm)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.heartRate}
                        onChange={(e) =>
                          setVitalSigns({ ...vitalSigns, heartRate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ej: 78"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Presión arterial (mmHg)
                      </label>
                      <input
                        type="text"
                        value={vitalSigns.bloodPressure}
                        onChange={(e) =>
                          setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ej: 120/80"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">Temperatura (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vitalSigns.temperature}
                        onChange={(e) =>
                          setVitalSigns({ ...vitalSigns, temperature: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ej: 36.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Saturación O2 (%)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.oxygenSaturation}
                        onChange={(e) =>
                          setVitalSigns({ ...vitalSigns, oxygenSaturation: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ej: 98"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-soft mb-1">
                        Frecuencia respiratoria (rpm)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.respiratoryRate}
                        onChange={(e) =>
                          setVitalSigns({ ...vitalSigns, respiratoryRate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ej: 16"
                      />
                    </div>
                  </div>
                </div>

                {/* Examen físico */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
                  <h2 className="font-semibold text-gray-hard mb-4">Examen Físico</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Apariencia general
                      </label>
                      <select
                        value={physicalExam.generalAppearance}
                        onChange={(e) =>
                          setPhysicalExam({ ...physicalExam, generalAppearance: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Seleccionar</option>
                        <option value="estable">Estable</option>
                        <option value="ansioso">Ansioso</option>
                        <option value="doloroso">En dolor</option>
                        <option value="critico">Crítico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Nivel de dolor (1-10)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={physicalExam.painLevel}
                        onChange={(e) =>
                          setPhysicalExam({ ...physicalExam, painLevel: e.target.value })
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-soft mt-1">
                        <span>0 (Sin dolor)</span>
                        <span className="font-medium text-primary text-sm">
                          {physicalExam.painLevel || "0"}
                        </span>
                        <span>10 (Máximo)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Estado de consciencia
                      </label>
                      <select
                        value={physicalExam.consciousness}
                        onChange={(e) =>
                          setPhysicalExam({ ...physicalExam, consciousness: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="alerta">Alerta</option>
                        <option value="somnoliento">Somnoliento</option>
                        <option value="confuso">Confuso</option>
                        <option value="inconsciente">Inconsciente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-soft mb-1">
                        Hallazgos adicionales
                      </label>
                      <textarea
                        value={physicalExam.additionalFindings}
                        onChange={(e) =>
                          setPhysicalExam({ ...physicalExam, additionalFindings: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="Ej: palidez cutánea, diaforesis..."
                      />
                    </div>
                  </div>
                </div>

                {/* Botón analizar */}
                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "Analizando con IA..." : "Analizar con IA"}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-border p-12 text-center">
                <p className="text-gray-soft">Selecciona un paciente para comenzar</p>
              </div>
            )}
          </div>

          {/* Panel derecho - Análisis de IA */}
          <div className="col-span-3">
            {aiAnalysis ? (
              <div className="space-y-4">
                {/* Triage sugerido */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
                  <h3 className="text-sm font-semibold text-gray-hard mb-3">Triage Sugerido</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-full ${getTriageColor(
                        aiAnalysis.suggestedTriage
                      )} flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {aiAnalysis.suggestedTriage}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-soft">Nivel {aiAnalysis.suggestedTriage}</p>
                      <p className="text-sm font-medium text-gray-hard">
                        Confianza: {aiAnalysis.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diagnósticos probables */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
                  <h3 className="text-sm font-semibold text-gray-hard mb-3">
                    Diagnósticos Probables
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.diagnoses.map((diagnosis, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-hard">{diagnosis.name}</span>
                          <span className="text-gray-soft">{diagnosis.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-bg rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${diagnosis.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estudios recomendados */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
                  <h3 className="text-sm font-semibold text-gray-hard mb-3">
                    Estudios Recomendados
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-soft mb-2">Laboratorio</p>
                      <div className="space-y-1">
                        {aiAnalysis.recommendedStudies.labs.map((lab, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-gray-hard">{lab.test}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                lab.priority === "URGENTE"
                                  ? "bg-danger text-white"
                                  : lab.priority === "ALTA"
                                  ? "bg-warning text-white"
                                  : "bg-gray-bg text-gray-soft"
                              }`}
                            >
                              {lab.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-soft mb-2">Imágenes</p>
                      <div className="space-y-1">
                        {aiAnalysis.recommendedStudies.imaging.map((imaging, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-gray-hard">{imaging.study}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                imaging.priority === "URGENTE"
                                  ? "bg-danger text-white"
                                  : imaging.priority === "ALTA"
                                  ? "bg-warning text-white"
                                  : "bg-gray-bg text-gray-soft"
                              }`}
                            >
                              {imaging.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predicciones */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
                  <h3 className="text-sm font-semibold text-gray-hard mb-3">Predicciones</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-soft">Tiempo estimado de estancia</p>
                      <p className="text-sm font-medium text-gray-hard">
                        {aiAnalysis.predictions.estimatedStay}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Probabilidad de admisión</p>
                      <p className="text-sm font-medium text-gray-hard">
                        {aiAnalysis.predictions.admissionProbability}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Riesgo de deterioro en 2h</p>
                      <p
                        className={`text-sm font-medium ${
                          aiAnalysis.predictions.deteriorationRisk > 30
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {aiAnalysis.predictions.deteriorationRisk}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selector de triage final */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
                  <h3 className="text-sm font-semibold text-gray-hard mb-3">
                    Decisión Final de Triage
                  </h3>
                  <select
                    value={finalTriage}
                    onChange={(e) => setFinalTriage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                  >
                    <option value={0}>Seleccionar nivel</option>
                    <option value={1}>Nivel 1 - Reanimación</option>
                    <option value={2}>Nivel 2 - Emergencia</option>
                    <option value={3}>Nivel 3 - Urgente</option>
                    <option value={4}>Nivel 4 - Menos urgente</option>
                    <option value={5}>Nivel 5 - No urgente</option>
                  </select>
                  <button
                    onClick={handleConfirmTriage}
                    disabled={finalTriage === 0}
                    className="w-full bg-success hover:bg-success/90 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Confirmar y Asignar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-border p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-border mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <p className="text-sm text-gray-soft">
                  Completa el formulario y presiona
                  <br />
                  &quot;Analizar con IA&quot; para ver sugerencias
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

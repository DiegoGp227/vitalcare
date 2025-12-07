"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/molecules/Header";

interface AIAnalysisResults {
  suggestedTriage: number;
  confidence: number;
  diagnoses: Array<{ name: string; probability: number }>;
  recommendedStudies: {
    labs: Array<{ test: string; priority: string }>;
    imaging: Array<{ test: string; priority: string }>;
  };
  predictions: {
    estimatedStay: string;
    admissionProbability: number;
    deteriorationRisk: number;
  };
}

const triagelevels = [
  {
    level: 1,
    name: "Resucitación",
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
    description: "Riesgo vital inmediato",
  },
  {
    level: 2,
    name: "Emergencia",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
    description: "Situación de emergencia",
  },
  {
    level: 3,
    name: "Urgencia",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-500",
    description: "Urgente pero estable",
  },
  {
    level: 4,
    name: "Menos Urgente",
    color: "bg-green-500",
    textColor: "text-green-600",
    borderColor: "border-green-500",
    description: "Puede esperar",
  },
  {
    level: 5,
    name: "No Urgente",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
    description: "Consulta programable",
  },
];

export default function ResultsPage() {
  const router = useRouter();

  // Simulación de resultados de IA (en producción vendrían del backend o estado global)
  const [aiResults] = useState<AIAnalysisResults>({
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

  const [selectedTriage, setSelectedTriage] = useState<number>(
    aiResults.suggestedTriage
  );

  const handleConfirmTriage = () => {
    if (selectedTriage === 0) {
      alert("Por favor selecciona un nivel de triage");
      return;
    }

    // Aquí se guardaría el triage en el backend
    alert(`Triage nivel ${selectedTriage} confirmado exitosamente`);
    router.push("/triage");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENTE":
        return "text-red-600 bg-red-50 border-red-200";
      case "ALTA":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "MEDIA":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/triage")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Resultados del Análisis de IA
          </h1>
          <p className="text-gray-600 mt-2">
            Revisa los resultados y confirma el nivel de triage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Suggestion Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
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
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Sugerencia de IA
                  </h2>
                  <p className="text-sm text-gray-600">
                    Nivel de confianza: {aiResults.confidence}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div
                  className={`w-16 h-16 ${
                    triagelevels[aiResults.suggestedTriage - 1].color
                  } rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {aiResults.suggestedTriage}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">
                    {triagelevels[aiResults.suggestedTriage - 1].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {triagelevels[aiResults.suggestedTriage - 1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnoses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Diagnósticos Posibles
              </h3>
              <div className="space-y-3">
                {aiResults.diagnoses.map((diagnosis, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">
                        {diagnosis.name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {diagnosis.probability}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${diagnosis.probability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Studies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Estudios Recomendados
              </h3>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Laboratorio
                </h4>
                <div className="space-y-2">
                  {aiResults.recommendedStudies.labs.map((lab, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg border ${getPriorityColor(
                        lab.priority
                      )}`}
                    >
                      <span className="font-medium">{lab.test}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded">
                        {lab.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Imagenología</h4>
                <div className="space-y-2">
                  {aiResults.recommendedStudies.imaging.map((study, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg border ${getPriorityColor(
                        study.priority
                      )}`}
                    >
                      <span className="font-medium">{study.test}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded">
                        {study.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Predictions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Predicciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estancia Estimada</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {aiResults.predictions.estimatedStay}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Prob. de Admisión</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {aiResults.predictions.admissionProbability}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Riesgo de Deterioro</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {aiResults.predictions.deteriorationRisk}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Triage Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Seleccionar Nivel de Triage
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Confirma o ajusta el nivel de triage según tu criterio clínico
              </p>

              <div className="space-y-3 mb-6">
                {triagelevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setSelectedTriage(level.level)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedTriage === level.level
                        ? `${level.borderColor} ${level.color} bg-opacity-10`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white font-bold`}
                      >
                        {level.level}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">
                          {level.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {level.description}
                        </p>
                      </div>
                      {selectedTriage === level.level && (
                        <svg
                          className={`w-6 h-6 ${level.textColor} ml-auto`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirmTriage}
                disabled={selectedTriage === 0}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Triage
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, el paciente será asignado a la prioridad seleccionada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

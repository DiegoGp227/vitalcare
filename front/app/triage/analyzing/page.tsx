"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Definir los pasos fuera del componente para evitar re-creación
const VALIDATION_STEPS = [
  {
    id: 1,
    label: "Validando signos vitales del paciente",
    duration: 1500,
  },
  {
    id: 2,
    label: "Analizando patrones de frecuencia cardíaca",
    duration: 2000,
  },
  {
    id: 3,
    label: "Evaluando presión arterial y saturación",
    duration: 1800,
  },
  {
    id: 4,
    label: "Procesando síntomas y motivo de consulta",
    duration: 2200,
  },
  {
    id: 5,
    label: "Consultando base de datos médica",
    duration: 1600,
  },
  {
    id: 6,
    label: "Calculando probabilidades diagnósticas",
    duration: 2000,
  },
  {
    id: 7,
    label: "Determinando nivel de urgencia",
    duration: 1500,
  },
  {
    id: 8,
    label: "Generando recomendaciones de estudios",
    duration: 1400,
  },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStepIndex >= VALIDATION_STEPS.length) {
      // Todos los pasos completados, redirigir a resultados
      const patientId = searchParams.get("patientId");
      setTimeout(() => {
        router.push(`/triage/results${patientId ? `?patientId=${patientId}` : ""}`);
      }, 800);
      return;
    }

    // Después de la duración del paso, marcarlo como completado y pasar al siguiente
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
      setCurrentStepIndex((prev) => prev + 1);
    }, VALIDATION_STEPS[currentStepIndex].duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, router, searchParams]);

  const getStepStatus = (index: number): "pending" | "processing" | "completed" => {
    if (completedSteps.includes(index)) return "completed";
    if (index === currentStepIndex) return "processing";
    return "pending";
  };

  const getProgressPercentage = () => {
    return Math.round(((currentStepIndex) / VALIDATION_STEPS.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-primary animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Analizando con IA
            </h1>
            <p className="text-gray-600">
              Nuestro sistema está procesando la información del paciente
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso del análisis
              </span>
              <span className="text-sm font-bold text-primary">
                {getProgressPercentage()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {VALIDATION_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                    status === "completed"
                      ? "bg-green-50 border border-green-200"
                      : status === "processing"
                      ? "bg-blue-50 border border-blue-200 scale-105"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {status === "completed" && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                    {status === "processing" && (
                      <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {status === "pending" && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        status === "completed"
                          ? "text-green-700"
                          : status === "processing"
                          ? "text-blue-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Análisis seguro y encriptado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

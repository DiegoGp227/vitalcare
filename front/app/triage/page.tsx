"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/molecules/Header";
import { UserQueue } from "../components/organisms/UserQueue";
import { PatientInfor } from "../components/molecules/PatientInfor";
import VitalSigns from "../components/molecules/VitalSigns";
import { AIAnalysisPanel } from "../components/organisms/AIAnalysisPanel";
import {
  Patient,
  VitalSigns as VitalSignsType,
  AIAnalysis,
} from "../types/triage";
import { waitingPatients } from "@/src/test/testdata";

export default function TriagePage() {
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    waitingPatients[0]
  );
  const [vitalSigns, setVitalSigns] = useState<VitalSignsType>({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [finalTriage, setFinalTriage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeWithAI = () => {
    if (!selectedPatient) return;

    // Validar que se hayan ingresado los signos vitales
    const hasVitalSigns = Object.values(vitalSigns).some(value => value !== "");

    if (!hasVitalSigns) {
      alert("Por favor ingresa al menos un signo vital antes de analizar");
      return;
    }

    // Redirigir a la pantalla de carga/análisis
    router.push(`/triage/analyzing?patientId=${selectedPatient.id}`);
  };

  const handleConfirmTriage = () => {
    if (!selectedPatient || finalTriage === 0) return;

    alert(
      `Paciente ${selectedPatient.fullName} clasificado como Triage ${finalTriage}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex justify-center gap-10">
          <UserQueue
            patients={waitingPatients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />

          <div className="flex flex-col gap-1">
            {selectedPatient ? (
              <div className="space-y-6">
                <PatientInfor patient={selectedPatient} />
                <VitalSigns vitalSigns={vitalSigns} onChange={setVitalSigns} />

                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing
                    ? "🔄 Analizando con IA..."
                    : "🤖 Analizar con IA"}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-border p-12 text-center">
                <p className="text-gray-soft">
                  Selecciona un paciente para comenzar
                </p>
              </div>
            )}
          </div>

          <AIAnalysisPanel
            analysis={aiAnalysis}
            finalTriage={finalTriage}
            onTriageChange={setFinalTriage}
            onConfirm={handleConfirmTriage}
          />
        </div>
      </div>
    </div>
  );
}

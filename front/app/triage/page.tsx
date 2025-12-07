"use client";

import { useState } from "react";
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
    setIsAnalyzing(true);

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
            patients={waitingPatients} // <-- aquí pasas los pacientes de prueba
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

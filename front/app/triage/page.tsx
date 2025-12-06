"use client";

import { useState } from "react";
import Header from "../components/molecules/Header";
import { UserQueue } from "../components/organisms/UserQueue";
import { PatientInfor } from "../components/molecules/PatientInfor";
import VitalSigns from "../components/molecules/VitalSigns";
import { Symptoms } from "../components/molecules/Symptoms";
import { PhysicalExam } from "../components/molecules/PhysicalExam";
import { AIAnalysisPanel } from "../components/organisms/AIAnalysisPanel";
import {
  Patient,
  VitalSigns as VitalSignsType,
  Symptoms as SymptomsType,
  PhysicalExam as PhysicalExamType,
  AIAnalysis,
} from "../types/triage";

export default function TriagePage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSignsType>({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
  });
  const [symptoms, setSymptoms] = useState<SymptomsType>({
    painLevel: "0",
    painZone: "",
    onsetDateTime: "",
  });
  const [physicalExam, setPhysicalExam] = useState<PhysicalExamType>({
    generalAppearance: "",
    painLevel: "0",
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
      cedula: "1.045.678.901",
      name: "María",
      lastName: "González Ruiz",
      fullName: "María González Ruiz",
      age: 45,
      dateOfBirth: "15/03/1979",
      gender: "Femenino",
      address: "Calle 45 # 23-10, Apartamento 302, Bogotá",
      phone: "+57 301 456 7890",
      email: "maria.gonzalez@email.com",
      chiefComplaint: "Dolor torácico",
      arrivalTime: "14:23",
      chatCompleted: true,
    },
    {
      id: "P002",
      cedula: "1.098.234.567",
      name: "Juan",
      lastName: "Pérez Morales",
      fullName: "Juan Pérez Morales",
      age: 28,
      dateOfBirth: "22/08/1996",
      gender: "Masculino",
      address: "Carrera 15 # 88-45, Bogotá",
      phone: "+57 310 987 6543",
      email: "juan.perez@email.com",
      chiefComplaint: "Esguince de tobillo",
      arrivalTime: "14:35",
      chatCompleted: true,
    },
    {
      id: "P003",
      cedula: "52.876.543",
      name: "Ana",
      lastName: "Martínez López",
      fullName: "Ana Martínez López",
      age: 62,
      dateOfBirth: "10/11/1962",
      gender: "Femenino",
      address: "Avenida 68 # 45-23, Bogotá",
      phone: "+57 320 456 1234",
      email: "ana.martinez@email.com",
      chiefComplaint: "Dificultad respiratoria",
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

    alert(
      `Paciente ${selectedPatient.fullName} clasificado como Triage ${finalTriage}`
    );
    // Aquí iría la lógica para enviar al backend
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      {/* Header */}
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Lista de pacientes */}
          <UserQueue
            patients={waitingPatients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />

          {/* Panel central - Formulario */}
          <div className="col-span-6">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Información del paciente */}
                <PatientInfor patient={selectedPatient} />

                {/* Síntomas */}
                <Symptoms symptoms={symptoms} onChange={setSymptoms} />

                {/* Signos vitales */}
                <VitalSigns
                  vitalSigns={vitalSigns}
                  onChange={setVitalSigns}
                />

                {/* Examen físico */}
                <PhysicalExam
                  physicalExam={physicalExam}
                  onChange={setPhysicalExam}
                />

                {/* Botón analizar */}
                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "🔄 Analizando con IA..." : "🤖 Analizar con IA"}
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

          {/* Panel derecho - Análisis de IA */}
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

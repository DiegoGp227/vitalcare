"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/components/molecules/Header";
import { PatientConsultation } from "@/app/components/organisms/PatientConsultation";
import { AssignedPatient } from "@/src/types/doctor";

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  // Estado del paciente (esto deberia venir de una API)
  const [patient, setPatient] = useState<AssignedPatient | null>(null);

  useEffect(() => {
    // Aqui deberia hacer un fetch a la API para obtener los datos del paciente
    // Por ahora uso datos de ejemplo
    const mockPatient: AssignedPatient = {
      id: patientId,
      fullName: "Maria Gonzalez",
      cedula: "9876543210",
      age: 45,
      gender: "Femenino",
      triageLevel: 2,
      chiefComplaint: "Dolor toracico agudo",
      assignedTime: "10:30 AM",
      status: "in_consultation",
    };

    setPatient(mockPatient);
  }, [patientId]);

  const handleEndConsultation = () => {
    // Aqui deberia actualizar el estado del paciente en la API
    console.log("Finalizando consulta para paciente:", patientId);
    router.push("/doctor");
  };

  const handleSaveNotes = (notes: string) => {
    // Aqui deberia guardar las notas en la API
    console.log("Guardando notas:", notes);
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-soft">Cargando informacion del paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <PatientConsultation
          patient={patient}
          onEndConsultation={handleEndConsultation}
          onSaveNotes={handleSaveNotes}
        />
      </div>
    </div>
  );
}

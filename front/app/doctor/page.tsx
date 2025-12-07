"use client";

import { useState } from "react";
import Header from "../components/molecules/Header";
import { DoctorProfile } from "../components/organisms/DoctorProfile";
import { PatientsList } from "../components/organisms/PatientsList";
import { DoctorInfo, AssignedPatient, DoctorStats } from "@/src/types/doctor";

export default function DoctorPage() {
  // Estado del doctor (esto deberia venir de una API o contexto de autenticacion)
  const [doctorInfo] = useState<DoctorInfo>({
    id: "DOC001",
    cedula: "1234567890",
    name: "Juan",
    lastName: "Perez Garcia",
    fullName: "Dr. Juan Perez Garcia",
    email: "juan.perez@vitalcare.com",
    phone: "+57 300 123 4567",
    specialty: "Medicina Interna",
    licenseNumber: "MED-2024-001",
    yearsOfExperience: 8,
  });

  // Pacientes asignados al doctor
  const [assignedPatients] = useState<AssignedPatient[]>([
    {
      id: "PAT001",
      fullName: "Maria Gonzalez",
      cedula: "9876543210",
      age: 45,
      gender: "Femenino",
      triageLevel: 2,
      chiefComplaint: "Dolor toracico agudo",
      assignedTime: "10:30 AM",
      status: "waiting",
    },
    {
      id: "PAT002",
      fullName: "Carlos Rodriguez",
      cedula: "5555555555",
      age: 32,
      gender: "Masculino",
      triageLevel: 3,
      chiefComplaint: "Fiebre y dolor abdominal",
      assignedTime: "11:15 AM",
      status: "waiting",
    },
  ]);

  // Estadisticas del doctor
  const [stats] = useState<DoctorStats>({
    patientsAttended: 12,
    patientsWaiting: assignedPatients.filter((p) => p.status === "waiting").length,
    averageTime: "25 min",
  });

  const handleStartConsultation = (patient: AssignedPatient) => {
    // Aqui podrias redirigir a una pagina de consulta especifica
    // router.push(`/doctor/consultation/${patient.id}`);
    console.log("Iniciando consulta con:", patient.fullName);
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <DoctorProfile doctor={doctorInfo} stats={stats} />
          <PatientsList
            patients={assignedPatients}
            onStartConsultation={handleStartConsultation}
          />
        </div>
      </div>
    </div>
  );
}

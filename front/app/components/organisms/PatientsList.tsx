import { useState } from "react";
import { PatientCard } from "../molecules/PatientCard";
import { AssignedPatient } from "@/src/types/doctor";

interface PatientsListProps {
  patients: AssignedPatient[];
  onStartConsultation: (patient: AssignedPatient) => void;
}

export function PatientsList({ patients, onStartConsultation }: PatientsListProps) {
  const [selectedPatient, setSelectedPatient] = useState<AssignedPatient | null>(
    null
  );

  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
        <h2 className="font-semibold text-gray-hard mb-4">
          Pacientes Asignados
        </h2>

        {patients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-soft">
              No hay pacientes asignados en este momento
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isSelected={selectedPatient?.id === patient.id}
                onSelect={() => setSelectedPatient(patient)}
                onStartConsultation={() => onStartConsultation(patient)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Patient } from "@/app/types/triage";

interface UserQueueProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
}

export function UserQueue({
  patients,
  selectedPatient,
  onSelectPatient,
}: UserQueueProps) {
  return (
    <div className="col-span-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-border">
        <div className="p-4 border-b border-gray-border">
          <h2 className="font-semibold text-gray-hard">⏳ Esperando Triage</h2>
          <p className="text-xs text-gray-soft mt-1">
            {patients.length} pacientes en espera
          </p>
        </div>
        <div className="divide-y divide-gray-border">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`w-full p-4 text-left hover:bg-gray-bg transition-colors ${
                selectedPatient?.id === patient.id ? "bg-primary-light" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-hard text-sm">
                    {patient.fullName}
                  </p>
                  <p className="text-xs text-gray-soft mt-1">
                    CC: {patient.cedula}
                  </p>
                  <p className="text-xs text-gray-hard mt-2 font-medium">
                    {patient.chiefComplaint}
                  </p>
                  <p className="text-xs text-gray-soft mt-1">
                    Llegada: {patient.arrivalTime}
                  </p>
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
  );
}

import { Patient } from "@/src/types/triage";

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
    <div>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-80">
        <div className="px-6 py-5 border-b-2 border-gray-100 bg-linear-to-r from-white to-gray-50">
          <h2 className="text-gray-800 font-bold text-lg">
            ⏳ Esperando Triage
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {patients.length} pacientes en espera
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4">
          {patients.map((patient) => {
            const isSelected = selectedPatient?.id === patient.id;

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`h-40 relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                    : "bg-white border-2 border-gray-200 hover:border-cyan-500 hover:translate-x-1 hover:shadow-md"
                }`}
              >
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase shadow ${
                    isSelected
                      ? "bg-white text-cyan-500"
                      : "bg-green-500 text-white"
                  }`}
                >
                  Esperando
                </div>
                <h3
                  className={`font-bold text-sm mb-1 ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {patient.fullName}
                </h3>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  CC: {patient.cedula}
                </p>
                <p
                  className={`mt-2 inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                    isSelected
                      ? "bg-white/30 text-white"
                      : "bg-cyan-100 text-cyan-900"
                  }`}
                >
                  {patient.chiefComplaint}
                </p>
                <p
                  className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                    isSelected ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  🕐 {patient.arrivalTime}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

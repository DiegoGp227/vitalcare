import { AssignedPatient } from "@/src/types/doctor";

interface ConsultationHeaderProps {
  patient: AssignedPatient;
  onEndConsultation: () => void;
}

export function ConsultationHeader({ patient, onEndConsultation }: ConsultationHeaderProps) {
  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getTriageLabel = (level: number) => {
    switch (level) {
      case 1: return "Critico";
      case 2: return "Urgente";
      case 3: return "Moderado";
      case 4: return "Menor";
      case 5: return "No urgente";
      default: return "Sin clasificar";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-hard">
              {patient.fullName}
            </h1>
            <span
              className={`${getTriageColor(
                patient.triageLevel
              )} text-white text-xs font-semibold px-3 py-1 rounded-full`}
            >
              {getTriageLabel(patient.triageLevel)}
            </span>
          </div>
          <p className="text-sm text-gray-soft">
            Cedula: {patient.cedula} - {patient.age} anos - {patient.gender}
          </p>
          <p className="text-sm text-gray-soft mt-1">
            Asignado a las {patient.assignedTime}
          </p>
        </div>
        <button
          onClick={onEndConsultation}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Terminar Consulta
        </button>
      </div>
    </div>
  );
}

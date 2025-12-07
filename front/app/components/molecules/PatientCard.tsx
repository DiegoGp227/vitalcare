import { AssignedPatient } from "@/app/types/doctor";

interface PatientCardProps {
  patient: AssignedPatient;
  isSelected: boolean;
  onSelect: () => void;
  onStartConsultation: () => void;
}

export function PatientCard({
  patient,
  isSelected,
  onSelect,
  onStartConsultation
}: PatientCardProps) {
  const getTriageColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTriageLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Critico";
      case 2:
        return "Urgente";
      case 3:
        return "Moderado";
      case 4:
        return "Menor";
      case 5:
        return "No urgente";
      default:
        return "Sin clasificar";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
        isSelected
          ? "border-cyan-500 bg-cyan-50"
          : "border-gray-border"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-hard">
            {patient.fullName}
          </h3>
          <p className="text-xs text-gray-soft">
            Cedula: {patient.cedula} - {patient.age} anos - {patient.gender}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${getTriageColor(
              patient.triageLevel
            )} text-white text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {getTriageLabel(patient.triageLevel)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-soft mb-1">
          Motivo de Consulta
        </p>
        <p className="text-sm text-gray-hard">
          {patient.chiefComplaint}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-soft">
          Asignado a las {patient.assignedTime}
        </span>
        {patient.status === "waiting" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartConsultation();
            }}
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Iniciar Consulta
          </button>
        )}
        {patient.status === "in_consultation" && (
          <span className="text-xs font-semibold text-green-600">
            En consulta
          </span>
        )}
        {patient.status === "completed" && (
          <span className="text-xs font-semibold text-gray-500">
            Completado
          </span>
        )}
      </div>
    </div>
  );
}

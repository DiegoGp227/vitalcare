import { AssignedPatient } from "@/src/types/doctor";

interface PatientDetailsProps {
  patient: AssignedPatient;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4 text-lg">
        Detalles del Paciente
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-hard mb-3">
            Informacion Personal
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-soft">Nombre Completo</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.fullName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Cedula</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.cedula}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Edad</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.age} anos
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Genero</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.gender}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-hard mb-3">
            Informacion de Consulta
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-soft">Motivo de Consulta</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.chiefComplaint}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Hora de Asignacion</p>
              <p className="text-sm font-medium text-gray-hard">
                {patient.assignedTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Nivel de Triage</p>
              <p className="text-sm font-medium text-gray-hard">
                Nivel {patient.triageLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-soft">Estado</p>
              <p className="text-sm font-medium text-green-600">
                En consulta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

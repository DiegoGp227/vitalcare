import { Patient } from "@/app/types/triage";

interface PatientInforProps {
  patient: Patient;
}

export function PatientInfor({ patient }: PatientInforProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">
        👤 Información del Paciente
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-soft">Cédula</p>
          <p className="text-sm font-medium text-gray-hard">{patient.cedula}</p>
        </div>
        <div>
          <p className="text-xs text-gray-soft">Género</p>
          <p className="text-sm font-medium text-gray-hard">{patient.gender}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-soft">Nombre Completo</p>
          <p className="text-sm font-medium text-gray-hard">
            {patient.fullName}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-soft">Fecha de Nacimiento</p>
          <p className="text-sm font-medium text-gray-hard">
            {patient.dateOfBirth} ({patient.age} años)
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-soft">Teléfono</p>
          <p className="text-sm font-medium text-gray-hard">{patient.phone}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-soft">Email</p>
          <p className="text-sm font-medium text-gray-hard">{patient.email}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-soft">Dirección</p>
          <p className="text-sm font-medium text-gray-hard">
            {patient.address}
          </p>
        </div>
      </div>
    </div>
  );
}

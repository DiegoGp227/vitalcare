import { DoctorInfo as DoctorInfoType } from "@/app/types/doctor";

interface DoctorInfoProps {
  doctor: DoctorInfoType;
}

export function DoctorInfo({ doctor }: DoctorInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">
        Informacion del Doctor
      </h2>

      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {doctor.name.charAt(0)}
          {doctor.lastName.charAt(0)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-soft">Nombre Completo</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.fullName}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Cedula</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.cedula}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Especialidad</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.specialty}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Numero de Licencia</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.licenseNumber}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Email</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.email}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Telefono</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.phone}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-soft">Anos de Experiencia</p>
          <p className="text-sm font-medium text-gray-hard">
            {doctor.yearsOfExperience} anos
          </p>
        </div>
      </div>
    </div>
  );
}

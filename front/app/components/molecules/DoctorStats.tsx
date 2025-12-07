import { DoctorStats as DoctorStatsType } from "@/app/types/doctor";

interface DoctorStatsProps {
  stats: DoctorStatsType;
}

export function DoctorStats({ stats }: DoctorStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">
        Estadisticas de Hoy
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-soft">
            Pacientes atendidos
          </span>
          <span className="text-sm font-semibold text-gray-hard">
            {stats.patientsAttended}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-soft">En espera</span>
          <span className="text-sm font-semibold text-orange-500">
            {stats.patientsWaiting}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-soft">Tiempo promedio</span>
          <span className="text-sm font-semibold text-gray-hard">
            {stats.averageTime}
          </span>
        </div>
      </div>
    </div>
  );
}

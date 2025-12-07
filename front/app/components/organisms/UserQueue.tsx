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
    <div>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-80">
        <div className="px-6 py-5 border-b-2 border-gray-100 bg-linear-to-r from-white to-gray-50">
          <h2 className="text-gray-800 font-bold text-lg">
            ⏳ Esperando Triage
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            3 pacientes en espera
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="h-40 relative bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-4 shadow-lg hover:translate-x-1.5 transition-transform duration-300">
            <div className="absolute top-4 right-4 px-3 py-1 bg-white text-cyan-500 rounded-full text-xs font-bold uppercase shadow">
              Esperando
            </div>
            <h3 className="text-white font-bold text-sm mb-1">
              María González Ruiz
            </h3>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">
              CC: 1.045.678.901
            </p>
            <p className="mt-2 inline-block px-3 py-1 bg-white/30 rounded-lg text-white font-semibold text-sm">
              💔 Dolor Torácico
            </p>
            <p className="mt-2 flex items-center gap-1 text-white/80 text-xs font-semibold">
              🕐 14:23
            </p>
          </div>

          <div className="h-40 relative bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-cyan-500 hover:translate-x-1 hover:shadow-md transition-all duration-300">
            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase shadow">
              Esperando
            </div>
            <h3 className="text-gray-800 font-bold text-sm mb-1">
              Juan Pérez Morales
            </h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              CC: 1.098.234.567
            </p>
            <p className="mt-2 inline-block px-3 py-1 bg-cyan-100 text-cyan-900 rounded-lg text-sm font-semibold">
              🦶 Trauma en Tobillo
            </p>
            <p className="mt-2 flex items-center gap-1 text-gray-400 text-xs font-semibold">
              🕐 14:35
            </p>
          </div>

          <div className="h-40 relative bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-cyan-500 hover:translate-x-1 hover:shadow-md transition-all duration-300">
            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase shadow">
              Esperando
            </div>
            <h3 className="text-gray-800 font-bold text-sm mb-1">
              Ana Martínez López
            </h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              CC: 52.876.543
            </p>
            <p className="mt-2 inline-block px-3 py-1 bg-cyan-100 text-cyan-900 rounded-lg text-sm font-semibold">
              😰 Dificultad Respiratoria
            </p>
            <p className="mt-2 flex items-center gap-1 text-gray-400 text-xs font-semibold">
              🕐 14:48
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

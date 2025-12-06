import { Symptoms as SymptomsType } from "@/app/types/triage";

interface SymptomsProps {
  symptoms: SymptomsType;
  onChange: (symptoms: SymptomsType) => void;
}

export function Symptoms({ symptoms, onChange }: SymptomsProps) {
  const handleChange = (field: keyof SymptomsType, value: string) => {
    onChange({ ...symptoms, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">🩺 Síntomas</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Nivel de Dolor (0-10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={symptoms.painLevel}
            onChange={(e) => handleChange("painLevel", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-soft mt-1">
            <span>0 (Sin dolor)</span>
            <span className="font-medium text-primary text-sm">
              {symptoms.painLevel}
            </span>
            <span>10 (Insoportable)</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Zona del Dolor
          </label>
          <input
            type="text"
            value={symptoms.painZone}
            onChange={(e) => handleChange("painZone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: Pecho - Lado izquierdo"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-soft mb-1">
            Fecha y Hora de Inicio
          </label>
          <input
            type="datetime-local"
            value={symptoms.onsetDateTime}
            onChange={(e) => handleChange("onsetDateTime", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

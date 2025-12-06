import { VitalSigns as VitalSignsType } from "@/app/types/triage";

interface VitalSignsProps {
  vitalSigns: VitalSignsType;
  onChange: (vitalSigns: VitalSignsType) => void;
}

export default function VitalSigns({
  vitalSigns,
  onChange,
}: VitalSignsProps) {
  const handleChange = (field: keyof VitalSignsType, value: string) => {
    onChange({ ...vitalSigns, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">❤️ Signos Vitales</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Frecuencia cardíaca (lpm)
          </label>
          <input
            type="number"
            value={vitalSigns.heartRate}
            onChange={(e) => handleChange("heartRate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: 78"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Presión arterial (mmHg)
          </label>
          <input
            type="text"
            value={vitalSigns.bloodPressure}
            onChange={(e) => handleChange("bloodPressure", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: 120/80"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Temperatura (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={vitalSigns.temperature}
            onChange={(e) => handleChange("temperature", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: 36.5"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Saturación O2 (%)
          </label>
          <input
            type="number"
            value={vitalSigns.oxygenSaturation}
            onChange={(e) => handleChange("oxygenSaturation", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: 98"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-soft mb-1">
            Frecuencia respiratoria (rpm)
          </label>
          <input
            type="number"
            value={vitalSigns.respiratoryRate}
            onChange={(e) => handleChange("respiratoryRate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ej: 16"
          />
        </div>
      </div>
    </div>
  );
}

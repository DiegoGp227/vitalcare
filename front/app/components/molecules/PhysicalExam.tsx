import { PhysicalExam as PhysicalExamType } from "@/app/types/triage";

interface PhysicalExamProps {
  physicalExam: PhysicalExamType;
  onChange: (physicalExam: PhysicalExamType) => void;
}

export function PhysicalExam({ physicalExam, onChange }: PhysicalExamProps) {
  const handleChange = (field: keyof PhysicalExamType, value: string) => {
    onChange({ ...physicalExam, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4">🔬 Examen Físico</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Apariencia General
          </label>
          <select
            value={physicalExam.generalAppearance}
            onChange={(e) => handleChange("generalAppearance", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Seleccionar</option>
            <option value="estable">Estable</option>
            <option value="ansioso">Ansioso</option>
            <option value="doloroso">En dolor</option>
            <option value="critico">Crítico</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Nivel de Dolor (1-10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={physicalExam.painLevel}
            onChange={(e) => handleChange("painLevel", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-soft mt-1">
            <span>0 (Sin dolor)</span>
            <span className="font-medium text-primary text-sm">
              {physicalExam.painLevel}
            </span>
            <span>10 (Máximo)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Estado de Consciencia
          </label>
          <select
            value={physicalExam.consciousness}
            onChange={(e) => handleChange("consciousness", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="alerta">Alerta</option>
            <option value="somnoliento">Somnoliento</option>
            <option value="confuso">Confuso</option>
            <option value="inconsciente">Inconsciente</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-soft mb-1">
            Hallazgos Adicionales
          </label>
          <textarea
            value={physicalExam.additionalFindings}
            onChange={(e) => handleChange("additionalFindings", e.target.value)}
            className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Ej: palidez cutánea, diaforesis..."
          />
        </div>
      </div>
    </div>
  );
}

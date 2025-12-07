import { useConstantes } from "@/src/triage/hooks/useCostantes";

export interface IConstantes {
  estadoconciencia: string;
  frecuenciacardiacafc: number;
  frecuenciarespiratoriafr: number;
  pacienteid: number;
  peso: number;
  presionarterialpa: number;
  saturaciondeoxigeno: number;
  temperaturacorporal: number;
  demo: boolean;
}

export default function FormConstantes() {
  const { constantes, updateField, submitConstantes } = useConstantes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitConstantes();
      alert("Constantes guardadas correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al enviar las constantes");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md grid grid-cols-2 gap-4"
    >
      {/* Estado de conciencia */}
      <div className="col-span-2">
        <label className="text-xs text-gray-500">Estado de conciencia</label>
        <input
          type="text"
          value={constantes.estadoconciencia}
          onChange={(e) => updateField("estadoconciencia", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: Alerta, Somnoliento..."
        />
      </div>

      {/* Frecuencia cardíaca */}
      <div>
        <label className="text-xs text-gray-500">
          Frecuencia cardíaca (FC)
        </label>
        <input
          type="number"
          value={constantes.frecuenciacardiacafc}
          onChange={(e) =>
            updateField("frecuenciacardiacafc", Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 78"
        />
      </div>

      {/* Frecuencia respiratoria */}
      <div>
        <label className="text-xs text-gray-500">
          Frecuencia respiratoria (FR)
        </label>
        <input
          type="number"
          value={constantes.frecuenciarespiratoriafr}
          onChange={(e) =>
            updateField("frecuenciarespiratoriafr", Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 16"
        />
      </div>

      {/* Paciente ID */}
      <div>
        <label className="text-xs text-gray-500">ID del paciente</label>
        <input
          type="number"
          value={constantes.pacienteid}
          onChange={(e) => updateField("pacienteid", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Peso */}
      <div>
        <label className="text-xs text-gray-500">Peso (kg)</label>
        <input
          type="number"
          step="0.1"
          value={constantes.peso}
          onChange={(e) => updateField("peso", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 70.5"
        />
      </div>

      {/* Presión arterial */}
      <div>
        <label className="text-xs text-gray-500">Presión arterial (PA)</label>
        <input
          type="number"
          value={constantes.presionarterialpa}
          onChange={(e) =>
            updateField("presionarterialpa", Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 120"
        />
      </div>

      {/* Saturación de Oxígeno */}
      <div>
        <label className="text-xs text-gray-500">
          Saturación de oxígeno (%)
        </label>
        <input
          type="number"
          value={constantes.saturaciondeoxigeno}
          onChange={(e) =>
            updateField("saturaciondeoxigeno", Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 98"
        />
      </div>

      {/* Temperatura corporal */}
      <div className="col-span-2">
        <label className="text-xs text-gray-500">
          Temperatura corporal (°C)
        </label>
        <input
          type="number"
          step="0.1"
          value={constantes.temperaturacorporal}
          onChange={(e) =>
            updateField("temperaturacorporal", Number(e.target.value))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Ej: 36.5"
        />
      </div>

      <button
        type="submit"
        className="col-span-2 mt-4 bg-primary text-white py-2 rounded"
      >
        Guardar constantes
      </button>
    </form>
  );
}

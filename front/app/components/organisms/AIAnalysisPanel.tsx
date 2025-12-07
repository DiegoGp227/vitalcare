import { AIAnalysis } from "@/src/types/triage";

interface AIAnalysisPanelProps {
  analysis: AIAnalysis | null;
  finalTriage: number;
  onTriageChange: (level: number) => void;
  onConfirm: () => void;
}

export function AIAnalysisPanel({
  analysis,
  finalTriage,
  onTriageChange,
  onConfirm,
}: AIAnalysisPanelProps) {
  if (!analysis) {
    return (
      <div className="col-span-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-border p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-border mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-sm text-gray-soft">
            Completa el formulario y presiona
            <br />
            &quot;Analizar con IA&quot; para ver sugerencias
          </p>
        </div>
      </div>
    );
  }

  const getTriageColor = (level: number) => {
    const colors = {
      1: "bg-danger",
      2: "bg-warning",
      3: "bg-primary",
      4: "bg-success",
      5: "bg-gray-soft",
    };
    return colors[level as keyof typeof colors] || "bg-gray-border";
  };

  return (
    <div className="col-span-3 space-y-4">
      {/* Triage Sugerido */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
        <h3 className="text-sm font-semibold text-gray-hard mb-3">
          🎯 Triage Sugerido
        </h3>
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${getTriageColor(
              analysis.suggestedTriage
            )} flex items-center justify-center text-white font-bold text-xl`}
          >
            {analysis.suggestedTriage}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-soft">
              Nivel {analysis.suggestedTriage}
            </p>
            <p className="text-sm font-medium text-gray-hard">
              Confianza: {analysis.confidence}%
            </p>
          </div>
        </div>
      </div>

      {/* Diagnósticos Probables */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
        <h3 className="text-sm font-semibold text-gray-hard mb-3">
          🔍 Diagnósticos Probables
        </h3>
        <div className="space-y-2">
          {analysis.diagnoses.map((diagnosis, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-hard">{diagnosis.name}</span>
                <span className="text-gray-soft">{diagnosis.probability}%</span>
              </div>
              <div className="w-full bg-gray-bg rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${diagnosis.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estudios Recomendados */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
        <h3 className="text-sm font-semibold text-gray-hard mb-3">
          📋 Estudios Recomendados
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-soft mb-2">
              Laboratorio
            </p>
            <div className="space-y-1">
              {analysis.recommendedStudies.labs.map((lab, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-hard">{lab.test}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      lab.priority === "URGENTE"
                        ? "bg-danger text-white"
                        : lab.priority === "ALTA"
                        ? "bg-warning text-white"
                        : "bg-gray-bg text-gray-soft"
                    }`}
                  >
                    {lab.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-soft mb-2">Imágenes</p>
            <div className="space-y-1">
              {analysis.recommendedStudies.imaging.map((imaging, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-hard">{imaging.study}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      imaging.priority === "URGENTE"
                        ? "bg-danger text-white"
                        : imaging.priority === "ALTA"
                        ? "bg-warning text-white"
                        : "bg-gray-bg text-gray-soft"
                    }`}
                  >
                    {imaging.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predicciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
        <h3 className="text-sm font-semibold text-gray-hard mb-3">
          📊 Predicciones
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-soft">
              Tiempo estimado de estancia
            </p>
            <p className="text-sm font-medium text-gray-hard">
              {analysis.predictions.estimatedStay}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-soft">Probabilidad de admisión</p>
            <p className="text-sm font-medium text-gray-hard">
              {analysis.predictions.admissionProbability}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-soft">Riesgo de deterioro en 2h</p>
            <p
              className={`text-sm font-medium ${
                analysis.predictions.deteriorationRisk > 30
                  ? "text-danger"
                  : "text-success"
              }`}
            >
              {analysis.predictions.deteriorationRisk}%
            </p>
          </div>
        </div>
      </div>

      {/* Decisión Final */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-border p-4">
        <h3 className="text-sm font-semibold text-gray-hard mb-3">
          ✅ Decisión Final de Triage
        </h3>
        <select
          value={finalTriage}
          onChange={(e) => onTriageChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
        >
          <option value={0}>Seleccionar nivel</option>
          <option value={1}>Nivel 1 - Reanimación</option>
          <option value={2}>Nivel 2 - Emergencia</option>
          <option value={3}>Nivel 3 - Urgente</option>
          <option value={4}>Nivel 4 - Menos urgente</option>
          <option value={5}>Nivel 5 - No urgente</option>
        </select>
        <button
          onClick={onConfirm}
          disabled={finalTriage === 0}
          className="w-full bg-success hover:bg-success/90 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Confirmar y Asignar
        </button>
      </div>
    </div>
  );
}

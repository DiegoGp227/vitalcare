"use client";

import { useState } from "react";

interface ConsultationNotesProps {
  onSaveNotes?: (notes: string) => void;
}

export function ConsultationNotes({ onSaveNotes }: ConsultationNotesProps) {
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-border p-6">
      <h2 className="font-semibold text-gray-hard mb-4 text-lg">
        Notas de Consulta
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-hard mb-2">
            Observaciones
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={4}
            placeholder="Escriba sus observaciones sobre el paciente..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-hard mb-2">
            Diagnostico
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full border border-gray-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="Escriba el diagnostico del paciente..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-hard mb-2">
            Tratamiento
          </label>
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="w-full border border-gray-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="Escriba el tratamiento recomendado..."
          />
        </div>

        <button
          onClick={() => onSaveNotes?.(`${notes}\n\nDiagnostico: ${diagnosis}\n\nTratamiento: ${treatment}`)}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Guardar Notas
        </button>
      </div>
    </div>
  );
}

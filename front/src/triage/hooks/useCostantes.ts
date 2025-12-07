import { IConstantes } from "@/app/components/molecules/VitalSigns";
import { useState } from "react";

export const useConstantes = (initial?: Partial<IConstantes>) => {
  const [constantes, setConstantes] = useState<IConstantes>({
    estadoconciencia: initial?.estadoconciencia ?? "",
    frecuenciacardiacafc: initial?.frecuenciacardiacafc ?? 0,
    frecuenciarespiratoriafr: initial?.frecuenciarespiratoriafr ?? 0,
    pacienteid: initial?.pacienteid ?? 0,
    peso: initial?.peso ?? 0,
    presionarterialpa: initial?.presionarterialpa ?? 0,
    saturaciondeoxigeno: initial?.saturaciondeoxigeno ?? 0,
    temperaturacorporal: initial?.temperaturacorporal ?? 0,
    demo: false,
  });

  const updateField = (field: keyof IConstantes, value: string | number) => {
    setConstantes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitConstantes = async () => {
    const res = await fetch("https://api-vitalcare.devdiego.work/triage/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(constantes),
    });

    if (!res.ok) throw new Error("Error al enviar las constantes");

    return await res.json();
  };

  return {
    constantes,
    updateField,
    submitConstantes,
  };
};

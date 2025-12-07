"use client";

import { TriageDataURL } from "@/src/shared/constants/urls";
import { useState, useEffect } from "react";

export interface ISintoma {
  demo: boolean;
  dolor: string;
  fecha: string; // ISO datetime string
  id: string;    // UUID
}

export interface IPaciente {
  apellido: string;
  cedula: number;
  id: number;
  fechanacimiento: string; // YYYY-MM-DD
  direccion: string;
  email: string;
  genero: string;
  sintomas: ISintoma[];
}

export const useGetTriageData = () => {
  const [data, setData] = useState<IPaciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = "https://api-vitalcare.devdiego.work/triage/userState";
        console.log('Fetching from URL:', url);
        const res = await fetch(url);
        console.log('Response received:', res);
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);

        if (!res.ok) {
          console.error('Response not ok, status:', res.status);
          throw new Error("Error al obtener los datos de triage");
        }

        const json = await res.json();
        console.log('API Response:', json);
        console.log('json.data:', json.data);
        console.log('json.data.paciente:', json.data?.paciente);
        console.log('Extracted pacientes:', json.data?.paciente);

        const pacientes = json.data?.paciente || [];
        console.log('Setting data to:', pacientes);
        setData(pacientes);
      } catch (err: any) {
        console.error('Error in useGetTriageData:', err);
        console.error('Error stack:', err.stack);
        setError(err.message || "Error desconocido");
      } finally {
        console.log('Fetch completed, loading set to false');
        setLoading(false);
      }
    };

    console.log('useGetTriageData effect running');
    fetchData();
  }, []);

  return { data, loading, error };
};

"use client";

import { TriageDataURL } from "@/src/shared/constants/urls";
import { Patient } from "@/src/types/triage";
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

// Función para mapear IPaciente a Patient
const mapToPatient = (paciente: IPaciente): Patient => {
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return {
    id: paciente.id.toString(),
    cedula: paciente.cedula.toString(),
    name: "",
    lastName: paciente.apellido,
    fullName: paciente.apellido,
    age: calculateAge(paciente.fechanacimiento),
    dateOfBirth: paciente.fechanacimiento,
    gender: paciente.genero,
    address: paciente.direccion,
    phone: "",
    email: paciente.email,
    chiefComplaint: paciente.sintomas?.[0]?.dolor || "Sin síntomas registrados",
    arrivalTime: new Date(paciente.sintomas?.[0]?.fecha || new Date()).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    chatCompleted: false,
  };
};

export const useGetTriageData = () => {
  const [data, setData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = "https://api-vitalcare.devdiego.work/triage/userState";
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Error al obtener los datos de triage");
        }

        const json = await res.json();
        const pacientesFromAPI: IPaciente[] = json.data?.paciente || [];
        const mappedPatients = pacientesFromAPI.map(mapToPatient);
        setData(mappedPatients);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

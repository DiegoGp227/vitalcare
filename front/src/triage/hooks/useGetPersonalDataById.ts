"use client";

import { UserInfoById } from "@/src/shared/constants/urls";
import { useState, useEffect } from "react";

export interface UserData {
  id: string;
  identification_number: string;
  name: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
}

export const useGetPersonalData = (id: string | null) => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${UserInfoById}/${id}`;

        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener los datos del usuario");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};

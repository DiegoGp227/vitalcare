// Tipos para el sistema de triage

export interface Patient {
  id: string;
  cedula: string;
  name: string;
  lastName: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  chiefComplaint: string;
  arrivalTime: string;
  chatCompleted: boolean;
}

export type Sintoma = {
  id: string; // UUID
  demo: boolean;
  dolor: string;
  fecha: string; // ISO datetime string
};

export type Paciente = {
  id: number;
  apellido: string;
  cedula: number;
  fechanacimiento: string; // YYYY-MM-DD
  direccion: string;
  email: string;
  genero: string;
  sintomas: Sintoma[];
};

export interface VitalSigns {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
}

export interface Symptoms {
  painLevel: string;
  painZone: string;
  onsetDateTime: string;
}

export interface PhysicalExam {
  generalAppearance: string;
  painLevel: string;
  consciousness: string;
  additionalFindings: string;
}

export interface AIAnalysis {
  suggestedTriage: number;
  confidence: number;
  diagnoses: Array<{ name: string; probability: number }>;
  recommendedStudies: {
    labs: Array<{ test: string; priority: string }>;
    imaging: Array<{ study: string; priority: string }>;
  };
  predictions: {
    estimatedStay: string;
    admissionProbability: number;
    deteriorationRisk: number;
  };
}

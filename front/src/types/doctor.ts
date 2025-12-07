// Tipos para el sistema de doctor

export interface DoctorInfo {
  id: string;
  cedula: string;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  avatar?: string;
}

export interface AssignedPatient {
  id: string;
  fullName: string;
  cedula: string;
  age: number;
  gender: string;
  triageLevel: number;
  chiefComplaint: string;
  assignedTime: string;
  status: "waiting" | "in_consultation" | "completed";
}

export interface DoctorStats {
  patientsAttended: number;
  patientsWaiting: number;
  averageTime: string;
}

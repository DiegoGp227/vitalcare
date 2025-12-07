// Base URL del backend
export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-vitalcare.devdiego.work/triage";

// Test endpoint
export const UserInfoById = new URL("/triage/userBy", BaseURL);

// Triage data endpoint
export const TriageDataURL = new URL("/triage/userState", BaseURL);

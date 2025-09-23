export const ENV = {
  ADMIN_USER: import.meta.env.VITE_ADMIN_USER as string,
  ADMIN_PASS: import.meta.env.VITE_ADMIN_PASS as string,
  ADMIN_2FA: (import.meta.env.VITE_ADMIN_2FA as string) || "14490",
  SESSION_MINUTES: Number(import.meta.env.VITE_SESSION_MINUTES || 15),
  ENCRYPTION_KEY: (import.meta.env.VITE_ENCRYPTION_KEY as string) || "AttarMedicalKey2025",
  MODELS_POLICY: (import.meta.env.VITE_MODELS_POLICY as string) || "HYBRID"
};
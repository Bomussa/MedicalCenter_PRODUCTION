export type Clinic = { id: string; name: string; floor: "M" | "2" | "3" };
export const CLINICS: Clinic[] = [
  { id: "clinic.Lab", name: "المختبر", floor: "M" },
  { id: "clinic.Radiology", name: "الأشعة", floor: "M" },
  { id: "clinic.Biometric", name: "غرفة القياسات الحيوية", floor: "2" },
  { id: "clinic.Eye", name: "عيادة العيون", floor: "2" },
  { id: "clinic.Internal", name: "عيادة الباطنية", floor: "2" },
  { id: "clinic.GeneralSurgery", name: "عيادة الجراحة العامة", floor: "2" },
  { id: "clinic.Orthopedics", name: "عيادة العظام والمفاصل", floor: "2" },
  { id: "clinic.ENT", name: "عيادة الأنف والأذن والحنجرة", floor: "2" },
  { id: "clinic.Psychiatry", name: "عيادة النفسية", floor: "2" },
  { id: "clinic.Dental", name: "عيادة الأسنان", floor: "2" },
  { id: "clinic.ECG", name: "تخطيط القلب", floor: "2" },
  { id: "clinic.Audio", name: "السمعيات", floor: "2" },
  { id: "clinic.Dermatology", name: "عيادة الجلدية", floor: "3" },
];
export const clinicMap = Object.fromEntries(CLINICS.map(c => [c.id, c]));



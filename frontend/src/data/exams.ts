import { Clinic } from "./clinics";

type Flow = { id: Clinic["id"] }[];

export const EXAMS = {
  "exam.courses": {
    name: "فحص الدورات التدريبية (الداخلية والخارجية)",
    description: "فحص طبي للمشاركين في الدورات التدريبية",
    icon: "📚",
    male: [
      { id: "clinic.Lab" },
      { id: "clinic.Biometric" },
      { id: "clinic.Eye" },
      { id: "clinic.Internal" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.ENT" },
    ],
    female: [
      { id: "clinic.Lab" },
      { id: "clinic.Biometric" },
      { id: "clinic.ENT" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.Psychiatry" },
      { id: "clinic.Dental" },
      { id: "clinic.Internal" },
      { id: "clinic.Eye" },
      { id: "clinic.Dermatology" },
    ],
  },
  "exam.recruit": {
    name: "فحص التجنيد والترفيع والنقل والتحويل وتجديد التعاقد",
    description: "فحص شامل للمتقدمين للخدمة العسكرية أو الترقيات",
    icon: "📝",
    male: [
      { id: "clinic.Lab" },
      { id: "clinic.Radiology" },
      { id: "clinic.Biometric" },
      { id: "clinic.Eye" },
      { id: "clinic.Internal" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.ENT" },
      { id: "clinic.Psychiatry" },
      { id: "clinic.Dental" },
    ],
    female: [
      { id: "clinic.Lab" },
      { id: "clinic.Biometric" },
      { id: "clinic.ENT" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.Psychiatry" },
      { id: "clinic.Dental" },
      { id: "clinic.Internal" },
      { id: "clinic.Eye" },
      { id: "clinic.Dermatology" },
    ],
  },
  "exam.aviation": {
    name: "فحص الطيران السنوي",
    description: "فحص دوري لطياري وموظفي الطيران",
    icon: "✈️",
    male: [
      { id: "clinic.Lab" },
      { id: "clinic.Eye" },
      { id: "clinic.Internal" },
      { id: "clinic.ENT" },
      { id: "clinic.ECG" },
      { id: "clinic.Audio" },
    ],
    female: [
      { id: "clinic.Lab" },
      { id: "clinic.Biometric" },
      { id: "clinic.ENT" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.Psychiatry" },
      { id: "clinic.Dental" },
      { id: "clinic.Internal" },
      { id: "clinic.Eye" },
      { id: "clinic.Dermatology" },
    ],
  },
  "exam.cooks": {
    name: "فحص الطباخين",
    description: "فحص صحي للعاملين في مجال تحضير الطعام",
    icon: "👨‍🍳",
    male: [
      { id: "clinic.Lab" },
      { id: "clinic.Internal" },
      { id: "clinic.ENT" },
      { id: "clinic.GeneralSurgery" },
    ],
    female: [
      { id: "clinic.Lab" },
      { id: "clinic.Biometric" },
      { id: "clinic.ENT" },
      { id: "clinic.GeneralSurgery" },
      { id: "clinic.Orthopedics" },
      { id: "clinic.Psychiatry" },
      { id: "clinic.Dental" },
      { id: "clinic.Internal" },
      { id: "clinic.Eye" },
      { id: "clinic.Dermatology" },
    ],
  },
} as const satisfies Record<string, { name: string; description: string; icon: string; male: Flow; female: Flow }>;

export const EXAM_IDS = Object.keys(EXAMS);



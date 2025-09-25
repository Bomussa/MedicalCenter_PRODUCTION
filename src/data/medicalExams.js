// بيانات الفحوصات الطبية المحدثة حسب النماذج الجديدة

export const examTypes = {
  INTERNAL_EXTERNAL_COURSES: {
    id: 'INTERNAL_EXTERNAL_COURSES',
    name: 'فحص الدورات الداخلية والخارجية',
    clinics: [
      // الطابق الميزانين
      { id: 'lab', name: 'فحص المختبر', floor: 'الميزانين', order: 1 },
      // الطابق الثاني
      { id: 'vital_signs', name: 'القياسات الحيوية', floor: 'الطابق الثاني', order: 2 },
      { id: 'ophthalmology', name: 'عيادة العيون', floor: 'الطابق الثاني', order: 3 },
      { id: 'internal_medicine', name: 'عيادة الباطنية', floor: 'الطابق الثاني', order: 4 },
      { id: 'general_surgery', name: 'عيادة الجراحة العامة', floor: 'الطابق الثاني', order: 5 },
      { id: 'orthopedics', name: 'عيادة العظام والمفاصل', floor: 'الطابق الثاني', order: 6 },
      { id: 'ent', name: 'عيادة أنف وأذن وحنجرة', floor: 'الطابق الثاني', order: 7 }
    ]
  },

  RECRUITMENT_PROMOTION_TRANSFER: {
    id: 'RECRUITMENT_PROMOTION_TRANSFER',
    name: 'فحص التجنيد والترفيع والنقل والتحويل وتجديد التعاقد',
    clinics: [
      // الطابق الميزانين
      { id: 'lab_xray', name: 'فحص المختبر والأشعة', floor: 'الميزانين', order: 1 },
      // الطابق الثاني
      { id: 'vital_signs', name: 'القياسات الحيوية', floor: 'الطابق الثاني', order: 2 },
      { id: 'ophthalmology', name: 'عيادة العيون', floor: 'الطابق الثاني', order: 3 },
      { id: 'internal_medicine', name: 'عيادة الباطنية', floor: 'الطابق الثاني', order: 4 },
      { id: 'general_surgery', name: 'عيادة الجراحة العامة', floor: 'الطابق الثاني', order: 5 },
      { id: 'orthopedics', name: 'عيادة العظام والمفاصل', floor: 'الطابق الثاني', order: 6 },
      { id: 'ent', name: 'عيادة أنف وأذن وحنجرة', floor: 'الطابق الثاني', order: 7 },
      { id: 'psychiatry', name: 'عيادة النفسية', floor: 'الطابق الثاني', order: 8 },
      { id: 'dentistry', name: 'عيادة الأسنان', floor: 'الطابق الثاني', order: 9 }
    ]
  },

  AVIATION_ANNUAL: {
    id: 'AVIATION_ANNUAL',
    name: 'فحص الطيران السنوي',
    clinics: [
      // الطابق الميزانين
      { id: 'lab', name: 'فحص المختبر', floor: 'الميزانين', order: 1 },
      // الطابق الثاني
      { id: 'ophthalmology', name: 'عيادة العيون', floor: 'الطابق الثاني', order: 2 },
      { id: 'internal_medicine', name: 'عيادة الباطنية', floor: 'الطابق الثاني', order: 3 },
      { id: 'ent', name: 'عيادة أنف وأذن وحنجرة', floor: 'الطابق الثاني', order: 4 },
      { id: 'ecg', name: 'عيادة تخطيط القلب', floor: 'الطابق الثاني', order: 5 },
      { id: 'audiology', name: 'عيادة السمع', floor: 'الطابق الثاني', order: 6 }
    ]
  },

  COOKS: {
    id: 'COOKS',
    name: 'فحص الطباخين',
    clinics: [
      // الطابق الميزانين
      { id: 'lab', name: 'فحص المختبر', floor: 'الميزانين', order: 1 },
      // الطابق الثاني
      { id: 'internal_medicine', name: 'عيادة الباطنية', floor: 'الطابق الثاني', order: 2 },
      { id: 'ent', name: 'عيادة أنف وأذن وحنجرة', floor: 'الطابق الثاني', order: 3 },
      { id: 'general_surgery', name: 'عيادة الجراحة العامة', floor: 'الطابق الثاني', order: 4 }
    ]
  },

  FEMALE_ALL_EXAMS: {
    id: 'FEMALE_ALL_EXAMS',
    name: 'العنصر النسائي - جميع الفحوصات',
    clinics: [
      // الطابق الميزانين
      { id: 'lab', name: 'فحص المختبر', floor: 'الميزانين', order: 1 },
      // الطابق الثاني
      { id: 'vital_signs', name: 'القياسات الحيوية', floor: 'الطابق الثاني', order: 2 },
      { id: 'ent', name: 'عيادة أنف وأذن وحنجرة', floor: 'الطابق الثاني', order: 3 },
      { id: 'general_surgery', name: 'عيادة الجراحة العامة', floor: 'الطابق الثاني', order: 4 },
      { id: 'orthopedics', name: 'عيادة العظام والمفاصل', floor: 'الطابق الثاني', order: 5 },
      { id: 'psychiatry', name: 'عيادة النفسية', floor: 'الطابق الثاني', order: 6 },
      { id: 'dentistry', name: 'عيادة الأسنان', floor: 'الطابق الثاني', order: 7 },
      // الطابق الثالث (يجب التسجيل من استقبال العطار)
      { id: 'internal_medicine_f', name: 'عيادة الباطنية', floor: 'الطابق الثالث', order: 8, note: 'يجب التسجيل من استقبال العطار' },
      { id: 'ophthalmology_f', name: 'عيادة العيون', floor: 'الطابق الثالث', order: 9, note: 'يجب التسجيل من استقبال العطار' },
      { id: 'dermatology', name: 'عيادة الجلدية', floor: 'الطابق الثالث', order: 10, note: 'يجب التسجيل من استقبال العطار' }
    ]
  }
};

// نماذج ديناميكية A, B, C, D
export const dynamicModels = ['A', 'B', 'C', 'D'];

// معلومات الطوابق
export const floorInfo = {
  'الميزانين': {
    name: 'الطابق الميزانين',
    access: 'يمكن التوجه إلى طابق الميزانين عن طريق المصعد بالضغط على حرف M',
    color: '#E3F2FD'
  },
  'الطابق الثاني': {
    name: 'الطابق الثاني',
    subtitle: 'عيادات اللجنة الطبية العسكرية',
    color: '#F3E5F5'
  },
  'الطابق الثالث': {
    name: 'الطابق الثالث',
    note: 'يجب التسجيل من استقبال العطار',
    color: '#E8F5E8'
  }
};

// دالة للحصول على العيادات حسب نوع الفحص والجنس
export function getClinicsForExam(examType, gender = 'MALE') {
  if (gender === 'FEMALE') {
    return examTypes.FEMALE_ALL_EXAMS.clinics;
  }
  
  return examTypes[examType]?.clinics || [];
}

// دالة للحصول على النموذج الديناميكي
export function getDynamicModel() {
  const models = ['A', 'B', 'C', 'D'];
  const currentHour = new Date().getHours();
  return models[currentHour % 4];
}


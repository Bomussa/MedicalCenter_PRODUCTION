export const strings = {
  ar: {
    login: 'تسجيل الدخول',
    militaryId: 'رقم العسكري',
    pin: 'الرمز السري',
    submit: 'إرسال',
    examOpenExists: 'يوجد فحص مفتوح لهذا المريض',
  },
  en: {
    login: 'Login',
    militaryId: 'Military ID',
    pin: 'PIN',
    submit: 'Submit',
    examOpenExists: 'An open exam exists for this patient',
  },
};

export function t(key) {
  const lang = import.meta.env.VITE_DEFAULT_LANG || 'ar';
  return strings[lang]?.[key] || key;
}

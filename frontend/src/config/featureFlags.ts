/* New file – Feature Flags – 2025-09-26 */
export const featureFlags = {
  enableVisitors: true,          // واجهة المراجعين
  enableAdmin: true,             // واجهة الإدارة v2
  redirectUnknown: true,         // إعادة توجيه لمسارات خاطئة

  // وحدات الإدارة
  adminFlags: true,
  adminSettings: true,
  adminQueue: true,
  adminPins: true,
  adminReports: true,
  adminStats: true,

  // الثيمات والخطوط
  themeSwitcher: true,
  fontsSwitcher: true,

  // الصوت والإشعارات
  audioEnabled: true,

  // تقارير (تُنفذ من الـ Backend)
  reports_csv: true,
  reports_xlsx: true,
  reports_pdf: true,
};


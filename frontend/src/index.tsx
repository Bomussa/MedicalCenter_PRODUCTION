/* New file – Non-destructive EntryPoint – 2025-09-26 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// واجهة المراجعين (الموجودة لديك أصلاً)
import MainApp from "./App";

// واجهة الإدارة v2 الجديدة (تجميع صفحات الإدارة الإضافية)
import Admin2App from "./new_admin2/App";

// مركز الثيمات + تطبيقها على كل الواجهات
import { ThemeProvider } from "./components/Themes";

// مفاتيح تشغيل/إيقاف الميزات بدون لمس الكود الأصلي
import { featureFlags } from "./config/featureFlags";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          {/* واجهة المراجعين هي الافتراضية */}
          {featureFlags.enableVisitors && <Route path="/" element={<MainApp />} />}

          {/* واجهة الإدارة v2 */}
          {featureFlags.enableAdmin && <Route path="/admin/*" element={<Admin2App />} />}

          {/* أي مسار غير معروف → ارجاع للصفحة الرئيسية */}
          {featureFlags.redirectUnknown && <Route path="*" element={<Navigate to="/" replace />} />}
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);


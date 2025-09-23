import React from "react";
import { useApp } from "../context/AppContext";

const RecordsReports: React.FC = () => {
  const { session } = useApp();
  const [editMode, setEditMode] = React.useState(false);

  const handleExport = (format: string) => {
    alert(`تصدير الكشوفات والسجلات بصيغة ${format} (قيد التطوير)`);
    // In a real application, this would trigger a backend API call to generate and download the report
  };

  return (
    <div>
      <h4>الكشوفات والسجلات والتقارير</h4>
      <div className="card" style={{ marginBottom: "20px" }}>
        <h5>عرض السجلات</h5>
        <p>هنا سيتم عرض الكشوفات والسجلات والتقارير (عرض فقط لجميع المستخدمين).</p>
        {/* Placeholder for actual records display */}
        <table className="table">
          <thead>
            <tr>
              <th>معرف الزيارة</th>
              <th>اسم المريض</th>
              <th>تاريخ الزيارة</th>
              <th>الفحص</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr>
              <td>#001</td>
              <td>أحمد محمد</td>
              <td>2025-09-20</td>
              <td>فحص عام</td>
              <td>مكتمل</td>
            </tr>
            <tr>
              <td>#002</td>
              <td>فاطمة علي</td>
              <td>2025-09-20</td>
              <td>فحص عيون</td>
              <td>قيد الانتظار</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <h5>خيارات التصدير</h5>
        <button className="btn btn-secondary" onClick={() => handleExport("CSV")}>تصدير CSV</button>
        <button className="btn btn-secondary" onClick={() => handleExport("PDF")} style={{ marginLeft: "10px" }}>تصدير PDF</button>
        <button className="btn btn-secondary" onClick={() => handleExport("Excel")} style={{ marginLeft: "10px" }}>تصدير Excel</button>
      </div>

      {session.isAdmin && session.user === "bomussa" && (
        <div className="card">
          <h5>وضع التحرير (للمشرف العام فقط)</h5>
          <button className="btn btn-warning" onClick={() => setEditMode(!editMode)}>
            {editMode ? "إلغاء وضع التحرير" : "تفعيل وضع التحرير"}
          </button>
          {editMode && (
            <div style={{ marginTop: "10px" }}>
              <p>يمكنك الآن تعديل أو حذف السجلات (قيد التطوير).</p>
              {/* Placeholder for edit/delete functionality */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordsReports;



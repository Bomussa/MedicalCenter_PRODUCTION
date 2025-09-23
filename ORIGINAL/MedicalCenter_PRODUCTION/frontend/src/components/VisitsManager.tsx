import React, { useState, useEffect } from 'react';

interface Visit {
  _id: string;
  militaryId: string;
  examType: string;
  startTime: string;
  endTime?: string;
  clinicsVisited: string[];
  status: 'active' | 'completed';
}

const VisitsManager: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits/admin');
      if (response.ok) {
        const data = await response.json();
        setVisits(data);
        setError(null);
      } else {
        setError('فشل في تحميل الزيارات');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'نشط' : 'مكتمل';
  };

  const getStatusClass = (status: string) => {
    return status === 'active' ? 'status-active' : 'status-completed';
  };

  if (loading) {
    return (
      <div className="visits-manager">
        <h3>إدارة الزيارات</h3>
        <div className="loading">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visits-manager">
        <h3>إدارة الزيارات</h3>
        <div className="error">{error}</div>
        <button onClick={fetchVisits}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="visits-manager">
      <h3>إدارة الزيارات</h3>
      <div className="visits-summary">
        <div className="summary-item">
          <span>إجمالي الزيارات: {visits.length}</span>
        </div>
        <div className="summary-item">
          <span>الزيارات النشطة: {visits.filter(v => v.status === 'active').length}</span>
        </div>
        <div className="summary-item">
          <span>الزيارات المكتملة: {visits.filter(v => v.status === 'completed').length}</span>
        </div>
      </div>
      
      <div className="visits-table">
        <table>
          <thead>
            <tr>
              <th>الرقم العسكري</th>
              <th>نوع الفحص</th>
              <th>وقت البداية</th>
              <th>وقت النهاية</th>
              <th>العيادات المزارة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit._id}>
                <td>{visit.militaryId}</td>
                <td>{visit.examType}</td>
                <td>{formatDate(visit.startTime)}</td>
                <td>{visit.endTime ? formatDate(visit.endTime) : '-'}</td>
                <td>{visit.clinicsVisited.length}</td>
                <td>
                  <span className={`status ${getStatusClass(visit.status)}`}>
                    {getStatusText(visit.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitsManager;


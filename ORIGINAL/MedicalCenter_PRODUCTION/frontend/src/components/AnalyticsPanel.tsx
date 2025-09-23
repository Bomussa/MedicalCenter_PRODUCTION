import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  clinicsCount: number;
  examsCount: number;
  usersCount: number;
  uptimeSeconds: number;
  timestamp: string;
}

const AnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setError(null);
      } else {
        setError('فشل في تحميل الإحصائيات');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}س ${minutes}د`;
  };

  if (loading) {
    return (
      <div className="analytics-panel">
        <h3>الإحصائيات المباشرة</h3>
        <div className="loading">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-panel">
        <h3>الإحصائيات المباشرة</h3>
        <div className="error">{error}</div>
        <button onClick={fetchAnalytics}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="analytics-panel">
      <h3>الإحصائيات المباشرة</h3>
      {analytics && (
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-number">{analytics.clinicsCount}</div>
            <div className="stat-label">العيادات</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{analytics.examsCount}</div>
            <div className="stat-label">الفحوصات</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{analytics.usersCount}</div>
            <div className="stat-label">المستخدمين</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatUptime(analytics.uptimeSeconds)}</div>
            <div className="stat-label">وقت التشغيل</div>
          </div>
        </div>
      )}
      <div className="last-updated">
        آخر تحديث: {analytics ? new Date(analytics.timestamp).toLocaleString('ar-SA') : ''}
      </div>
    </div>
  );
};

export default AnalyticsPanel;


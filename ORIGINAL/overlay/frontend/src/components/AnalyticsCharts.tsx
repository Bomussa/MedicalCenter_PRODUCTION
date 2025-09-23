import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsCharts() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  if (!data) return <p>جاري تحميل البيانات...</p>;

  const lineData = {
    labels: data.daily.map((d: any) => d.date),
    datasets: [
      {
        label: "عدد المراجعين",
        data: data.daily.map((d: any) => d.count),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(data.exams),
    datasets: [
      {
        data: Object.values(data.exams),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#f44336", "#9c27b0"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(data.gender),
    datasets: [
      {
        label: "عدد",
        data: Object.values(data.gender),
        backgroundColor: ["#3f51b5", "#e91e63"],
      },
    ],
  };

  return (
    <div>
      <h2>📊 إحصائيات المراجعين</h2>
      <div style={{ maxWidth: "720px", margin: "20px auto" }}>
        <Line data={lineData} />
      </div>

      <h2>🥧 أنواع الفحوصات</h2>
      <div style={{ maxWidth: "420px", margin: "20px auto" }}>
        <Pie data={pieData} />
      </div>

      <h2>👥 توزيع الجنس</h2>
      <div style={{ maxWidth: "420px", margin: "20px auto" }}>
        <Bar data={barData} />
      </div>
    </div>
  );
}
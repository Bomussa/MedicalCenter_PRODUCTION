import React, { useState } from "react";

export default function AdminTests() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/run-tests", { method: "POST" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "فشل تشغيل الاختبارات");
      setResult(data.result || { output: data.output, stderr: data.stderr });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧪 اختبارات النظام – التشغيل عند الطلب</h2>
      <button onClick={runTests} disabled={loading}>
        {loading ? "جاري التشغيل..." : "تشغيل الاختبارات الآن"}
      </button>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {result && (
        <pre style={{ background: "#f7f7f7", padding: 10, marginTop: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

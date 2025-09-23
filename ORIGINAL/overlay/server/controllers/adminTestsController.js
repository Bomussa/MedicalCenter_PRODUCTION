import { exec } from "child_process";

export const runTests = async (req, res) => {
  try {
    // شغّل Jest عند الطلب فقط. نستخدم --json لإرجاع نتائج قابلة للعرض.
    const cmd = process.env.JEST_CMD || "npx jest --runInBand --json";
    exec(cmd, { cwd: process.cwd(), maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error && !stdout) {
        return res.status(500).json({ ok: false, error: error.message, stderr });
      }
      // حاول تحويل الإخراج إلى JSON؛ إن فشل نرجعه كنص عادي.
      try {
        const obj = JSON.parse(stdout);
        return res.json({ ok: true, result: obj });
      } catch {
        return res.json({ ok: true, output: stdout, stderr });
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

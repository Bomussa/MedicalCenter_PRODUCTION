import { Parser } from "json2csv";
export const exportCSV = async (req, res) => {
  try {
    const sample = [{ name: "Exam A", count: 10 }, { name: "Exam B", count: 5 }];
    const parser = new Parser();
    const csv = parser.parse(sample);
    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    return res.send(csv);
  } catch (e) { res.status(500).json({ error: "export csv error" }); }
};

import Visit from "../models/visit.js";

export const addVisit = async (req, res) => {
  try {
    const visit = await Visit.create(req.body);
    res.json({ ok: true, visit });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

export const getSummaryFromDB = async (req, res) => {
  try {
    const daily = await Visit.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitDate" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const examsAgg = await Visit.aggregate([{ $group: { _id: "$examType", count: { $sum: 1 } } }]);
    const exams = {};
    examsAgg.forEach((e) => (exams[e._id] = e.count));

    const genderAgg = await Visit.aggregate([{ $group: { _id: "$gender", count: { $sum: 1 } } }]);
    const gender = {};
    genderAgg.forEach((g) => (gender[g._id] = g.count));

    res.json({ ok: true, daily, exams, gender });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

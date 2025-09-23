import request from "supertest";
import app from "../server/index.js";

describe("Analytics DB API", () => {
  it("should return summary with ok=true", async () => {
    const res = await request(app).get("/api/analytics-db/summary");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("daily");
    expect(res.body).toHaveProperty("exams");
    expect(res.body).toHaveProperty("gender");
  });

  it("should add a new visit successfully", async () => {
    const res = await request(app)
      .post("/api/analytics-db/add")
      .send({ examType: "فحص التجنيد", gender: "ذكر" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body.visit).toHaveProperty("examType", "فحص التجنيد");
    expect(res.body.visit).toHaveProperty("gender", "ذكر");
  });
});

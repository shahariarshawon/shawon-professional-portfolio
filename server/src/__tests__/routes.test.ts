import request from "supertest";
import app from "../app";

describe("API Integration Tests", () => {
  it("GET / should return 200 server running status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("running");
  });

  it("GET /healthz should return 200 health check status", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/admin/dashboard should reject unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

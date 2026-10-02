import request from "supertest";

const mockHero = jest.fn();

jest.mock("../utils/prisma", () => ({
  __esModule: true,
  default: { heroSection: { findFirst: (...args: unknown[]) => mockHero(...args) } }
}));

jest.mock("../config/cloudinary", () => ({
  __esModule: true,
  default: {
    utils: { private_download_url: () => "https://api.cloudinary.com/v1_1/demo/image/download?signed" }
  }
}));

jest.mock("../config/env", () => ({
  ...jest.requireActual("../config/env"),
  isCloudinaryConfigured: () => true
}));

import app from "../app";

const LEGACY_URL =
  "https://res.cloudinary.com/demo/image/upload/v1/shawon-portfolio/resumes/file_abc123.pdf";

const hero = (overrides = {}) => ({
  name: "AL Shahariar Arafat Shawon",
  resumeUrl: LEGACY_URL,
  isViewResumeEnabled: true,
  isDownloadResumeEnabled: true,
  ...overrides
});

describe("GET /api/public/resume", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockHero.mockReset();
    global.fetch = jest.fn(async () =>
      new Response(Buffer.from("%PDF-1.7 fake resume"), { status: 200 })
    ) as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("serves the PDF inline so the browser opens its viewer", async () => {
    mockHero.mockResolvedValue(hero());

    const res = await request(app).get("/api/public/resume");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
    expect(res.headers["content-disposition"]).toMatch(/^inline; filename="AL-Shahariar-Arafat-Shawon-Resume\.pdf"$/);
    expect(res.headers["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(res.body.toString()).toContain("%PDF-");
  });

  it("serves it as an attachment when ?download=1", async () => {
    mockHero.mockResolvedValue(hero());

    const res = await request(app).get("/api/public/resume?download=1");

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/^attachment;/);
  });

  it("respects the view/download toggles", async () => {
    mockHero.mockResolvedValue(hero({ isViewResumeEnabled: false }));

    expect((await request(app).get("/api/public/resume")).status).toBe(404);
    expect((await request(app).get("/api/public/resume?download=1")).status).toBe(200);
  });

  it("404s when no resume is set", async () => {
    mockHero.mockResolvedValue(hero({ resumeUrl: null }));

    const res = await request(app).get("/api/public/resume");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("falls back to 502 (not a hang or crash) if storage returns something that is not a PDF", async () => {
    mockHero.mockResolvedValue(hero({ resumeUrl: `${LEGACY_URL}?v=2` }));
    global.fetch = jest.fn(async () =>
      new Response(JSON.stringify({ error: "deny or ACL failure" }), { status: 401 })
    ) as unknown as typeof fetch;

    const res = await request(app).get("/api/public/resume");

    expect(res.status).toBe(502);
    expect(res.body.message).toMatch(/re-upload/i);
  });

  it("redirects to externally hosted resumes", async () => {
    mockHero.mockResolvedValue(hero({ resumeUrl: "https://example.com/cv.pdf" }));

    const res = await request(app).get("/api/public/resume").redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("https://example.com/cv.pdf");
  });
});

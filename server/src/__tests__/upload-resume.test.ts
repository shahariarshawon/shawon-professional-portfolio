import { parseCloudinaryUrl } from "../modules/public/resume.service";
import { detectFileKind, isUnsafeSvg } from "../modules/upload/upload.signature";

describe("detectFileKind", () => {
  it("detects a PDF by its header, not its name", () => {
    expect(detectFileKind(Buffer.from("%PDF-1.7\n..."))).toBe("pdf");
  });

  it("detects PNG, JPEG and WEBP", () => {
    expect(
      detectFileKind(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))
    ).toBe("png");
    expect(detectFileKind(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0]))).toBe("jpeg");
    expect(
      detectFileKind(Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP")]))
    ).toBe("webp");
  });

  it("detects SVG and rejects arbitrary content", () => {
    expect(detectFileKind(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe("svg");
    expect(detectFileKind(Buffer.from("MZ\u0090\u0000 executable"))).toBeNull();
  });
});

describe("isUnsafeSvg", () => {
  it("flags scripts and inline handlers", () => {
    expect(isUnsafeSvg(Buffer.from("<svg><script>alert(1)</script></svg>"))).toBe(true);
    expect(isUnsafeSvg(Buffer.from('<svg onload="x()"></svg>'))).toBe(true);
    expect(isUnsafeSvg(Buffer.from('<svg><path d="M0 0"/></svg>'))).toBe(false);
  });
});

describe("parseCloudinaryUrl", () => {
  it("parses the legacy image-typed PDF URL (extension moves to format)", () => {
    const asset = parseCloudinaryUrl(
      "https://res.cloudinary.com/uwrxxyjh/image/upload/v1790793318/shawon-portfolio/resumes/file_jli0lp.pdf"
    );

    expect(asset).toMatchObject({
      resourceType: "image",
      type: "upload",
      publicId: "shawon-portfolio/resumes/file_jli0lp",
      format: "pdf"
    });
  });

  it("keeps the extension in the public_id for raw assets", () => {
    const asset = parseCloudinaryUrl(
      "https://res.cloudinary.com/demo/raw/upload/v12/shawon-portfolio/resumes/cv-ab12.pdf"
    );

    expect(asset).toMatchObject({
      resourceType: "raw",
      publicId: "shawon-portfolio/resumes/cv-ab12.pdf",
      format: ""
    });
  });

  it("returns null for non-Cloudinary URLs", () => {
    expect(parseCloudinaryUrl("https://drive.google.com/file/d/abc/view")).toBeNull();
  });
});

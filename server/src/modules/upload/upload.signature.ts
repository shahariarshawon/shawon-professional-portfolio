/**
 * Content sniffing for uploads. The multer filter only sees the client-supplied
 * MIME type and extension, both trivially spoofed; this checks the real bytes.
 */

export type TDetectedFileKind = "pdf" | "jpeg" | "png" | "webp" | "svg";

const startsWith = (buffer: Buffer, bytes: number[], offset = 0) =>
  buffer.length >= offset + bytes.length &&
  bytes.every((byte, index) => buffer[offset + index] === byte);

export const detectFileKind = (buffer: Buffer): TDetectedFileKind | null => {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "jpeg";

  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "png";
  }

  // RIFF....WEBP
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "webp";
  }

  // The PDF spec lets the %PDF- header sit anywhere in the first 1024 bytes.
  if (buffer.subarray(0, 1024).includes("%PDF-")) return "pdf";

  const head = buffer.subarray(0, 2048).toString("utf8").trimStart();
  if (head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) {
    return "svg";
  }

  return null;
};

/** Active content has no place in an uploaded SVG image. */
export const isUnsafeSvg = (buffer: Buffer) => {
  const text = buffer.toString("utf8");

  return (
    /<script[\s>]/i.test(text) ||
    /javascript:/i.test(text) ||
    /\son[a-z]+\s*=/i.test(text) ||
    /<foreignObject[\s>]/i.test(text)
  );
};

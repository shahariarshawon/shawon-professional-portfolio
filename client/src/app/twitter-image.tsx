import { ImageResponse } from "next/og";

import { siteConfig } from "@/constants/site";

export const runtime = "edge";

export const alt = siteConfig.title;

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#11172a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#dfe5ec"
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#599692",
            fontWeight: 700
          }}
        >
          Backend Developer
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 900,
            maxWidth: 980
          }}
        >
          AL Shahariar Arafat Shawon
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#cbd5e1",
            maxWidth: 960
          }}
        >
          Node.js • Express.js • TypeScript • PostgreSQL • Prisma • Next.js
        </div>

        <div
          style={{
            marginTop: 50,
            display: "flex",
            gap: 18
          }}
        >
          {["REST APIs", "Authentication", "Database Design"].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(89,150,146,0.45)",
                borderRadius: 999,
                padding: "14px 24px",
                fontSize: 22,
                color: "#599692"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
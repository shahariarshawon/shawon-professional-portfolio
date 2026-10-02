import { ImageResponse } from "next/og";

import { siteConfig } from "@/constants/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared social-card artwork for the OpenGraph and Twitter images. */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#06080f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#edf1f7"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 3 L42.2 13.5 L42.2 34.5 L24 45 L5.8 34.5 L5.8 13.5 Z"
              stroke="#5eead4"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M30 15 H21 a4.5 4.5 0 0 0 0 9 h6 a4.5 4.5 0 0 1 0 9 H18"
              stroke="#818cf8"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#5eead4",
              fontWeight: 700
            }}
          >
            Backend Developer
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 900,
            maxWidth: 980
          }}
        >
          {siteConfig.author}
        </div>

        <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.4, color: "#8e98ab", maxWidth: 960 }}>
          Node.js • Express.js • TypeScript • PostgreSQL • Prisma • Next.js
        </div>

        <div style={{ marginTop: 50, display: "flex", gap: 18 }}>
          {["REST APIs", "Authentication", "Database Design"].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(94,234,212,0.45)",
                borderRadius: 999,
                padding: "14px 24px",
                fontSize: 22,
                color: "#5eead4"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize
  );
}

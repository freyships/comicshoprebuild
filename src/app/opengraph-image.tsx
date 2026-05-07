import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Comic Book Store Finder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fdf6e3",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(20,17,15,0.08) 1px, transparent 0)",
          backgroundSize: "14px 14px",
          padding: 80,
          color: "#14110f",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#d2342f",
            marginBottom: 30,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>★ ISSUE 001 ★ EST. 2024 ★</div>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: 130,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -2,
            marginBottom: 30,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>Comic Book</div>
          <div style={{ display: "flex" }}>
            Stores in
            <span style={{ color: "#d2342f", marginLeft: 28 }}>America.</span>
          </div>
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: 36,
            color: "#6b625a",
            fontStyle: "italic",
            display: "flex",
            maxWidth: 950,
          }}
        >
          A coast to coast directory of every brick and mortar comic shop.
          Hand cataloged.
        </div>

        {/* Number panel — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            background: "#fcd34d",
            border: "5px solid #14110f",
            boxShadow: "12px 12px 0 0 #14110f",
            padding: "30px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "rotate(-3deg)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              display: "flex",
            }}
          >
            Cataloged
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              display: "flex",
            }}
          >
            2,495
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              display: "flex",
            }}
          >
            Comic Shops
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            display: "flex",
          }}
        >
          comicbookstores.co
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fdf6e3",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            background: "#d2342f",
            border: "8px solid #14110f",
            boxShadow: "10px 10px 0 0 #14110f",
            transform: "rotate(-3deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 64,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          CB
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
            width: 50,
            height: 50,
            background: "#d2342f",
            border: "3px solid #14110f",
            boxShadow: "3px 3px 0 0 #14110f",
            transform: "rotate(-3deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 22,
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

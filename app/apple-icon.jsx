import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** App icon: the brand green with a bold "S" and a citrus leaf, legible at 16 px. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14684f", borderRadius: 40, position: "relative" }}>
        <div style={{ fontSize: 128, fontWeight: 900, color: "white", lineHeight: 1, marginTop: -8 }}>S</div>
        <div style={{ position: "absolute", top: 24, right: 32, width: 34, height: 34, borderRadius: "34px 0 34px 0", background: "#f7a325" }} />
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** App icon: the brand green with a bold "S" and a citrus leaf, legible at 16 px. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14684f", borderRadius: 112, position: "relative" }}>
        <div style={{ fontSize: 360, fontWeight: 900, color: "white", lineHeight: 1, marginTop: -20 }}>S</div>
        <div style={{ position: "absolute", top: 70, right: 92, width: 92, height: 92, borderRadius: "92px 0 92px 0", background: "#f7a325" }} />
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";

export const alt = "SwiftGrocers | Skip the market. Keep the freshness.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page that doesn't set its own image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #0c3b2d 0%, #14684f 100%)", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "white", color: "#14684f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900 }}>S</div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>SwiftGrocers</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2 }}>Skip the market.</div>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2, color: "#f7a325" }}>Keep the freshness.</div>
          <div style={{ marginTop: 28, fontSize: 32, opacity: 0.85 }}>Foodstuff delivered in under 2 hours · Pay on delivery</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 26, fontWeight: 700 }}>
          {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((city) => (
            <div key={city} style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.14)" }}>{city}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}

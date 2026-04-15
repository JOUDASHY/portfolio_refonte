import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nilsen Tovohery – Développeur Full-Stack & Admin Sys";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#000b31",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background circles */}
        <div style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "rgba(246,140,9,0.12)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px",
          width: "350px", height: "350px",
          borderRadius: "50%",
          background: "rgba(246,140,9,0.08)",
          display: "flex",
        }} />

        {/* Orange accent bar left */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "8px",
          background: "#f68c09",
          display: "flex",
        }} />

        {/* Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          flex: 1,
        }}>
          {/* Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}>
            <div style={{
              width: "10px", height: "10px",
              borderRadius: "50%",
              background: "#f68c09",
              display: "flex",
            }} />
            <span style={{
              color: "#f68c09",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}>
              Portfolio
            </span>
          </div>

          {/* Name */}
          <div style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "16px",
            display: "flex",
          }}>
            Nilsen Tovohery
          </div>

          {/* Title */}
          <div style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "40px",
            display: "flex",
          }}>
            Développeur Full-Stack &amp; Administrateur Système
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["React", "Next.js", "Node.js", "DevOps", "Madagascar"].map((tag) => (
              <div key={tag} style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(246,140,9,0.4)",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                display: "flex",
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right side — logo circle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px 60px 0",
        }}>
          <div style={{
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "#f68c09",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
            fontWeight: 800,
            color: "#000b31",
          }}>
            N
          </div>
        </div>

        {/* Bottom URL */}
        <div style={{
          position: "absolute",
          bottom: "28px",
          right: "80px",
          color: "rgba(255,255,255,0.3)",
          fontSize: "14px",
          display: "flex",
        }}>
          portfolio-nilsen.unityfianar.site
        </div>
      </div>
    ),
    { ...size }
  );
}

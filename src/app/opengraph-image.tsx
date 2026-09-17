import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#142B3B",
          color: "#F7F8F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, color: "#D96B49", display: "flex" }}>
          {siteConfig.brandName}
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 24, lineHeight: 1.15, display: "flex" }}>
          Connect your IT expertise with the right buyers.
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#DCE4DF", display: "flex" }}>
          {siteConfig.descriptor}
        </div>
      </div>
    ),
    { ...size }
  );
}

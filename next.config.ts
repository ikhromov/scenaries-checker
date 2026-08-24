import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS — drop the `out/` folder on any host (S3, nginx, Pages).
  output: "export",
  images: { unoptimized: true },
  // The dev server binds to 0.0.0.0 so the preview is reachable by IP, which makes
  // Next treat loopback hosts as cross-origin and serve /_next/* with a 403 —
  // that blocks hydration entirely and the page silently stops responding to clicks.
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0", "[::1]"],
};

export default nextConfig;

import type { NextConfig } from "next";

// Static export for Hostinger's Single (shared) plan, which cannot run Node.
// Consequences, all deliberate — see README → Deployment:
//   - `src/app/api/*` is removed on this branch; route handlers need a server.
//   - next/image must use the unoptimized loader (no image optimizer at runtime).
//   - trailingSlash emits `/about/index.html`, which Apache serves directly.
// Reverting to a Node host means reverting this branch, not editing this file.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

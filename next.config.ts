import type { NextConfig } from "next";

// Lives at www.claudemalaysia.com/aiday: the main site rewrites /aiday and
// /aiday/* here, so every page, API route, asset and /_next file of this app
// sits under /aiday.
const nextConfig: NextConfig = {
  basePath: "/aiday",
};

export default nextConfig;

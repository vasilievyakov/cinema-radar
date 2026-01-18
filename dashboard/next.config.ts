import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: isGitHubPages ? "/cinema-radar" : "",
  assetPrefix: isGitHubPages ? "/cinema-radar/" : "",
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;

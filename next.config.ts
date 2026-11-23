import type { NextConfig } from "next"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
    ],
  },
  async rewrites() {
    // Proxy every client API call to the backend so auth cookies are issued
    // on this app's own origin (first-party). This avoids third-party cookie
    // blocking and CORS credential issues when client and backend live on
    // different Vercel subdomains. `beforeFiles` takes precedence over the
    // local app/api catch-all route.
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${API_URL}/api/:path*`,
        },
      ],
    }
  },
}

export default nextConfig

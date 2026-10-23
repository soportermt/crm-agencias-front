/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/api-connectivity/:path*",
              destination: "https://ia.rutamayatravel.com/:path*",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;

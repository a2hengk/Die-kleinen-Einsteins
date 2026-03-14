import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH,
  //output: "export",
  reactStrictMode: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

export default {
  output: "export",
  reactStrictMode: true,
  basePath: isProd ? "/keep_going_frontend" : "",
  assetPrefix: isProd ? "/keep_going_frontend/" : "",
  images: { unoptimized: true },
};
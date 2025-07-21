/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isCustomDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN === "true";

export default {
  output: "export",
  reactStrictMode: true,
  basePath: isProd && !isCustomDomain ? "/keep_going_frontend" : "",
  assetPrefix: isProd && !isCustomDomain ? "/keep_going_frontend/" : "",
  images: { unoptimized: true },
};
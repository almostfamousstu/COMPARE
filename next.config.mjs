import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  }
};

export default nextConfig;

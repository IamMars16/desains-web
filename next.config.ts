import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El doble montaje de StrictMode en desarrollo fuerza la perdida del contexto WebGL del Canvas.
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
  },
  poweredByHeader: false,
};

export default nextConfig;

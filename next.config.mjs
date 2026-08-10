/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
    ],
    // Matches the breakpoints the product grid actually renders at, so the
    // optimizer is not asked for sizes nothing requests.
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 180, 256, 384],
    formats: ["image/avif", "image/webp"],
  },

  // /categories was retired in favour of a single browse experience at /shop.
  async redirects() {
    return [
      { source: "/categories", destination: "/shop", permanent: true },
      { source: "/categories/:slug", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;

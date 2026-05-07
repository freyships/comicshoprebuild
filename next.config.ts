import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comicbookstores.co",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "emqchoyebasrvokttjaw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy WordPress / GeoDirectory listing URLs → state hub
      { source: "/listing/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/place/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/places/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/store/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      // Old comic-shop city / zip URLs (used during early build) → hub
      { source: "/comic-shop/city/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/comic-shop/zip/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/comic-shop/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      // GeoDirectory search/category URLs
      { source: "/comic-book-store-finder/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/category/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/tag/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
      { source: "/author/:slug*", destination: "/find-comic-shops-by-state/", permanent: true },
    ];
  },
};

export default nextConfig;

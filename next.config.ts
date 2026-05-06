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
};

export default nextConfig;

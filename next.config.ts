import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
    },
    experimental: {
        reactCompiler: true,
    },
};

export default nextConfig;

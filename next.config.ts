import type { NextConfig } from "next";

/**
 * Generates cache control headers in Next.js-ready format
 */
function generateCacheHeaders(
    time: number,
    staleWhileRevalidate?: number,
    staleIfError: number = 0
): Array<{ key: string; value: string }> {
    const swr = staleWhileRevalidate ?? Math.round(time * 2);
    const cacheControl = `public, max-age=${time}, stale-while-revalidate=${swr}, stale-if-error=${staleIfError}`;

    return [
        { key: "Cache-Control", value: cacheControl },
        { key: "CDN-Cache-Control", value: cacheControl },
    ];
}

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
    },
    experimental: {
        reactCompiler: true,
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: generateCacheHeaders(3600, 86400),
            },
            {
                source: "/:all*(jpg|jpeg|png|webp|avif|gif|svg)",
                headers: generateCacheHeaders(86400),
            },
        ];
    },
};

export default nextConfig;

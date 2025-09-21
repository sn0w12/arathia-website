import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { TransitionProvider } from "@/contexts/transition-context";
import { isDevelopment } from "@/lib/util";

const noiseImages = [
    "/textures/noise/noise_spritesheet_0000.webp",
    ...Array.from(
        { length: 30 },
        (_, i) =>
            `/textures/noise/noise_spritesheet_${(i + 20)
                .toString()
                .padStart(4, "0")}.webp`
    ),
];

const juana = localFont({
    src: [
        {
            path: "../fonts/juana-black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../fonts/juana-bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/juana-regular.ttf",
            weight: "400",
            style: "normal",
        },
    ],
});

export const metadata: Metadata = {
    title: "Arathia",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {isDevelopment && (
                    // eslint-disable-next-line @next/next/no-sync-scripts
                    <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
                )}
                {noiseImages.map((url) => (
                    <link
                        key={url}
                        rel="preload"
                        href={url}
                        as="image"
                        type="image/webp"
                    />
                ))}
            </head>
            <body className={`${juana.className} antialiased overflow-hidden`}>
                <TransitionProvider>{children}</TransitionProvider>
            </body>
        </html>
    );
}

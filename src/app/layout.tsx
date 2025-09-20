import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { TransitionProvider } from "@/contexts/transition-context";
import { isDevelopment } from "@/lib/util";

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
                    <script
                        src="https://unpkg.com/react-scan/dist/auto.global.js"
                        async
                    />
                )}
            </head>
            <body className={`${juana.className} antialiased overflow-hidden`}>
                <TransitionProvider>
                    <div className="font-[juana]">{children}</div>
                </TransitionProvider>
            </body>
        </html>
    );
}

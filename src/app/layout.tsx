import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { TransitionProvider } from "@/contexts/transition-context";

const juana = localFont({
    src: [
        {
            path: "../fonts/juana-black.otf",
            weight: "900",
            style: "normal",
        },
        {
            path: "../fonts/juana-bold.otf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/juana-regular.otf",
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
    const isDevelopment = process.env.NODE_ENV === "development";

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
                <TransitionProvider>{children}</TransitionProvider>
            </body>
        </html>
    );
}

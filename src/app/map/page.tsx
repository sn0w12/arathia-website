"use client";

import dynamic from "next/dynamic";
import { useTransition } from "@/contexts/transition-context";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { useEffect } from "react";

const MapClient = dynamic(() => import("@/components/map/map-client"), {
    ssr: false,
});

export default function MapPage() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();

    useEffect(() => {
        setIsOpen(false);
        const timer = setTimeout(() => setIsOpen(true), 0);
        return () => clearTimeout(timer);
    }, [setIsOpen]);

    return (
        <NoiseFade
            in={isOpen}
            scale={scale}
            duration={duration}
            className="fixed inset-0 h-screen"
        >
            <MapClient />
        </NoiseFade>
    );
}

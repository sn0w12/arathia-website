"use client";

import dynamic from "next/dynamic";
import { useTransition } from "@/contexts/transition-context";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const MapClient = dynamic(() => import("@/components/map/map-client"), {
    ssr: false,
});

function MapContent() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();
    const searchParams = useSearchParams();

    const initialMap = searchParams.get("map") || "Arathia";
    const initialMarkerId =
        searchParams.get("markerid") || searchParams.get("markerId") || null;

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
            <MapClient
                initialMap={initialMap}
                initialMarkerId={initialMarkerId}
            />
        </NoiseFade>
    );
}

export default function MapPage() {
    return (
        <Suspense fallback={<div className="bg-background" />}>
            <MapContent />
        </Suspense>
    );
}

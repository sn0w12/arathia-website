"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MapContextType {
    currentMap: string;
    setCurrentMap: (map: string) => void;
    activeOverlays: Record<string, boolean>;
    setActiveOverlays: (overlays: Record<string, boolean>) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context)
        throw new Error("useMapContext must be used within MapProvider");
    return context;
};

export const MapProvider = ({
    children,
    initialActiveOverlays,
}: {
    children: ReactNode;
    initialActiveOverlays: Record<string, boolean>;
}) => {
    const [currentMap, setCurrentMap] = useState("Arathia");
    const [activeOverlays, setActiveOverlays] = useState(initialActiveOverlays);

    return (
        <MapContext.Provider
            value={{
                currentMap,
                setCurrentMap,
                activeOverlays,
                setActiveOverlays,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};

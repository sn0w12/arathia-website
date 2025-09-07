import React, { useState, useEffect } from "react";
import { Cloud } from "./cloud";
import { clouds } from "@/lib/images";
import { cn, randomBetween } from "@/lib/util";

interface CloudData {
    id: number;
    image: (typeof clouds)[0];
    x: number;
    y: number;
    speed: number;
    direction: "left" | "right";
    fadeDuration: number;
    scale: number;
}

export const Sky: React.FC<{
    numClouds: number;
    percent?: number;
    className?: string;
    scale?: number;
}> = ({ numClouds, percent = 0.5, className, scale = 1 }) => {
    const [cloudList, setCloudList] = useState<CloudData[]>([]);

    useEffect(() => {
        const newClouds: CloudData[] = [];
        for (let i = 0; i < numClouds; i++) {
            const image = clouds[Math.floor(Math.random() * clouds.length)];
            newClouds.push({
                id: i,
                image,
                x: Math.random() * window.innerWidth,
                y: (i / numClouds) * (window.innerHeight * percent),
                speed: randomBetween(60, 120),
                direction: Math.random() > 0.5 ? "left" : "right",
                fadeDuration: randomBetween(2000, 7000),
                scale,
            });
        }
        setCloudList(newClouds);
    }, [numClouds, percent, scale]);

    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none",
                className
            )}
        >
            {cloudList.map((cloud) => (
                <Cloud key={cloud.id} {...cloud} />
            ))}
        </div>
    );
};

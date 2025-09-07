import React, { useState, useEffect } from "react";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { ImageInfo } from "@/lib/images";
import { randomBetween } from "@/lib/util";

interface CloudProps {
    image: ImageInfo;
    x: number;
    y: number;
    speed: number;
    direction: "left" | "right";
    fadeDuration: number;
    scale?: number;
}

export const Cloud: React.FC<CloudProps> = ({
    image,
    x,
    y,
    speed,
    direction,
    fadeDuration,
    scale = 1,
}) => {
    const [isVisible, setIsVisible] = useState(Math.random() > 0.5);
    const scaleValue = scale * 50;

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(Math.random() > 0.5);
        }, randomBetween(fadeDuration * 0.85, fadeDuration * 1.15));
        return () => clearInterval(interval);
    }, [fadeDuration]);

    return (
        <NoiseFade
            in={isVisible}
            scale={1}
            duration={1000}
            className="absolute"
        >
            <div
                className={`cloud-${direction} relative`}
                style={{
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: `${image.size[0]}px ${image.size[1]}px`,
                    backgroundPosition: `-${image.bbox[0]}px -${image.bbox[1]}px`,
                    width: `${image.bbox[2]}px`,
                    height: `${image.bbox[3]}px`,
                    left: `${x}px`,
                    top: `${y}px`,
                    animationDuration: `${speed}s`,
                    scale: `${scaleValue}%`,
                }}
            />
        </NoiseFade>
    );
};

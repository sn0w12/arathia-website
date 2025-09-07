"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { lightTextures, tightTextures, calculateScale } from "@/lib/images";
import { cn } from "@/lib/util";

export type TextureType = "light" | "tight";
interface TextProps extends React.ComponentProps<"span"> {
    textureType?: TextureType;
    interval?: number;
}

export function Text({
    children,
    className,
    textureType = "tight",
    interval = 300,
    ...props
}: TextProps) {
    const textures = textureType === "light" ? lightTextures : tightTextures;
    const [currentTexture, setCurrentTexture] = useState(
        () => textures[Math.floor(Math.random() * textures.length)]
    );
    const [renderScale, setRenderScale] = useState({ x: 1, y: 1 });
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (interval > 0) {
            const timer = setInterval(() => {
                setCurrentTexture(
                    textures[Math.floor(Math.random() * textures.length)]
                );
            }, interval);
            return () => clearInterval(timer);
        }
    }, [interval, textures]);

    useLayoutEffect(() => {
        if (ref.current && currentTexture) {
            const newScale = calculateScale(
                currentTexture,
                1,
                1,
                1,
                1,
                "default",
                ref
            );
            setRenderScale(newScale);
        }
    }, [currentTexture]);

    const texture = currentTexture;

    if (!texture) {
        return <span className={className}>{children}</span>;
    }

    const [x, y, ,] = texture.bbox;
    const [imageWidth, imageHeight] = texture.size;

    const style: React.CSSProperties = {
        backgroundImage: `url(${texture.url})`,
        backgroundSize: `${imageWidth * renderScale.x}px ${
            imageHeight * renderScale.y
        }px`,
        backgroundPosition: `-${x * renderScale.x}px -${y * renderScale.y}px`,
        backgroundRepeat: "no-repeat",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
    };

    return (
        <span
            ref={ref}
            className={cn("text-transparent inline-block", className)}
            style={style}
            {...props}
        >
            {children}
        </span>
    );
}

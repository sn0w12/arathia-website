"use client";

import { ImageInfo } from "@/lib/images";
import { cn } from "@/lib/util";
import { ImageBbox, NumberOrRange, Scale } from "./animated-bg";
import { forwardRef } from "react";

interface LayerConfig {
    images: ImageInfo[];
    count: number;
    scale?: Scale;
    color?: string;
    fitMode?: "default" | "fitHeight" | "fitWidth";
    rotation?: NumberOrRange;
    showChance?: number;
    align?: "center" | "left" | "right";
    offset?: NumberOrRange;
    animateScale?: boolean;
    className?: string;
}

interface CustomAnimatedBackgroundProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
    layers: LayerConfig[];
    interval?: number;
    hovered?: boolean;
    onHover?: (ref: React.RefObject<HTMLDivElement | null>) => void;
    onLeave?: () => void;
}

export const CustomAnimatedBackground = forwardRef<
    HTMLDivElement,
    CustomAnimatedBackgroundProps
>(
    (
        {
            children,
            layers,
            interval = 200,
            hovered,
            onHover,
            onLeave,
            className,
            ...props
        },
        ref
    ) => {
        const effectiveHovered = hovered ?? false;

        const handleMouseEnter = () => {
            if (onHover && ref && "current" in ref) {
                onHover(ref);
            }
        };
        const handleMouseLeave = () => {
            if (onLeave) {
                onLeave();
            }
        };

        const total = layers.reduce((sum, layer) => sum + layer.count, 0);

        let currentIndex = 0;

        return (
            <div
                ref={ref}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn("relative w-fit", className)}
                {...props}
            >
                <div className="z-10 relative">{children}</div>
                {layers.map((layer, layerIndex) => {
                    const layerElements = Array.from(
                        { length: layer.count },
                        (_, i) => {
                            const index = currentIndex + i;
                            return (
                                <ImageBbox
                                    key={`layer-${layerIndex}-${i}`}
                                    images={layer.images}
                                    interval={interval}
                                    isHovered={effectiveHovered}
                                    index={index}
                                    total={total}
                                    scale={layer.scale}
                                    className={
                                        effectiveHovered
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }
                                    color={layer.color || "white"}
                                    fitMode={layer.fitMode}
                                    rotation={layer.rotation}
                                    showChance={layer.showChance}
                                    align={layer.align}
                                    offset={layer.offset}
                                    animateScale={layer.animateScale}
                                />
                            );
                        }
                    );
                    currentIndex += layer.count;
                    return layerElements;
                })}
            </div>
        );
    }
);
CustomAnimatedBackground.displayName = "CustomAnimatedBackground";

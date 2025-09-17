"use client";

import {
    calculateScale,
    ImageInfo,
    images,
    lines,
    smallImages,
} from "@/lib/images";
import { cn } from "@/lib/util";
import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

const activeSprites = new Set<number>();

export type Range = { min: number; max: number };
export type NumberOrRange = number | Range;

export type Scale = NumberOrRange | { x: NumberOrRange; y: NumberOrRange };

function resolveScale(scale: Scale): { x: number; y: number } {
    if (typeof scale === "number") {
        return { x: scale, y: scale };
    }
    if ("x" in scale && "y" in scale) {
        const x =
            typeof scale.x === "number"
                ? scale.x
                : scale.x.min + Math.random() * (scale.x.max - scale.x.min);
        const y =
            typeof scale.y === "number"
                ? scale.y
                : scale.y.min + Math.random() * (scale.y.max - scale.y.min);
        return { x, y };
    }
    // Fallback for single ScaleValue
    const resolved =
        typeof scale === "number"
            ? scale
            : scale.min + Math.random() * (scale.max - scale.min);
    return { x: resolved, y: resolved };
}

interface AnimatedBackgroundProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
    className?: string;
    fg?: number;
    mg?: number;
    bg?: number;
    bgColor?: string;
    mgColor?: string;
    fgColor?: string;
    interval?: number;
    hovered?: boolean;
    onHover?: (ref: React.RefObject<HTMLDivElement | null>) => void;
    onLeave?: () => void;
}

export const AnimatedBackground = forwardRef<
    HTMLDivElement,
    AnimatedBackgroundProps
>(
    (
        {
            children,
            className,
            fg = 2,
            mg = 3,
            bg = 1,
            fgColor = "var(--color-accent-foreground)",
            mgColor = "var(--color-accent)",
            bgColor = "white",
            interval = 200,
            hovered,
            onHover,
            onLeave,
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

        const total = bg + mg + fg;

        return (
            <div
                ref={ref}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn("relative w-fit", className)}
                {...props}
            >
                <div className="z-10 relative">{children}</div>
                {Array.from({ length: bg }, (_, i) => (
                    <ImageBbox
                        key={`bg-${i}`}
                        images={images}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-100" : "opacity-0"
                        }
                        color={bgColor}
                        scale={{ x: 1.7, y: 2.2 }}
                    />
                ))}
                {Array.from({ length: bg }, (_, i) => (
                    <ImageBbox
                        key={`bg-${i}`}
                        images={lines}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-100" : "opacity-0"
                        }
                        color={bgColor}
                        scale={{ x: 1, y: 1 }}
                        fitMode="fitWidth"
                        rotation={{ min: -35, max: 35 }}
                        showChance={0.3}
                    />
                ))}
                {Array.from({ length: mg }, (_, i) => (
                    <ImageBbox
                        key={`mg-${i}`}
                        images={images}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={bg + i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-100" : "opacity-0"
                        }
                        color={mgColor}
                        scale={{ x: 1.5, y: 2 }}
                    />
                ))}
                {Array.from({ length: Math.floor(mg / 2) }, (_, i) => (
                    <ImageBbox
                        key={`mg-${i}`}
                        images={smallImages}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={bg + i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-100" : "opacity-0"
                        }
                        color={mgColor}
                        scale={{ x: 1.5, y: 1.5 }}
                        fitMode="fitHeight"
                        align="right"
                        showChance={0.3}
                    />
                ))}
                {Array.from({ length: Math.floor(mg / 2) }, (_, i) => (
                    <ImageBbox
                        key={`mg-${i}`}
                        images={lines}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={bg + i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-100" : "opacity-0"
                        }
                        color={mgColor}
                        scale={{ x: 1.5, y: 1 }}
                        fitMode="fitWidth"
                        rotation={{ min: -25, max: 25 }}
                        showChance={0.1}
                    />
                ))}
                {Array.from({ length: fg }, (_, i) => (
                    <ImageBbox
                        key={`fg-${i}`}
                        images={smallImages}
                        interval={interval}
                        isHovered={effectiveHovered}
                        index={bg + mg + i}
                        total={total}
                        className={
                            effectiveHovered ? "opacity-30" : "opacity-0"
                        }
                        color={fgColor}
                        scale={{ x: 1.5, y: 1.5 }}
                        fitMode="fitHeight"
                        offset={{ min: -30, max: 30 }}
                    />
                ))}
            </div>
        );
    }
);
AnimatedBackground.displayName = "AnimatedBackground";

export interface ImageBboxProps {
    images: ImageInfo[];
    interval: number;
    isHovered: boolean;
    index: number;
    total: number;
    scale?: Scale;
    className?: string;
    color?: string;
    fitMode?: "default" | "fitHeight" | "fitWidth";
    rotation?: NumberOrRange;
    showChance?: number;
    align?: "center" | "left" | "right";
    offset?: NumberOrRange;
    animateScale?: boolean;
}

const ImageBboxComponent = function ImageBbox(props: ImageBboxProps) {
    const {
        images,
        interval,
        isHovered,
        index,
        total,
        scale = 1.2,
        className,
        color = "white",
        fitMode = "default",
        rotation = 0,
        showChance = 1,
        align = "center",
        offset = 0,
        animateScale = true,
    } = props;

    const randomImage = useCallback((images: ImageInfo[]) => {
        return images[Math.floor(Math.random() * images.length)];
    }, []);

    const [currentImage, setCurrentImage] = useState(() => randomImage(images));
    const lastIndexRef = useRef(-1);
    const [flipH, setFlipH] = useState(1);
    const [flipV, setFlipV] = useState(1);
    const [internalScale, setInternalScale] = useState({ x: 0, y: 0 });
    const [scaleMultiplier, setScaleMultiplier] = useState(1);
    const [animationMultiplier, setAnimationMultiplier] = useState(1);
    const [transition, setTransition] = useState("none");
    const ref = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [x, y, w, h] = currentImage.bbox;
    const imageWidth = currentImage.size[0];
    const imageHeight = currentImage.size[1];
    const [currentRotation, setCurrentRotation] = useState(() => {
        if (typeof rotation === "number") return rotation;
        return rotation.min + Math.random() * (rotation.max - rotation.min);
    });
    const [currentOffset, setCurrentOffset] = useState(() => {
        if (typeof offset === "number") return offset;
        return offset.min + Math.random() * (offset.max - offset.min);
    });
    const [isShowing, setIsShowing] = useState(true);
    const resolvedScale = useMemo(() => resolveScale(scale), [scale]);

    const getRandomIndex = useCallback((images: ImageInfo[]) => {
        let newIndex;
        let attempts = 0;
        const maxAttempts = images.length * 2;

        do {
            newIndex = Math.floor(Math.random() * images.length);
            attempts++;
            if (attempts > maxAttempts) {
                break;
            }
        } while (
            (newIndex === lastIndexRef.current ||
                activeSprites.has(newIndex)) &&
            images.length > activeSprites.size
        );

        return newIndex;
    }, []);

    useEffect(() => {
        if (isHovered) {
            const initialDelay =
                (index / total) * interval + Math.random() * (interval * 0.1);
            const startTimer = setTimeout(() => {
                const changeImage = () => {
                    const newIndex = getRandomIndex(images);
                    const sprite = images[newIndex];
                    const newScaleMultiplier = Math.random() * 0.1 + 0.9;
                    const newFlipH = Math.random() < 0.333 ? -1 : 1;
                    const newFlipV = Math.random() < 0.333 ? -1 : 1;
                    const newRotation =
                        typeof rotation === "number"
                            ? rotation
                            : rotation.min +
                              Math.random() * (rotation.max - rotation.min);
                    const newOffset =
                        typeof offset === "number"
                            ? offset
                            : offset.min +
                              Math.random() * (offset.max - offset.min);

                    const newScale = calculateScale(
                        sprite,
                        resolvedScale,
                        newScaleMultiplier,
                        newFlipH,
                        newFlipV,
                        fitMode,
                        ref
                    );

                    activeSprites.delete(lastIndexRef.current);
                    activeSprites.add(newIndex);
                    lastIndexRef.current = newIndex;
                    setCurrentImage(sprite);
                    setFlipH(newFlipH);
                    setFlipV(newFlipV);
                    setScaleMultiplier(newScaleMultiplier);
                    setInternalScale(newScale);
                    setCurrentRotation(newRotation);
                    setCurrentOffset(newOffset);

                    // Disable transition, set to smaller scale instantly (only if animateScale)
                    if (animateScale) {
                        setTransition("none");
                        setAnimationMultiplier(0.99);
                        // Re-enable transition and animate to full scale
                        setTimeout(() => {
                            setTransition("transform 0.3s ease-out");
                            setAnimationMultiplier(1);
                        }, 10);
                    }

                    setIsShowing(Math.random() <= showChance);

                    const nextDelay =
                        interval + Math.random() * (interval * 0.1);
                    timerRef.current = setTimeout(changeImage, nextDelay);
                };

                changeImage();
            }, initialDelay);

            return () => {
                clearTimeout(startTimer);
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                activeSprites.delete(lastIndexRef.current);
            };
        } else {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            activeSprites.delete(lastIndexRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isHovered,
        interval,
        index,
        total,
        images,
        fitMode,
        rotation,
        offset,
        showChance,
        animateScale,
    ]);

    useEffect(() => {
        if (ref.current) {
            const parent = ref.current.parentElement as HTMLElement;
            if (parent) {
                const newScale = calculateScale(
                    currentImage,
                    resolvedScale,
                    scaleMultiplier,
                    flipH,
                    flipV,
                    fitMode,
                    ref
                );
                setTransition("none");
                setInternalScale(newScale);
                setTimeout(() => {
                    setTransition(
                        animateScale ? "transform 0.3s ease-out" : "none"
                    );
                }, 10);
            }
        }
    }, [
        w,
        h,
        scale,
        animateScale,
        currentImage.scale?.x,
        currentImage.scale?.y,
        scaleMultiplier,
        flipH,
        flipV,
        fitMode,
        currentImage,
        resolvedScale,
    ]);
    const leftPercent = align === "left" ? 0 : align === "right" ? 100 : 50;
    const translateXPercent =
        align === "left" ? 0 : align === "right" ? -100 : -50;

    return (
        <div
            ref={ref}
            className={cn(
                "mask-styles",
                isShowing ? className : `${className} opacity-0!`
            )}
            style={
                {
                    position: "absolute",
                    pointerEvents: "none",
                    top: "50%",
                    left: `calc(${leftPercent}% + ${currentOffset}%)`,
                    width: w,
                    height: h,
                    backgroundColor: color,
                    transform: `translate(${translateXPercent}%, -50%) scale(${
                        internalScale.x *
                        (animateScale ? animationMultiplier : 1)
                    }, ${
                        internalScale.y *
                        (animateScale ? animationMultiplier : 1)
                    }) rotate(${currentRotation}deg)`,
                    willChange: "transform, opacity",
                    transformOrigin:
                        align === "left"
                            ? "left center"
                            : align === "right"
                            ? "right center"
                            : "center",
                    zIndex: 0,
                    transition: transition,
                    "--mask-url": `url(${currentImage.url})`,
                    "--mask-size": `${imageWidth}px ${imageHeight}px`,
                    "--mask-position": `-${x}px -${y}px`,
                } as React.CSSProperties
            }
        />
    );
};

export const ImageBbox = memo(ImageBboxComponent, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

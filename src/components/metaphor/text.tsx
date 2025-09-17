"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useLayoutEffect,
    useCallback,
} from "react";
import { lightTextures, tightTextures, calculateScale } from "@/lib/images";
import { cn, isSafari } from "@/lib/util";

export type TextureType = "light" | "tight";
interface TextProps extends React.ComponentProps<"span"> {
    textColor?: string;
    textureType?: TextureType;
    interval?: number;
}

export function Text({
    children,
    textColor = "white",
    className,
    style,
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

    const internalStyle: React.CSSProperties = {
        color: textColor,
        ...style,
        "--mask-url": `url(${texture.url})`,
        "--mask-size": `${imageWidth * renderScale.x}px ${
            imageHeight * renderScale.y
        }px`,
        "--mask-position": `-${x * renderScale.x}px -${y * renderScale.y}px`,
    } as React.CSSProperties;

    return (
        <span
            ref={ref}
            className={cn("inline-block mask-styles", className)}
            style={internalStyle}
            {...props}
        >
            {children}
        </span>
    );
}

export type Points = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
interface ClippedTextProps extends Omit<React.ComponentProps<"div">, "ref"> {
    children: React.ReactNode;
    points: Points;
    fgColor?: string;
    bgColor?: string;
    className?: string;
}

export const ClippedText = React.forwardRef<HTMLDivElement, ClippedTextProps>(
    (
        {
            children,
            points,
            fgColor = "white",
            bgColor = "red",
            className,
            style,
            ...props
        },
        ref
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);
        const [clipPath, setClipPath] = useState<string>("");

        const setRefs = useCallback(
            (node: HTMLDivElement | null) => {
                internalRef.current = node;
                if (ref) {
                    if (typeof ref === "function") {
                        ref(node);
                    } else {
                        ref.current = node;
                    }
                }
            },
            [ref]
        );

        useEffect(() => {
            if (internalRef.current) {
                const [tlx, tly, trx, try_, brx, bry, blx, bly] = points;
                const polygon = `${tlx * 100}% ${tly * 100}%, ${trx * 100}% ${
                    try_ * 100
                }%, ${brx * 100}% ${bry * 100}%, ${blx * 100}% ${bly * 100}%`;
                setClipPath(`polygon(${polygon})`);
            }
        }, [points]);

        return (
            <div
                ref={setRefs}
                className={className}
                style={{
                    position: "relative",
                    display: "inline-block",
                    ...style,
                }}
                {...props}
            >
                <Text
                    textColor={bgColor}
                    style={{
                        position: "relative",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                    }}
                >
                    {children}
                </Text>
                <Text
                    textColor={fgColor}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        clipPath,
                    }}
                >
                    {children}
                </Text>
            </div>
        );
    }
);
ClippedText.displayName = "ClippedText";

"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { detect, type Browser } from "detect-browser";

interface NoiseFadeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    in: boolean;
    duration?: number;
    className?: string;
    unsupportedBrowsers?: (Browser | "bot" | "node" | "react-native")[];
}

type AnimationState = "hidden" | "entering" | "entered" | "exiting";

export function NoiseFade({
    children,
    in: inProp,
    duration = 1000,
    className,
    style,
    unsupportedBrowsers = ["ios", "safari"],
    ...props
}: NoiseFadeProps) {
    const [animationStage, setAnimationStage] =
        useState<AnimationState>("hidden");
    const browser = useMemo(() => {
        const detected = detect();
        return detected;
    }, []);
    const imageUrls = useMemo(
        () =>
            Array.from(
                { length: 50 },
                (_, i) =>
                    `/textures/noise/noise_spritesheet_${i
                        .toString()
                        .padStart(4, "0")}.webp`
            ),
        []
    );
    const enteringValues = useMemo(
        () =>
            [...Array(19).fill(imageUrls[0]), ...imageUrls.slice(20)].join(";"),
        [imageUrls]
    );

    const exitingValues = useMemo(
        () =>
            [
                ...imageUrls.slice(20).reverse(),
                ...Array(19).fill(imageUrls[0]),
            ].join(";"),
        [imageUrls]
    );

    const animationId = useId();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    const animateInHrefRef = useRef<SVGAnimateElement>(null);
    const animateOutHrefRef = useRef<SVGAnimateElement>(null);

    const startAnimations = (
        refs: React.RefObject<SVGAnimateElement | null>[]
    ) => {
        refs.forEach((ref) => {
            if (ref.current) {
                try {
                    ref.current.endElement();
                } catch {
                    // Ignore if not running
                }
                try {
                    ref.current.beginElement();
                } catch (e) {
                    console.warn("Animation start failed:", e);
                }
            }
        });
    };

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isMounted.current) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (inProp) {
            setAnimationStage("entering");

            startAnimations([animateInHrefRef]);

            timeoutRef.current = setTimeout(() => {
                if (isMounted.current) {
                    setAnimationStage("entered");
                }
            }, duration);
        } else {
            if (animationStage === "hidden") return;

            setAnimationStage("exiting");

            startAnimations([animateOutHrefRef]);

            timeoutRef.current = setTimeout(() => {
                if (isMounted.current) {
                    setAnimationStage("hidden");
                }
            }, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProp, duration]);

    if (browser && unsupportedBrowsers.includes(browser.name)) {
        return (
            <div
                style={{
                    opacity: inProp ? 1 : 0,
                    transition: `opacity ${duration}ms ease-in-out`,
                    ...style,
                }}
                className={className}
                {...props}
            >
                {children}
            </div>
        );
    }

    return (
        <>
            <svg
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 9998,
                    opacity: animationStage === "entering" ? 1 : 0,
                }}
            >
                <defs>
                    <mask id={`noiseMaskIn-${animationId}`}>
                        <image
                            href="/textures/noise/noise_spritesheet_0000.webp"
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="none"
                        >
                            <animate
                                ref={animateInHrefRef}
                                attributeName="href"
                                values={enteringValues}
                                dur={`${duration}ms`}
                                fill="freeze"
                                begin="indefinite"
                                restart="always"
                            />
                        </image>
                    </mask>
                </defs>
            </svg>

            {/* SVG for exit animation */}
            <svg
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    opacity: animationStage === "exiting" ? 1 : 0,
                }}
            >
                <defs>
                    <mask id={`noiseMaskOut-${animationId}`}>
                        <image
                            href="/textures/noise/noise_spritesheet_0049.webp"
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="none"
                        >
                            <animate
                                ref={animateOutHrefRef}
                                attributeName="href"
                                values={exitingValues}
                                dur={`${duration}ms`}
                                fill="freeze"
                                begin="indefinite"
                                restart="always"
                            />
                        </image>
                    </mask>
                </defs>
            </svg>

            {/* Content with animation mask */}
            <div
                style={{
                    mask:
                        animationStage === "entering" ||
                        animationStage === "entered"
                            ? `url(#noiseMaskIn-${animationId})`
                            : `url(#noiseMaskOut-${animationId})`,
                    WebkitMask:
                        animationStage === "entering" ||
                        animationStage === "entered"
                            ? `url(#noiseMaskIn-${animationId})`
                            : `url(#noiseMaskOut-${animationId})`,
                    opacity: animationStage !== "hidden" ? 1 : 0,
                    ...style,
                }}
                className={className}
                {...props}
            >
                {children}
            </div>
        </>
    );
}

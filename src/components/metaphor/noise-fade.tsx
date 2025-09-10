"use client";

import React, { useState, useRef, useEffect, useId } from "react";

interface NoiseFadeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    in: boolean;
    duration?: number;
    className?: string;
    scale?: number;
}

type AnimationState = "hidden" | "entering" | "entered" | "exiting";

export function NoiseFade({
    children,
    in: inProp,
    duration = 1000,
    className,
    scale = 1,
    style,
    ...props
}: NoiseFadeProps) {
    const [animationStage, setAnimationStage] =
        useState<AnimationState>("hidden");
    const animationId = useId();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    const animateInSlopeRef = useRef<SVGAnimateElement>(null);
    const animateInInterceptRef = useRef<SVGAnimateElement>(null);
    const animateOutSlopeRef = useRef<SVGAnimateElement>(null);
    const animateOutInterceptRef = useRef<SVGAnimateElement>(null);

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
            }
        });

        requestAnimationFrame(() => {
            refs.forEach((ref) => {
                if (ref.current && isMounted.current) {
                    try {
                        ref.current.beginElement();
                    } catch (e) {
                        console.warn("Animation start failed:", e);
                    }
                }
            });
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

            startAnimations([animateInSlopeRef, animateInInterceptRef]);

            timeoutRef.current = setTimeout(() => {
                if (isMounted.current) {
                    setAnimationStage("entered");
                }
            }, duration);
        } else {
            if (animationStage === "hidden") return;

            setAnimationStage("exiting");

            startAnimations([animateOutSlopeRef, animateOutInterceptRef]);

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

    const baseFrequency = 0.02 * scale;
    return (
        <>
            {/* SVG for enter animation */}
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
                    transition: `opacity ${duration}ms ease-in-out`,
                }}
            >
                <defs>
                    <filter id={`maskFilterIn-${animationId}`}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={baseFrequency}
                            numOctaves="3"
                            seed="1"
                            result="noise"
                        />
                        <feComponentTransfer in="noise">
                            <feFuncA type="linear" slope="0" intercept="-5">
                                <animate
                                    ref={animateInSlopeRef}
                                    id={`animateIn-${animationId}`}
                                    attributeName="slope"
                                    from="0"
                                    to="15"
                                    dur={`${duration}ms`}
                                    fill="freeze"
                                    begin="indefinite"
                                    restart="always"
                                />
                                <animate
                                    ref={animateInInterceptRef}
                                    id={`animateInIntercept-${animationId}`}
                                    attributeName="intercept"
                                    from="-5"
                                    to="0"
                                    dur={`${duration}ms`}
                                    fill="freeze"
                                    begin="indefinite"
                                    restart="always"
                                />
                            </feFuncA>
                        </feComponentTransfer>
                    </filter>
                    <mask id={`noiseMaskIn-${animationId}`}>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            filter={`url(#maskFilterIn-${animationId}) brightness(10)`}
                            fill="white"
                        />
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
                    transition: `opacity ${duration}ms ease-in-out`,
                }}
            >
                <defs>
                    <filter id={`maskFilterOut-${animationId}`}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={baseFrequency}
                            numOctaves="3"
                            seed="1"
                            result="noise"
                        />
                        <feComponentTransfer in="noise">
                            <feFuncA type="linear" slope="15" intercept="0">
                                <animate
                                    ref={animateOutSlopeRef}
                                    id={`animateOut-${animationId}`}
                                    attributeName="slope"
                                    from="15"
                                    to="0"
                                    dur={`${duration}ms`}
                                    fill="freeze"
                                    begin="indefinite"
                                    restart="always"
                                />
                                <animate
                                    ref={animateOutInterceptRef}
                                    id={`animateOutIntercept-${animationId}`}
                                    attributeName="intercept"
                                    from="0"
                                    to="-5"
                                    dur={`${duration}ms`}
                                    fill="freeze"
                                    begin="indefinite"
                                    restart="always"
                                />
                            </feFuncA>
                        </feComponentTransfer>
                    </filter>
                    <mask id={`noiseMaskOut-${animationId}`}>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            filter={`url(#maskFilterOut-${animationId}) brightness(10)`}
                            fill="white"
                        />
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

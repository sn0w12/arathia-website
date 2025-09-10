import { forwardRef } from "react";
import { cn } from "@/lib/util";
import { AnimatedBackground } from "../metaphor/animated-bg";
import { Text, TextureType } from "../metaphor/text";
import { TransitionLink } from "../transition-link";

interface AnimatedLinkProps {
    text: string;
    href: string;
    className?: string;
    children?: React.ReactNode;
    selected?: boolean;
    textureType?: TextureType;
    onHover?: (ref: React.RefObject<HTMLDivElement | null>) => void;
    onLeave?: () => void;
}

export const AnimatedLink = forwardRef<HTMLDivElement, AnimatedLinkProps>(
    (
        {
            text,
            href,
            className,
            children,
            selected,
            textureType = "tight",
            onHover,
            onLeave,
        },
        ref
    ) => {
        return (
            <AnimatedBackground
                ref={ref}
                onHover={onHover}
                onLeave={onLeave}
                hovered={selected}
            >
                <Text
                    className={cn("font-black text-8xl", className)}
                    textureType={textureType}
                >
                    <TransitionLink href={href}>{text}</TransitionLink>
                </Text>
                {children}
            </AnimatedBackground>
        );
    }
);

AnimatedLink.displayName = "AnimatedLink";

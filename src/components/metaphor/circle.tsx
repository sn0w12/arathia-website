import Image from "next/image";

import xxSmallCircle from "../../../public/circles/xxSmallCircle.webp";
import xSmallCircle from "../../../public/circles/xSmallCircle.webp";
import smallCircle from "../../../public/circles/smallCircle.webp";
import mediumCircle from "../../../public/circles/mediumCircle.webp";
import largeCircle from "../../../public/circles/largeCircle.webp";

interface CircleProps {
    size?: "2xs" | "xs" | "sm" | "md" | "lg";
    className?: string;
    spinDuration?: number;
}

const circles = {
    "2xs": xxSmallCircle,
    xs: xSmallCircle,
    sm: smallCircle,
    md: mediumCircle,
    lg: largeCircle,
};

export function Circle({ size = "sm", className, spinDuration }: CircleProps) {
    const imageSrc = circles[size];
    const spinClass = spinDuration ? "spin-absolute" : "";
    const spinStyle = spinDuration
        ? ({ ["--spin-duration"]: `${spinDuration}s` } as React.CSSProperties)
        : undefined;
    return (
        <Image
            className={`${className} ${spinClass} pointer-events-none`}
            src={imageSrc}
            alt={`Circle ${size}`}
            style={spinStyle}
        />
    );
}

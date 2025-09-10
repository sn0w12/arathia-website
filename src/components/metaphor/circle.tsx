import Image from "next/image";
import { motion } from "framer-motion";

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
    return (
        <motion.div
            className={`${className} pointer-events-none`}
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
            }}
            initial={{ x: "-50%", y: "-50%" }}
            animate={spinDuration ? { rotate: 360 } : {}}
            transition={
                spinDuration
                    ? {
                          duration: spinDuration,
                          repeat: Infinity,
                          ease: "linear",
                      }
                    : {}
            }
        >
            <Image src={imageSrc} alt={`Circle ${size}`} />
        </motion.div>
    );
}

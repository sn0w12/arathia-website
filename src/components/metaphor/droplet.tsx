import { useEffect } from "react";
import { Circle } from "./circle";

interface DropletProps {
    x: number;
    y: number;
    duration?: number;
    onComplete?: () => void;
}

export function Droplet({ x, y, duration = 1000, onComplete }: DropletProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div
            className={`fixed size-4 expand`}
            style={
                {
                    left: x,
                    top: y,
                    opacity: 1,
                    transform: `translate(-50%, -50%) rotate(${
                        Math.random() * 360
                    }deg)`,
                    "--expand-duration": `${duration}ms`,
                } as React.CSSProperties
            }
        >
            <Circle size="md" />
        </div>
    );
}

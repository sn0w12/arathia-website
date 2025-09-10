import { ImageBbox } from "./animated-bg";
import { lines } from "@/lib/images";
import { cn } from "@/lib/util";

interface DividerProps {
    scale?: { x: number; y: number };
    color?: string;
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export function Divider({
    className,
    color = "white",
    scale = { x: 1.2, y: 1 },
    orientation = "horizontal",
}: DividerProps) {
    return (
        <div
            className={cn("relative h-1", className)}
            style={{
                rotate: orientation === "horizontal" ? "0deg" : "90deg",
            }}
        >
            <ImageBbox
                images={lines}
                color={color}
                interval={200}
                isHovered={true}
                index={0}
                total={1}
                className="opacity-100"
                scale={scale}
                animateScale={false}
            />
        </div>
    );
}

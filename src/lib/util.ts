import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { playSound } from "./audio";

export const isDevelopment = process.env.NODE_ENV === "development";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function handleHover(
    index: number,
    ref: React.RefObject<HTMLDivElement | null>,
    setDroplets: React.Dispatch<
        React.SetStateAction<Array<{ id: number; x: number; y: number }>>
    >,
    setSelected: React.Dispatch<React.SetStateAction<number>>
) {
    playSound("2.mp3");
    if (ref.current) {
        const targetRect = ref.current.getBoundingClientRect();
        let x = targetRect.left + targetRect.width / 2;
        let y = targetRect.top + targetRect.height / 2;

        const offset = 15;
        x += (Math.random() - 0.5) * 2 * offset;
        y += (Math.random() - 0.5) * 2 * offset;
        setDroplets((prev) => [...prev, { id: Date.now(), x, y }]);
    }
    setSelected(index);
}

export function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

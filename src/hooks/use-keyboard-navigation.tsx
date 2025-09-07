import { useEffect } from "react";

interface UseKeyboardNavigationProps {
    selected: number;
    setSelected: (index: number) => void;
    maxIndex: number;
    minIndex?: number;
    onHover: (index: number) => void;
    onEnter: () => void;
}

export function useKeyboardNavigation({
    selected,
    setSelected,
    maxIndex,
    minIndex = 0,
    onHover,
    onEnter,
}: UseKeyboardNavigationProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" && selected > minIndex) {
                const newSelected = selected - 1;
                setSelected(newSelected);
                onHover(newSelected);
            } else if (e.key === "ArrowDown" && selected < maxIndex) {
                const newSelected = selected + 1;
                setSelected(newSelected);
                onHover(newSelected);
            } else if (e.key === "Enter") {
                onEnter();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selected, setSelected, maxIndex, minIndex, onHover, onEnter]);
}

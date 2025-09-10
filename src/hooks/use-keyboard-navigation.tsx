import { useEffect, useRef, useState } from "react";

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
    const prevGamepadState = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number | undefined>(undefined);
    const lastTriggerUp = useRef<number>(0);
    const lastTriggerDown = useRef<number>(0);
    const initialTriggerUp = useRef<number>(0);
    const initialTriggerDown = useRef<number>(0);
    const [isUsingController, setIsUsingController] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem("isUsingController");
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });

    const INITIAL_DELAY = 500;
    const REPEAT_INTERVAL = 100;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setIsUsingController(false);
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

        const handleGamepad = () => {
            const gamepads = navigator.getGamepads();
            for (const gamepad of gamepads) {
                if (gamepad) {
                    const now = Date.now();

                    // D-pad up (button 12)
                    if (gamepad.buttons[12]?.pressed) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["buttonUp"]) {
                            if (selected > minIndex) {
                                const newSelected = selected - 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            initialTriggerUp.current = now;
                            lastTriggerUp.current = now;
                        } else if (
                            now - initialTriggerUp.current > INITIAL_DELAY &&
                            now - lastTriggerUp.current > REPEAT_INTERVAL
                        ) {
                            if (selected > minIndex) {
                                const newSelected = selected - 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            lastTriggerUp.current = now;
                        }
                        prevGamepadState.current["buttonUp"] = true;
                    } else {
                        prevGamepadState.current["buttonUp"] = false;
                    }

                    // Joystick up (axis 1 negative)
                    if (gamepad.axes[1] < -0.5) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["axisUp"]) {
                            if (selected > minIndex) {
                                const newSelected = selected - 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            initialTriggerUp.current = now;
                            lastTriggerUp.current = now;
                        } else if (
                            now - initialTriggerUp.current > INITIAL_DELAY &&
                            now - lastTriggerUp.current > REPEAT_INTERVAL
                        ) {
                            if (selected > minIndex) {
                                const newSelected = selected - 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            lastTriggerUp.current = now;
                        }
                        prevGamepadState.current["axisUp"] = true;
                    } else {
                        prevGamepadState.current["axisUp"] = false;
                    }

                    // D-pad down (button 13)
                    if (gamepad.buttons[13]?.pressed) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["buttonDown"]) {
                            if (selected < maxIndex) {
                                const newSelected = selected + 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            initialTriggerDown.current = now;
                            lastTriggerDown.current = now;
                        } else if (
                            now - initialTriggerDown.current > INITIAL_DELAY &&
                            now - lastTriggerDown.current > REPEAT_INTERVAL
                        ) {
                            if (selected < maxIndex) {
                                const newSelected = selected + 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            lastTriggerDown.current = now;
                        }
                        prevGamepadState.current["buttonDown"] = true;
                    } else {
                        prevGamepadState.current["buttonDown"] = false;
                    }

                    // Joystick down (axis 1 positive)
                    if (gamepad.axes[1] > 0.5) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["axisDown"]) {
                            if (selected < maxIndex) {
                                const newSelected = selected + 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            initialTriggerDown.current = now;
                            lastTriggerDown.current = now;
                        } else if (
                            now - initialTriggerDown.current > INITIAL_DELAY &&
                            now - lastTriggerDown.current > REPEAT_INTERVAL
                        ) {
                            if (selected < maxIndex) {
                                const newSelected = selected + 1;
                                setSelected(newSelected);
                                onHover(newSelected);
                            }
                            lastTriggerDown.current = now;
                        }
                        prevGamepadState.current["axisDown"] = true;
                    } else {
                        prevGamepadState.current["axisDown"] = false;
                    }

                    // A button (button 0)
                    if (
                        gamepad.buttons[0].pressed &&
                        !prevGamepadState.current["a"]
                    ) {
                        setIsUsingController(true);
                        onEnter();
                        prevGamepadState.current["a"] = true;
                    } else if (!gamepad.buttons[0].pressed) {
                        prevGamepadState.current["a"] = false;
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(handleGamepad);
        };

        window.addEventListener("keydown", handleKeyDown);
        handleGamepad();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [selected, setSelected, maxIndex, minIndex, onHover, onEnter]);

    useEffect(() => {
        sessionStorage.setItem(
            "isUsingController",
            JSON.stringify(isUsingController)
        );
    }, [isUsingController]);

    return isUsingController;
}

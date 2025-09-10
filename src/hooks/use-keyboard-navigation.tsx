import { useEffect, useRef, useState } from "react";

interface UseKeyboardNavigationProps {
    onUp: () => void;
    onDown: () => void;
    onLeft: () => void;
    onRight: () => void;
    onEnter: () => void;
}

export function useKeyboardNavigation({
    onUp,
    onDown,
    onLeft,
    onRight,
    onEnter,
}: UseKeyboardNavigationProps) {
    const prevGamepadState = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number | undefined>(undefined);
    const lastTriggerUp = useRef<number>(0);
    const lastTriggerDown = useRef<number>(0);
    const initialTriggerUp = useRef<number>(0);
    const initialTriggerDown = useRef<number>(0);
    const lastTriggerLeft = useRef<number>(0);
    const lastTriggerRight = useRef<number>(0);
    const initialTriggerLeft = useRef<number>(0);
    const initialTriggerRight = useRef<number>(0);
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
            if (e.key === "ArrowUp") {
                e.preventDefault();
                onUp();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                onDown();
            } else if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                onLeft();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                onRight();
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
                            onUp();
                            initialTriggerUp.current = now;
                            lastTriggerUp.current = now;
                        } else if (
                            now - initialTriggerUp.current > INITIAL_DELAY &&
                            now - lastTriggerUp.current > REPEAT_INTERVAL
                        ) {
                            onUp();
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
                            onUp();
                            initialTriggerUp.current = now;
                            lastTriggerUp.current = now;
                        } else if (
                            now - initialTriggerUp.current > INITIAL_DELAY &&
                            now - lastTriggerUp.current > REPEAT_INTERVAL
                        ) {
                            onUp();
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
                            onDown();
                            initialTriggerDown.current = now;
                            lastTriggerDown.current = now;
                        } else if (
                            now - initialTriggerDown.current > INITIAL_DELAY &&
                            now - lastTriggerDown.current > REPEAT_INTERVAL
                        ) {
                            onDown();
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
                            onDown();
                            initialTriggerDown.current = now;
                            lastTriggerDown.current = now;
                        } else if (
                            now - initialTriggerDown.current > INITIAL_DELAY &&
                            now - lastTriggerDown.current > REPEAT_INTERVAL
                        ) {
                            onDown();
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

                    // D-pad left (button 14)
                    if (gamepad.buttons[14]?.pressed) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["buttonLeft"]) {
                            onLeft();
                            initialTriggerLeft.current = now;
                            lastTriggerLeft.current = now;
                        } else if (
                            now - initialTriggerLeft.current > INITIAL_DELAY &&
                            now - lastTriggerLeft.current > REPEAT_INTERVAL
                        ) {
                            onLeft();
                            lastTriggerLeft.current = now;
                        }
                        prevGamepadState.current["buttonLeft"] = true;
                    } else {
                        prevGamepadState.current["buttonLeft"] = false;
                    }

                    // Joystick left (axis 0 negative)
                    if (gamepad.axes[0] < -0.5) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["axisLeft"]) {
                            onLeft();
                            initialTriggerLeft.current = now;
                            lastTriggerLeft.current = now;
                        } else if (
                            now - initialTriggerLeft.current > INITIAL_DELAY &&
                            now - lastTriggerLeft.current > REPEAT_INTERVAL
                        ) {
                            onLeft();
                            lastTriggerLeft.current = now;
                        }
                        prevGamepadState.current["axisLeft"] = true;
                    } else {
                        prevGamepadState.current["axisLeft"] = false;
                    }

                    // D-pad right (button 15)
                    if (gamepad.buttons[15]?.pressed) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["buttonRight"]) {
                            onRight();
                            initialTriggerRight.current = now;
                            lastTriggerRight.current = now;
                        } else if (
                            now - initialTriggerRight.current > INITIAL_DELAY &&
                            now - lastTriggerRight.current > REPEAT_INTERVAL
                        ) {
                            onRight();
                            lastTriggerRight.current = now;
                        }
                        prevGamepadState.current["buttonRight"] = true;
                    } else {
                        prevGamepadState.current["buttonRight"] = false;
                    }

                    // Joystick right (axis 0 positive)
                    if (gamepad.axes[0] > 0.5) {
                        setIsUsingController(true);
                        if (!prevGamepadState.current["axisRight"]) {
                            onRight();
                            initialTriggerRight.current = now;
                            lastTriggerRight.current = now;
                        } else if (
                            now - initialTriggerRight.current > INITIAL_DELAY &&
                            now - lastTriggerRight.current > REPEAT_INTERVAL
                        ) {
                            onRight();
                            lastTriggerRight.current = now;
                        }
                        prevGamepadState.current["axisRight"] = true;
                    } else {
                        prevGamepadState.current["axisRight"] = false;
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
    }, [onUp, onDown, onLeft, onRight, onEnter]);

    useEffect(() => {
        sessionStorage.setItem(
            "isUsingController",
            JSON.stringify(isUsingController)
        );
    }, [isUsingController]);

    return isUsingController;
}

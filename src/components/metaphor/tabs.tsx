import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    createContext,
    useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/audio";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { CustomAnimatedBackground } from "./custom-animated-bg";
import { lightTextures } from "@/lib/images";

interface TabAnimationContext {
    isExiting: boolean;
    isEntering: boolean;
    direction: number;
    staggerDelay: number;
}

const TabAnimationContext = createContext<TabAnimationContext>({
    isExiting: false,
    isEntering: false,
    direction: 0,
    staggerDelay: 10,
});

export const useTabAnimation = () => useContext(TabAnimationContext);

interface TabSystemOptions {
    tabButtonClass?: string;
    activeTabClass?: string;
    pageClass?: string;
    pageAttribute?: string;
    staggerDelay?: number;
    onTabChange?: (activeIndex: number, previousIndex: number) => void;
    itemSelector?: string;
    itemUnderlineSelector?: string[];
}

interface TabSystemProps {
    options?: TabSystemOptions;
    tabCount: number;
    labelFormatter?: (i: number) => string;
    children: React.ReactNode[];
}

const defaultOptions: Required<TabSystemOptions> = {
    tabButtonClass: "tab-button",
    activeTabClass: "active",
    pageClass: "page",
    pageAttribute: "data-page-index",
    staggerDelay: 10,
    onTabChange: () => {},
    itemSelector: ".item",
    itemUnderlineSelector: [".item-underline"],
};

export const TabSystem: React.FC<TabSystemProps> = ({
    options = {},
    tabCount,
    labelFormatter = (i) => (i + 1).toString(),
    children,
}) => {
    const opts = useMemo(() => ({ ...defaultOptions, ...options }), [options]);
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    const [animationPhase, setAnimationPhase] = useState<
        "entering" | "exiting" | "idle"
    >("idle");
    const containerRef = useRef<HTMLDivElement>(null);

    const switchTab = useCallback(
        (activeIndex: number) => {
            if (isAnimating || activeIndex === currentTabIndex) return;

            console.log(
                `Switching from tab ${currentTabIndex} to tab ${activeIndex}`
            );
            setIsAnimating(true);
            playSound("3.mp3", 0.4);

            setDirection(activeIndex > currentTabIndex ? 1 : -1);
            setAnimationPhase("exiting");
            const previousIndex = currentTabIndex;
            setCurrentTabIndex(activeIndex);

            if (opts.onTabChange) {
                opts.onTabChange(activeIndex, previousIndex);
            }
            setTimeout(() => {
                setIsAnimating(false);
                setAnimationPhase("idle");
            }, 400);
        },
        [currentTabIndex, isAnimating, opts]
    );

    const handleLeft = () => {
        if (currentTabIndex > 0) {
            switchTab(currentTabIndex - 1);
        }
    };

    const handleRight = () => {
        if (currentTabIndex < tabCount - 1) {
            switchTab(currentTabIndex + 1);
        }
    };

    useKeyboardNavigation({
        onUp: () => {},
        onDown: () => {},
        onLeft: handleLeft,
        onRight: handleRight,
        onEnter: () => {},
    });

    // Animation variants for the tab content
    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "50%" : "-50%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "50%" : "-50%",
            opacity: 0,
        }),
    };

    const animationContextValue: TabAnimationContext = {
        isExiting: animationPhase === "exiting",
        isEntering: animationPhase === "entering",
        direction,
        staggerDelay: opts.staggerDelay,
    };

    return (
        <div>
            <div className={"flex flex-row gap-2"}>
                {Array.from({ length: tabCount }, (_, i) => (
                    <CustomAnimatedBackground
                        key={i}
                        hovered={i === currentTabIndex}
                        className="mb-4"
                        layers={[
                            {
                                images: lightTextures,
                                count: 2,
                                scale: { x: 1.5, y: 1.2 },
                                color: "white",
                            },
                        ]}
                    >
                        <button
                            className={`w-6 text-3xl ${
                                i === currentTabIndex ? "text-background" : ""
                            } cursor-pointer ${opts.tabButtonClass}`}
                            onClick={() => switchTab(i)}
                            onMouseEnter={() => playSound("8.mp3", 0.2)}
                        >
                            {labelFormatter(i)}
                        </button>
                    </CustomAnimatedBackground>
                ))}
            </div>
            <div
                ref={containerRef}
                className="tab-content"
                style={{ position: "relative", overflow: "visible" }}
            >
                <TabAnimationContext.Provider value={animationContextValue}>
                    <AnimatePresence
                        mode="wait"
                        custom={direction}
                        onExitComplete={() => setAnimationPhase("entering")}
                    >
                        <motion.div
                            key={currentTabIndex}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            style={{ width: "100%" }}
                            className={opts.pageClass}
                            data-page-index={currentTabIndex}
                        >
                            {children[currentTabIndex]}
                        </motion.div>
                    </AnimatePresence>
                </TabAnimationContext.Provider>
            </div>
        </div>
    );
};

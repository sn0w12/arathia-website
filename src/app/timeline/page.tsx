"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatedBackground } from "../../components/metaphor/animated-bg";
import {
    fetchTimeline,
    timelines,
    Timeline,
    TimelineEventLevel,
} from "../../lib/timeline";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { useTransition } from "@/contexts/transition-context";
import { Text } from "@/components/metaphor/text";
import { Divider } from "@/components/metaphor/divider";
import { TransitionLink } from "@/components/transition-link";
import { handleHover } from "@/lib/util";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useNavigation } from "@/hooks/use-navigation";
import { Droplet } from "@/components/metaphor/droplet";
import { playSound } from "@/lib/audio";

import Background from "../../../public/bg/characters-background.webp";

export default function TimelinePage() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();
    const timelineKeys = Object.keys(timelines);
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const selected = timelineKeys[selectedIndex - 1] as keyof typeof timelines;
    const [allTimelineData, setAllTimelineData] = useState<{
        [key: string]: Timeline | null;
    }>({});
    const [loading, setLoading] = useState(true);
    const [droplets, setDroplets] = useState<
        Array<{ id: number; x: number; y: number }>
    >([]);
    const backRef = useRef<HTMLDivElement | null>(null);
    const timelineRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
        Array.from({ length: timelineKeys.length }, () => ({ current: null }))
    );
    const { navigate } = useNavigation();

    const isUsingController = useKeyboardNavigation({
        onUp: () => {
            if (selectedIndex > 0) {
                setSelectedIndex(0);
                handleHover(0, backRef, setDroplets, setSelectedIndex);
            }
        },
        onDown: () => {
            if (selectedIndex === 0) {
                setSelectedIndex(1);
                handleHover(
                    1,
                    timelineRefs.current[0],
                    setDroplets,
                    setSelectedIndex
                );
            } else if (selectedIndex < timelineKeys.length) {
                const newIndex = selectedIndex + 1;
                setSelectedIndex(newIndex);
                handleHover(
                    newIndex,
                    timelineRefs.current[newIndex - 1],
                    setDroplets,
                    setSelectedIndex
                );
            }
        },
        onLeft: () => {
            if (selectedIndex === 0) {
                const newIndex = timelineKeys.length;
                setSelectedIndex(newIndex);
                handleHover(
                    newIndex,
                    timelineRefs.current[newIndex - 1],
                    setDroplets,
                    setSelectedIndex
                );
            } else if (selectedIndex > 1) {
                const newIndex = selectedIndex - 1;
                setSelectedIndex(newIndex);
                handleHover(
                    newIndex,
                    timelineRefs.current[newIndex - 1],
                    setDroplets,
                    setSelectedIndex
                );
            }
        },
        onRight: () => {
            if (selectedIndex === 0) {
                setSelectedIndex(1);
                handleHover(
                    1,
                    timelineRefs.current[0],
                    setDroplets,
                    setSelectedIndex
                );
            } else if (selectedIndex < timelineKeys.length) {
                const newIndex = selectedIndex + 1;
                setSelectedIndex(newIndex);
                handleHover(
                    newIndex,
                    timelineRefs.current[newIndex - 1],
                    setDroplets,
                    setSelectedIndex
                );
            }
        },
        onEnter: () => {
            if (selectedIndex === 0) {
                playSound("1.mp3");
                navigate("/");
            }
        },
    });

    useEffect(() => {
        setIsOpen(false);
        const timer = setTimeout(() => setIsOpen(true), 0);
        return () => clearTimeout(timer);
    }, [setIsOpen]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const data: { [key: string]: Timeline | null } = {};
            for (const key of timelineKeys) {
                data[key] = await fetchTimeline(key as keyof typeof timelines);
            }
            setAllTimelineData(data);
            setLoading(false);
        };
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDotColor = (level: TimelineEventLevel) => {
        switch (level) {
            case "Universe Changing Event":
                return "bg-solar";
            case "World Changing Event":
                return "bg-void";
            case "National Event":
                return "bg-arc";
            case "Local Event":
                return "bg-vampiric";
            default:
                return "bg-accent";
        }
    };

    return (
        <NoiseFade
            in={isOpen}
            scale={scale}
            duration={duration}
            className="fixed inset-0 h-screen"
            style={{ cursor: isUsingController ? "none" : "auto" }}
        >
            <Image
                src={Background}
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover"
                quality={100}
                sizes="100vw"
                priority
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-10">
                <div className="fixed text-6xl font-black top-1.5 left-1 z-10 pointer-events-auto">
                    <div
                        ref={backRef}
                        onMouseEnter={() => {
                            handleHover(
                                0,
                                backRef,
                                setDroplets,
                                setSelectedIndex
                            );
                        }}
                    >
                        <AnimatedBackground hovered={selectedIndex === 0}>
                            <Text>
                                <TransitionLink href="/">BACK</TransitionLink>
                            </Text>
                        </AnimatedBackground>
                    </div>
                </div>
                <div className="relative top-10 mt-0 flex flex-col pointer-events-none">
                    <div className="flex items-baseline">
                        <Text
                            textColor="var(--accent)"
                            className="text-9xl font-black"
                        >
                            TIMELINE
                        </Text>
                    </div>
                </div>
                <div className="flex flex-row space-x-8 mt-8">
                    {timelineKeys.map((key, index) => (
                        <div
                            key={index}
                            ref={timelineRefs.current[index]}
                            className="pointer-events-auto"
                            onMouseEnter={() => {
                                handleHover(
                                    index + 1,
                                    timelineRefs.current[index],
                                    setDroplets,
                                    setSelectedIndex
                                );
                            }}
                        >
                            <AnimatedBackground
                                hovered={selectedIndex === index + 1}
                            >
                                <Text className="text-5xl font-bold">
                                    {key}
                                </Text>
                            </AnimatedBackground>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative left-0 top-[30vh] overflow-y-auto h-[70vh] w-full px-8 overflow-x-hidden">
                <div className="mx-auto h-full">
                    <div className="timeline-container relative z-10">
                        <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1 bg-white h-full z-0 opacity-50"></div>
                        {loading ? (
                            <Text className="text-center">Loading...</Text>
                        ) : allTimelineData[selected] ? (
                            allTimelineData[selected].map((era, eraIndex) => (
                                <div
                                    key={era.era}
                                    className="mb-12 flex flex-col"
                                >
                                    <p className="text-5xl font-bold text-center">
                                        {era.era}
                                    </p>
                                    <p className="mb-6 text-center max-w-4xl mx-auto">
                                        {era.description}
                                    </p>
                                    <Divider className="mb-6" />
                                    {era.subcategories.map((sub, subIndex) => (
                                        <div key={sub.title} className="mb-6">
                                            <p className="text-4xl font-semibold text-center">
                                                {sub.title}
                                            </p>
                                            <Divider className="mb-6 w-80 mx-auto" />
                                            {sub.events.map(
                                                (event, eventIndex) => {
                                                    const isLeft =
                                                        (eraIndex +
                                                            subIndex +
                                                            eventIndex) %
                                                            2 ===
                                                        0;
                                                    return (
                                                        <div
                                                            key={
                                                                event.year +
                                                                event.title
                                                            }
                                                            className={`timeline-item flex ${
                                                                isLeft
                                                                    ? "justify-start"
                                                                    : "justify-end"
                                                            } items-center mb-8 relative`}
                                                        >
                                                            <div
                                                                className={`timeline-content ${
                                                                    isLeft
                                                                        ? "text-right pr-8"
                                                                        : "text-left pl-8"
                                                                } w-1/2`}
                                                            >
                                                                <p className="text-2xl font-normal">
                                                                    <span className="font-bold text-accent">
                                                                        {
                                                                            event.year
                                                                        }
                                                                    </span>
                                                                    :{" "}
                                                                    {
                                                                        event.title
                                                                    }{" "}
                                                                    <span className="text-lg italic text-gray-400">
                                                                        (
                                                                        {
                                                                            event.level
                                                                        }
                                                                        )
                                                                    </span>
                                                                    <br />
                                                                    <span className="text-xl text-gray-300 mt-2 block">
                                                                        {
                                                                            event.description
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div
                                                                className={`timeline-dot absolute left-1/2 transform -translate-x-1/2 w-4 h-4 ${getDotColor(
                                                                    event.level
                                                                )} rounded-full z-10`}
                                                            ></div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>
            </div>
            {droplets.map((d) => (
                <Droplet
                    key={d.id}
                    x={d.x}
                    y={d.y}
                    onComplete={() =>
                        setDroplets((prev) =>
                            prev.filter((dd) => dd.id !== d.id)
                        )
                    }
                />
            ))}
        </NoiseFade>
    );
}

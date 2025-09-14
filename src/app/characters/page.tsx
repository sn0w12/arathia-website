"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { useTransition } from "@/contexts/transition-context";

import { AnimatedBackground } from "@/components/metaphor/animated-bg";
import { Text, ClippedText } from "@/components/metaphor/text";
import { Divider } from "@/components/metaphor/divider";
import { Circle } from "@/components/metaphor/circle";
import { TransitionLink } from "@/components/transition-link";
import Image, { StaticImageData } from "next/image";
import { Droplet } from "@/components/metaphor/droplet";
import { playSound } from "@/lib/audio";
import { useNavigation } from "@/hooks/use-navigation";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { handleHover } from "@/lib/util";
import { TabSystem, useTabAnimation } from "@/components/metaphor/tabs";

import Background from "../../../public/bg/characters-background.webp";
import Ianara from "../../../public/characters/lanara.webp";
import Adeline from "../../../public/characters/adeline.webp";
import Reiko from "../../../public/characters/reiko.webp";

import Solar from "../../../public/powers/Solar.webp";
import Void from "../../../public/powers/Void.webp";

type Powers = "Solar" | "Void" | "Arc" | "Vampiric" | "Soulseeker" | "Dragon";
const powerIcons: Record<Powers, StaticImageData | null> = {
    Solar: Solar,
    Void: Void,
    Arc: null,
    Vampiric: null,
    Soulseeker: null,
    Dragon: null,
};

interface Character {
    name: string;
    title?: string;
    href: string;
    image: StaticImageData;
    powers: Powers[];
}

function CharacterText({
    name,
    href,
    hovered,
    index,
    ref,
    onHover,
}: {
    name: string;
    href: string;
    hovered: boolean;
    index: number;
    ref: React.RefObject<HTMLDivElement | null>;
    onHover: (ref: React.RefObject<HTMLDivElement | null>) => void;
}) {
    const tabAnimation = useTabAnimation();

    const itemVariants = {
        enter: {
            x: tabAnimation.direction > 0 ? "100%" : "-100%",
            opacity: 0,
        },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: tabAnimation.direction < 0 ? "100%" : "-100%",
            opacity: 0,
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: index * (tabAnimation.staggerDelay / 1000),
            }}
            className="item"
        >
            <AnimatedBackground
                ref={ref}
                hovered={hovered}
                style={{ left: `calc(var(--spacing) * ${index * 4})` }}
                onHover={onHover}
            >
                <span className="text-5xl font-bold">
                    <TransitionLink href={href}>{name}</TransitionLink>
                </span>
            </AnimatedBackground>
        </motion.div>
    );
}

function CharacterHead({
    character,
    visible,
}: {
    character: Character;
    visible: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [scaleX, setScaleX] = useState(1);

    useEffect(() => {
        if (textRef.current) {
            if (!containerRef.current) return;
            const containerHeight =
                containerRef.current.getBoundingClientRect().height;
            if (!textRef.current) return;
            const textHeight = textRef.current.getBoundingClientRect().height;
            const scale = (containerHeight * 0.99) / textHeight;
            setScaleX(scale);
        }
    }, [character.title]);

    return (
        <div className={`${visible ? "opacity-100" : "opacity-0"}`}>
            {character.powers.map((power, index) => {
                const color = `var(--${power.toLowerCase()})`;
                return powerIcons[power] ? (
                    <div
                        key={`${power}-${index}`}
                        className={`absolute w-50 invert -rotate-90 opacity-0 lg:opacity-100`}
                        style={{
                            bottom: `calc(var(--spacing) * ${15 + index * 50})`,
                            right: `calc(50vw - var(--spacing) * ${
                                5 + index * 5
                            })`,
                        }}
                    >
                        <Image
                            src={powerIcons[power] as StaticImageData}
                            alt={power}
                            className="z-10 relative"
                            width={200}
                        />
                        <div className="center-absolute invert">
                            <AnimatedBackground
                                hovered={visible}
                                fgColor={color}
                                mgColor={color}
                            >
                                <Text className="text-6xl font-bold z-5">
                                    {power}
                                </Text>
                            </AnimatedBackground>
                        </div>
                    </div>
                ) : null;
            })}
            <Image
                src={character.image}
                alt={character.name}
                className="absolute bottom-0 w-1/2 right-0"
                loading="eager"
                sizes="(max-width: 767px) 100vw, 150vw"
                quality={100}
            />
            {character.title && (
                <div
                    ref={containerRef}
                    className="fixed bottom-[100vh] right-0 w-[100vh] -rotate-90 origin-bottom-right"
                >
                    <ClippedText
                        ref={textRef}
                        points={[0, 0, 1, 0, 1, 0.9, 0, 0.15]}
                        bgColor={`var(--${character.powers[0].toLowerCase()})`}
                        className="font-black z-5 text-nowrap text-8xl"
                        style={{
                            transform: `scaleX(${scaleX}) scaleY(1.2)`,
                            transformOrigin: "left",
                        }}
                    >
                        {character.title.toUpperCase()}
                    </ClippedText>
                </div>
            )}
        </div>
    );
}

export default function CharactersPage() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();
    const [selected, setSelected] = useState<number>(1);
    const [currentSelected, setCurrentSelected] = useState<number>(1);
    const [fadeIn, setFadeIn] = useState<boolean>(true);
    const [droplets, setDroplets] = useState<
        Array<{ id: number; x: number; y: number }>
    >([]);
    const [currentTab, setCurrentTab] = useState<number>(0);
    const characters = useMemo<Character[]>(
        () => [
            {
                name: "Ianara Ustrina",
                title: "Blade of Adeline",
                href: "https://arathia.net/wiki/Ianara_Ustrina",
                image: Ianara,
                powers: ["Solar", "Void"],
            },
            {
                name: "Adeline Cineres",
                title: "The Scarlet Princess",
                href: "https://arathia.net/wiki/Adeline_Cineres",
                image: Adeline,
                powers: ["Solar", "Void"],
            },
            {
                name: "Miyamoto Reiko",
                href: "https://arathia.net/wiki/Miyamoto_Reiko",
                image: Reiko,
                powers: ["Void"],
            },
        ],
        []
    );

    const charactersPerPage = 2;
    const tabCount = Math.ceil(characters.length / charactersPerPage);
    const maxInTab = characters.slice(
        currentTab * charactersPerPage,
        (currentTab + 1) * charactersPerPage
    ).length;
    const currentCharIndex = currentTab * charactersPerPage + selected - 1;

    useEffect(() => {
        if (currentCharIndex !== currentSelected) {
            setFadeIn(false);
            const timer = setTimeout(() => {
                setCurrentSelected(currentCharIndex);
                setFadeIn(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentCharIndex, currentSelected]);

    const charRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
        Array.from({ length: characters.length + 1 }, () => ({
            current: null,
        }))
    );
    const { navigate } = useNavigation();

    const handleEnter = () => {
        const href =
            selected === 0
                ? "/"
                : characters[currentTab * charactersPerPage + selected - 1]
                      .href;
        playSound("1.mp3");
        navigate(href);
    };

    const isUsingController = useKeyboardNavigation({
        onUp: () => {
            if (selected > 1) {
                const newIndex = selected - 1;
                setSelected(newIndex);
                const globalIndex = currentTab * charactersPerPage + newIndex;
                handleHover(
                    globalIndex,
                    charRefs.current[globalIndex],
                    setDroplets,
                    setSelected
                );
            } else if (selected === 1) {
                setSelected(0);
                handleHover(0, charRefs.current[0], setDroplets, setSelected);
            }
        },
        onDown: () => {
            if (selected === 0) {
                setSelected(1);
                const globalIndex = currentTab * charactersPerPage + 1;
                handleHover(
                    globalIndex,
                    charRefs.current[globalIndex],
                    setDroplets,
                    setSelected
                );
            } else if (selected < maxInTab) {
                const newIndex = selected + 1;
                setSelected(newIndex);
                const globalIndex = currentTab * charactersPerPage + newIndex;
                handleHover(
                    globalIndex,
                    charRefs.current[globalIndex],
                    setDroplets,
                    setSelected
                );
            } else if (currentTab < tabCount - 1) {
                setCurrentTab(currentTab + 1);
                setSelected(1);
                const globalIndex = (currentTab + 1) * charactersPerPage + 1;
                handleHover(
                    globalIndex,
                    charRefs.current[globalIndex],
                    setDroplets,
                    setSelected
                );
            }
        },
        onLeft: () => {},
        onRight: () => {},
        onEnter: handleEnter,
    });

    useEffect(() => {
        setIsOpen(false);
        const timer = setTimeout(() => setIsOpen(true), 0);
        return () => clearTimeout(timer);
    }, [setIsOpen]);

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
            <div className="fixed text-6xl font-black top-17.5 left-39 z-10">
                <AnimatedBackground
                    ref={charRefs.current[0]}
                    hovered={selected === 0}
                    onHover={(ref) =>
                        handleHover(0, ref, setDroplets, setSelected)
                    }
                >
                    <Text>
                        <TransitionLink href="/">BACK</TransitionLink>
                    </Text>
                </AnimatedBackground>
            </div>
            <div className="relative left-20 top-20 mt-0 flex flex-col">
                <div className="flex items-baseline pointer-events-none">
                    <Text
                        textColor="var(--accent)"
                        className="text-9xl font-black"
                    >
                        C
                    </Text>
                    <ClippedText
                        points={[0, 0, 1, 0, 1, 0.9, 0, 0.15]}
                        bgColor="var(--accent)"
                        className="text-8xl font-black"
                    >
                        HARACTERS
                    </ClippedText>
                </div>
                <div className="relative left-10 flex flex-col">
                    <TabSystem
                        tabCount={tabCount}
                        labelFormatter={(i) => `${i + 1}`}
                        options={{
                            onTabChange: (activeIndex) => {
                                setCurrentTab(activeIndex);
                                setSelected(1);
                            },
                        }}
                    >
                        {Array.from({ length: tabCount }, (_, tabIndex) => {
                            const start = tabIndex * charactersPerPage;
                            const end = Math.min(
                                start + charactersPerPage,
                                characters.length
                            );
                            const group = characters.slice(start, end);
                            return (
                                <div key={tabIndex}>
                                    {group.map((char, index) => {
                                        const globalIndex = start + index + 1;
                                        return (
                                            <CharacterText
                                                key={char.href}
                                                ref={
                                                    charRefs.current[
                                                        globalIndex
                                                    ]
                                                }
                                                name={char.name}
                                                href={char.href}
                                                hovered={
                                                    selected === index + 1 &&
                                                    currentTab === tabIndex
                                                }
                                                index={start + index}
                                                onHover={(ref) => {
                                                    setSelected(index + 1);
                                                    setCurrentTab(tabIndex);
                                                    handleHover(
                                                        globalIndex,
                                                        ref,
                                                        setDroplets,
                                                        setSelected
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </TabSystem>
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
            </div>

            <div className="absolute right-0 -bottom-8 w-[100vw] h-[100vh] md:w-1/2 z-10 overflow-visible">
                <NoiseFade
                    in={fadeIn}
                    scale={0.5}
                    duration={500}
                    className="absolute bottom-0 right-0 overflow-visible w-[100vw] h-full pointer-events-none"
                >
                    {characters.map((char, index) => (
                        <CharacterHead
                            key={char.name}
                            character={char}
                            visible={index === currentSelected}
                        />
                    ))}
                </NoiseFade>
            </div>

            <div className="fixed left-20 top-52">
                <Divider
                    className="relative h-3 left-60 -top-5"
                    scale={{ x: 3.5, y: 1 }}
                />
                <Divider
                    className="relative h-5 w-70 -left-29 top-0"
                    orientation="vertical"
                    scale={{ x: 4, y: 1 }}
                />
                <Circle
                    className="relative size-200 left-45"
                    spinDuration={45}
                />
            </div>
            <div className="fixed right-20 bottom-4 w-60">
                <Divider
                    className="relative h-5 right-60"
                    scale={{ x: 7, y: 1 }}
                />
                <Circle
                    className="fixed size-250 -bottom-200 -right-170"
                    spinDuration={90}
                />
            </div>
        </NoiseFade>
    );
}

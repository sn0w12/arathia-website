"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { useTransition } from "@/contexts/transition-context";

import { AnimatedBackground } from "@/components/metaphor/animated-bg";
import { Text } from "@/components/metaphor/text";
import { Divider } from "@/components/metaphor/divider";
import { Circle } from "@/components/metaphor/circle";
import { TransitionLink } from "@/components/transition-link";
import Image, { StaticImageData } from "next/image";
import { Droplet } from "@/components/metaphor/droplet";
import { playSound } from "@/lib/audio";
import { useNavigation } from "@/hooks/use-navigation";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { handleHover } from "@/lib/util";

import Background from "../../../public/bg/characters-background.webp";
import Ianara from "../../../public/characters/lanara.webp";
import Adeline from "../../../public/characters/adeline.webp";
import Reiko from "../../../public/characters/reiko.webp";

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
    return (
        <AnimatedBackground
            ref={ref}
            hovered={hovered}
            style={{ left: `calc(var(--spacing) * ${index * 4})` }}
            onHover={onHover}
        >
            <Text className="text-5xl font-bold">
                <TransitionLink href={href}>{name}</TransitionLink>
            </Text>
        </AnimatedBackground>
    );
}

function CharacterHead({
    image,
    alt,
    visible,
}: {
    image: StaticImageData;
    alt: string;
    visible: boolean;
}) {
    return (
        <NoiseFade
            in={visible}
            scale={0.5}
            duration={500}
            className="absolute bottom-0 right-0"
        >
            <Image src={image} alt={alt} className="" />
        </NoiseFade>
    );
}

export default function CharactersPage() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();
    const [selected, setSelected] = useState<number>(1);
    const [droplets, setDroplets] = useState<
        Array<{ id: number; x: number; y: number }>
    >([]);
    const characters = useMemo(
        () => [
            {
                name: "Ianara Ustrina",
                href: "https://arathia.net/wiki/Ianara_Ustrina",
                image: Ianara,
            },
            {
                name: "Adeline Cineres",
                href: "https://arathia.net/wiki/Adeline_Cineres",
                image: Adeline,
            },
            {
                name: "Miyamoto Reiko",
                href: "https://arathia.net/wiki/Miyamoto_Reiko",
                image: Reiko,
            },
        ],
        []
    );
    const charRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
        Array.from({ length: characters.length + 1 }, () => ({ current: null }))
    );
    const { navigate } = useNavigation();
    const maxIndex = characters.length;

    const handleEnter = () => {
        const href = selected === 0 ? "/" : characters[selected - 1].href;
        playSound("1.mp3");
        navigate(href);
    };

    useKeyboardNavigation({
        selected,
        setSelected,
        maxIndex,
        onHover: (index) =>
            handleHover(
                index,
                charRefs.current[index],
                setDroplets,
                setSelected
            ),
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
        >
            <Image
                src={Background}
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover"
                quality={100}
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
                    <Text className="text-9xl font-black">C</Text>
                    <Text className="text-8xl font-black">HARACTERS</Text>
                </div>
                <div className="relative left-10 flex flex-col">
                    {characters.map((char, index) => (
                        <CharacterText
                            key={char.href}
                            ref={charRefs.current[index + 1]}
                            name={char.name}
                            href={char.href}
                            hovered={selected === index + 1}
                            index={index}
                            onHover={(ref) =>
                                handleHover(
                                    index + 1,
                                    ref,
                                    setDroplets,
                                    setSelected
                                )
                            }
                        />
                    ))}
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

            <div className="fixed right-0 -bottom-8 h-auto w-[100vw] md:w-1/2 z-10">
                {characters.map((char, index) => (
                    <CharacterHead
                        key={char.href}
                        image={char.image}
                        alt={char.name}
                        visible={selected === index + 1}
                    />
                ))}
            </div>

            <div className="fixed left-20 top-52">
                <Divider
                    className="relative h-3 left-40 -top-5"
                    scale={{ x: 2, y: 1 }}
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
            <div className="fixed right-20 bottom-10 w-60">
                <Divider
                    className="relative h-2 right-60"
                    scale={{ x: 6, y: 1 }}
                />
                <Circle
                    className="fixed size-250 -bottom-200 -right-170"
                    spinDuration={90}
                />
            </div>
        </NoiseFade>
    );
}

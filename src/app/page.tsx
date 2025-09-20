"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Divider } from "@/components/metaphor/divider";
import { NoiseFade } from "@/components/metaphor/noise-fade";
import { AnimatedLink } from "@/components/home/animated-link";
import { Droplet } from "@/components/metaphor/droplet";
import { playSound } from "@/lib/audio";
import { useTransition } from "@/contexts/transition-context";
import { useNavigation } from "@/hooks/use-navigation";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { Sky } from "@/components/metaphor/map/sky";
import { handleHover } from "@/lib/util";

import SonsOfAntares from "../../public/logos/groups/Sons_of_antares.png";

export default function Home() {
    const { isOpen, setIsOpen, scale, duration } = useTransition();
    const [selected, setSelected] = useState<number>(0);
    const [droplets, setDroplets] = useState<
        Array<{ id: number; x: number; y: number }>
    >([]);
    const links = useMemo(
        () => [
            { text: "Wiki", href: "https://arathia.net/wiki" },
            { text: "Map", href: "/map" },
            { text: "Timeline", href: "/timeline" },
            { text: "Characters", href: "/characters", hideOnMobile: true },
        ],
        []
    );
    const linkRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
        Array.from({ length: links.length + 1 }, () => ({ current: null }))
    );
    const { navigate } = useNavigation();
    const maxIndex = links.length;

    const handleEnter = () => {
        const href =
            selected === 0
                ? "https://arathia.net/wiki"
                : links[selected - 1].href;
        playSound("1.mp3");
        navigate(href);
    };

    const isUsingController = useKeyboardNavigation({
        onUp: () => {
            if (selected > 0) {
                const newIndex = selected - 1;
                setSelected(newIndex);
                handleHover(
                    newIndex,
                    linkRefs.current[newIndex],
                    setDroplets,
                    setSelected
                );
            }
        },
        onDown: () => {
            if (selected < maxIndex) {
                const newIndex = selected + 1;
                setSelected(newIndex);
                handleHover(
                    newIndex,
                    linkRefs.current[newIndex],
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
            <picture className="absolute inset-0 h-full w-full">
                <source
                    media="(max-width: 768px)"
                    srcSet="/bg/home-background-background-mobile.webp"
                />
                <img
                    src="/bg/home-background-background.webp"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                />
            </picture>
            <Sky numClouds={10} className="hidden md:block" />
            <picture className="absolute inset-0 h-full w-full">
                <source
                    media="(max-width: 768px)"
                    srcSet="/bg/home-background-midground-mobile.webp"
                />
                <img
                    src="/bg/home-background-midground.webp"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                />
            </picture>
            <div className="relative flex items-center justify-center min-h-screen md:min-h-0 md:block md:left-40 md:top-40 md:mt-0">
                <div className="flex flex-col items-center md:flex-row gap-4 md:gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <AnimatedLink
                            ref={linkRefs.current[0]}
                            text="Arathia"
                            href={"https://arathia.net/wiki"}
                            selected={selected === 0}
                            onHover={(ref) =>
                                handleHover(0, ref, setDroplets, setSelected)
                            }
                        >
                            <Divider />
                        </AnimatedLink>
                        {links.map((link, index) => (
                            <AnimatedLink
                                key={link.href}
                                ref={linkRefs.current[index + 1]}
                                text={link.text}
                                href={link.href}
                                className={`text-4xl md:text-5xl font-normal ${
                                    link.hideOnMobile ? "hidden md:block" : ""
                                }`}
                                selected={selected === index + 1}
                                textureType="tight"
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
                    <Image
                        src={SonsOfAntares}
                        alt="Sons of Antares"
                        className="h-auto w-40 md:h-88 md:w-auto"
                        width={167}
                        priority
                    />
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
        </NoiseFade>
    );
}

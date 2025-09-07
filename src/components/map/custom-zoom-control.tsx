"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom/client";
import { AnimatedBackground } from "@/components/metaphor/animated-bg";
import { Text } from "@/components/metaphor/text";
import { playSound } from "@/lib/audio";
import { useTransition } from "@/contexts/transition-context";

export function CustomZoomControl() {
    const map = useMap();
    const { setIsOpen, duration } = useTransition();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        // Create a proper Leaflet control
        const CustomZoomControl = L.Control.extend({
            options: {
                position: "topleft",
            },

            onAdd: function (this: L.Control) {
                const container = L.DomUtil.create(
                    "div",
                    "custom-zoom-control"
                );

                // Prevent map interactions
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const self = this as any;
                const root = ReactDOM.createRoot(container);

                const handleBack = () => {
                    playSound("1.mp3");
                    setIsOpen(false);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, duration);
                };

                root.render(
                    <div className="flex flex-row items-center gap-4 p-2">
                        <div className="flex flex-col gap-2">
                            <div
                                onMouseEnter={() => {
                                    playSound("2.mp3");
                                    setHoveredIndex(1);
                                }}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <AnimatedBackground
                                    hovered={hoveredIndex === 1}
                                    className="cursor-pointer px-2"
                                    onClick={() => {
                                        playSound("8.mp3");
                                        self._map.zoomIn();
                                    }}
                                >
                                    <Text className="text-2xl font-bold">
                                        +
                                    </Text>
                                </AnimatedBackground>
                            </div>
                            <div
                                onMouseEnter={() => {
                                    playSound("2.mp3");
                                    setHoveredIndex(2);
                                }}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <AnimatedBackground
                                    hovered={hoveredIndex === 2}
                                    className="cursor-pointer px-2"
                                    onClick={() => {
                                        playSound("8.mp3");
                                        self._map.zoomOut();
                                    }}
                                >
                                    <Text className="text-2xl font-bold">
                                        −
                                    </Text>
                                </AnimatedBackground>
                            </div>
                        </div>
                        <div
                            onMouseEnter={() => {
                                playSound("2.mp3");
                                setHoveredIndex(0);
                            }}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatedBackground
                                hovered={hoveredIndex === 0}
                                className="cursor-pointer px-2 font-[juana]"
                                onClick={handleBack}
                            >
                                <Text className="text-5xl font-bold">BACK</Text>
                            </AnimatedBackground>
                        </div>
                    </div>
                );

                // Store the root for cleanup
                self._root = root;

                return container;
            },

            onRemove: function (this: L.Control) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const self = this as any;
                if (self._root) {
                    self._root.unmount();
                }
            },
        });

        // Add the control to the map
        const control = new CustomZoomControl();
        map.addControl(control);

        // Cleanup
        return () => {
            map.removeControl(control);
        };
    }, [map, hoveredIndex, setIsOpen, duration]);

    return null;
}

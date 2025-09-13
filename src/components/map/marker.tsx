import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Divider } from "../metaphor/divider";
import { Text } from "../metaphor/text";
import Link from "next/link";
import Image from "next/image";
import { regionMap } from "@/lib/map/regions";
import { RegionId } from "@/lib/map/regions";
import { useEffect, useRef } from "react";
import { isDevelopment } from "@/lib/util";

import Capital from "../../../public/map/markers/capital.png";
import CityBig from "../../../public/map/markers/cityBig.png";
import CitySmall from "../../../public/map/markers/citySmall.png";
import Town from "../../../public/map/markers/town.png";
import Nature from "../../../public/map/markers/nature.png";
import Important from "../../../public/map/markers/important.png";
import Character from "../../../public/map/markers/character.png";
import DefaultShadow from "../../../public/map/markers/defaultShadow.png";
import { Marker as MarkerInterface } from "./map-client";
import { getMarkerRegion } from "@/lib/map";

const defaultIconSettings = {
    size: [31, 41] as [number, number],
    anchor: [15, 41] as [number, number],
    popupAnchor: [1, -44] as [number, number],
};

const icons = {
    capital: L.icon({
        iconUrl: Capital.src,
        iconRetinaUrl: Capital.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "capital",
    }),
    cityBig: L.icon({
        iconUrl: CityBig.src,
        iconRetinaUrl: CityBig.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "cityBig",
    }),
    citySmall: L.icon({
        iconUrl: CitySmall.src,
        iconRetinaUrl: CitySmall.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "citySmall",
    }),
    town: L.icon({
        iconUrl: Town.src,
        iconRetinaUrl: Town.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "town",
    }),
    nature: L.icon({
        iconUrl: Nature.src,
        iconRetinaUrl: Nature.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "nature",
    }),
    important: L.icon({
        iconUrl: Important.src,
        iconRetinaUrl: Important.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "important",
    }),
    character: L.icon({
        iconUrl: Character.src,
        iconRetinaUrl: Character.src,
        shadowUrl: DefaultShadow.src,
        iconSize: defaultIconSettings.size,
        iconAnchor: defaultIconSettings.anchor,
        popupAnchor: defaultIconSettings.popupAnchor,
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
        className: "character",
    }),
};

export type MarkerType = keyof typeof icons;

interface CustomMarkerProps {
    marker: MarkerInterface;
    shouldOpenPopup?: boolean;
    popupDelay?: number;
    [key: string]: unknown;
}

export function CustomMarker({
    marker,
    shouldOpenPopup = false,
    popupDelay = 100,
    ...props
}: CustomMarkerProps) {
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (shouldOpenPopup && markerRef.current) {
            setTimeout(() => {
                if (markerRef.current) {
                    markerRef.current.openPopup();
                }
            }, popupDelay);
        }
    }, [shouldOpenPopup, popupDelay]);

    const icon = icons[marker.icon];
    if (!icon) {
        console.warn(`Icon type "${marker.icon}" not found. Using default.`);
        return null;
    }
    const regionId = getMarkerRegion(marker.id);
    if (!regionId) {
        console.warn(`Region for marker ID "${marker.id}" not found.`);
        return null;
    }

    const region = regionMap[regionId];

    return (
        <Marker
            ref={markerRef}
            position={marker.coordinates}
            icon={icon}
            {...props}
        >
            <Popup className="leaflet-bg font-[juana]">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center w-full gap-2">
                        <Text className="text-2xl font-bold text-center">
                            {marker.link ? (
                                <Link
                                    href={`https://arathia.net/wiki/${
                                        marker.customlink ||
                                        marker.title.replace(/\s+/g, "_")
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {marker.title}
                                </Link>
                            ) : (
                                marker.title
                            )}
                        </Text>
                        <Image
                            src={region.flag.img}
                            alt={region.flag.alt}
                            blurDataURL={region.flag.img.blurDataURL}
                            width={33}
                            className="h-5 w-auto"
                        />
                    </div>
                    {isDevelopment && (
                        <p className="text-sm text-center">ID: {marker.id}</p>
                    )}
                    <Divider className="h-0.5 w-[90%] -mt-1" />
                    <p className="my-1! text-lg text-center">
                        {marker.category}
                    </p>
                    <Divider className="h-0.5 w-40 -mt-2" />
                    <p className="my-1! text-md text-center">
                        {marker.description}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Divider } from "../metaphor/divider";
import { Text } from "../metaphor/text";
import Link from "next/link";

import Capital from "../../../public/map/markers/capital.png";
import CityBig from "../../../public/map/markers/cityBig.png";
import CitySmall from "../../../public/map/markers/citySmall.png";
import Town from "../../../public/map/markers/town.png";
import Nature from "../../../public/map/markers/nature.png";
import Important from "../../../public/map/markers/important.png";
import Character from "../../../public/map/markers/character.png";
import DefaultShadow from "../../../public/map/markers/defaultShadow.png";

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
    type: MarkerType;
    position: [number, number];
    popupTitle: string;
    description: string;
    link: boolean;
    customLink: string | null;
    category: string;
    [key: string]: unknown;
}

export function CustomMarker({
    type,
    position,
    popupTitle,
    description,
    link,
    customLink,
    category,
    ...props
}: CustomMarkerProps) {
    const icon = icons[type];
    if (!icon) {
        console.warn(`Icon type "${type}" not found. Using default.`);
        return null;
    }

    return (
        <Marker position={position} icon={icon} {...props}>
            <Popup className="leaflet-bg font-[juana]">
                <div className="flex flex-col items-center justify-center">
                    <Text className="text-2xl font-bold w-full text-center">
                        {link ? (
                            <Link
                                href={`https://arathia.net/wiki/${
                                    customLink ||
                                    popupTitle.replace(/\s+/g, "_")
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {popupTitle}
                            </Link>
                        ) : (
                            popupTitle
                        )}
                    </Text>
                    <Divider className="h-0.5 w-[90%] -mt-1" />
                    <p className="my-1! text-lg text-center">{category}</p>
                    <Divider className="h-0.5 w-40 -mt-2" />
                    <p className="my-1! text-md text-center">{description}</p>
                </div>
            </Popup>
        </Marker>
    );
}

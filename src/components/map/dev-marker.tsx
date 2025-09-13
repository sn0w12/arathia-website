import { useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L, { LeafletEvent } from "leaflet";
import { isDevelopment } from "../../lib/util";
import { countryPolygons } from "@/lib/map/country-polygons";
import { point, booleanPointInPolygon } from "@turf/turf";
import { regionMap } from "@/lib/map/regions";
import { MapCode } from "@/lib/map";
import { MarkerType } from "./marker";
import { Marker as MarkerInterface } from "./map-client";

type MarkerDraft = Omit<MarkerInterface, "id" | "mapId" | "icon">;

import Icon from "../../../public/map/markers/marker-icon.png";
import DefaultShadow from "../../../public/map/markers/defaultShadow.png";

const categoryToIcon: Record<string, MarkerType> = {
    Capital: "capital",
    "Big City": "cityBig",
    "Small City": "citySmall",
    Town: "town",
    Forest: "nature",
    Mountain: "nature",
    Cave: "nature",
    "Important Location": "important",
    "Historical Location": "important",
    Character: "character",
};

const validCategories = Object.keys(categoryToIcon);

interface DevMarkerProps {
    currentMap: string;
    countryPolygons: typeof countryPolygons;
}

export function DevMarker({ currentMap, countryPolygons }: DevMarkerProps) {
    const [country, setCountry] = useState<string>("");
    const [markerDraft, setMarkerDraft] = useState<MarkerDraft>({
        coordinates: [0, 0],
        title: "",
        description: "",
        category: "Capital",
        link: false,
        customlink: null,
    });
    const markerRef = useRef<L.Marker | null>(null);

    const handleDragEnd = (e: LeafletEvent) => {
        const marker = e.target as L.Marker;
        const pos = marker.getLatLng();
        setMarkerDraft((prev) => ({
            ...prev,
            coordinates: [pos.lat, pos.lng],
        }));

        // Detect country
        const pt = point([pos.lat, pos.lng]);
        let detectedCountry = "";
        const mapPolygons =
            countryPolygons[currentMap as keyof typeof countryPolygons];
        if (mapPolygons) {
            for (const [countryId, polygon] of Object.entries(mapPolygons)) {
                if (booleanPointInPolygon(pt, polygon)) {
                    detectedCountry = countryId;
                    break;
                }
            }
        }
        setCountry(detectedCountry);
        setTimeout(() => {
            if (markerRef.current) {
                markerRef.current.openPopup();
            }
        }, 0);
    };

    const handleCreateMarker = () => {
        const icon = categoryToIcon[markerDraft.category] || "capital";
        const markerData: MarkerInterface = {
            id: `${country}_${markerDraft.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
            mapId: currentMap as MapCode,
            icon,
            ...markerDraft,
        };
        const json = JSON.stringify(markerData, null, 2);
        navigator.clipboard.writeText(json).catch((err) => {
            console.error("Failed to copy: ", err);
            alert("Failed to copy to clipboard.");
        });
    };

    if (!isDevelopment) return null;

    return (
        <Marker
            ref={markerRef}
            position={markerDraft.coordinates}
            icon={L.icon({
                iconUrl: Icon.src,
                iconRetinaUrl: Icon.src,
                shadowUrl: DefaultShadow.src,
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                popupAnchor: [0, -44],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41],
                className: "dev-marker",
            })}
            draggable={true}
            eventHandlers={{
                dragend: handleDragEnd,
            }}
        >
            <Popup>
                <div
                    className="text-center flex-col gap-1"
                    style={{ maxWidth: "300px" }}
                >
                    <h3 className="font-bold">Dev Marker Creator</h3>
                    <p style={{ margin: 0 }}>
                        Coordinates: {markerDraft.coordinates[0].toFixed(2)},{" "}
                        {markerDraft.coordinates[1].toFixed(2)}
                    </p>
                    <p style={{ margin: 0 }}>
                        Country:{" "}
                        {regionMap[country]?.name || country || "Unknown"}
                    </p>
                    <div style={{ textAlign: "left", marginTop: "10px" }}>
                        <label>
                            Title:{" "}
                            <input
                                type="text"
                                value={markerDraft.title}
                                onChange={(e) =>
                                    setMarkerDraft((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className="border border-accent w-full px-2 py-1 rounded"
                            />
                        </label>
                        <br />
                        <label>
                            Description:{" "}
                            <textarea
                                value={markerDraft.description}
                                onChange={(e) =>
                                    setMarkerDraft((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="border border-accent w-full px-2 py-1 rounded"
                            />
                        </label>
                        <br />
                        <label>
                            Category:{" "}
                            <select
                                value={markerDraft.category}
                                onChange={(e) =>
                                    setMarkerDraft((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                className="border border-accent w-full px-2 py-1 rounded"
                            >
                                {validCategories.map((cat) => (
                                    <option
                                        key={cat}
                                        value={cat}
                                        className="text-background"
                                    >
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>
                            Link:{" "}
                            <input
                                type="checkbox"
                                checked={markerDraft.link}
                                onChange={(e) =>
                                    setMarkerDraft((prev) => ({
                                        ...prev,
                                        link: e.target.checked,
                                    }))
                                }
                                className="border border-accent px-2 py-1 rounded"
                            />
                        </label>
                        <br />
                        <label>
                            Custom Link:{" "}
                            <input
                                type="text"
                                value={markerDraft.customlink || ""}
                                onChange={(e) =>
                                    setMarkerDraft((prev) => ({
                                        ...prev,
                                        customlink: e.target.value || null,
                                    }))
                                }
                                className="border border-accent w-full px-2 py-1 rounded"
                            />
                        </label>
                        <br />
                        <button
                            onClick={handleCreateMarker}
                            className="mt-2 w-full border border-accent px-2 py-1 rounded cursor-pointer hover:bg-accent/20 transition"
                        >
                            Create & Copy JSON
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

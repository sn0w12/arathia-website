"use client";

import { useEffect, useState, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    LayerGroup,
    LayersControl,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CustomMarker, MarkerType } from "./marker";
import jsonMarkers from "../../../public/data/markers/markers.json";
import { CustomZoomControl } from "./custom-zoom-control";
import { DevMarker } from "./dev-marker";
import { countryPolygons } from "@/lib/map/country-polygons";
import {
    layerTypes,
    MapCode,
    mapCodes,
    mapConfigs,
    typeNames,
} from "@/lib/map";

const MIN_ZOOM = 2.8;
const MAX_ZOOM = 5.4;

function MapResizer() {
    const map = useMap();
    useEffect(() => {
        map.createPane("backgroundPane");
        map.createPane("basePane");
        const backgroundPane = map.getPane("backgroundPane");
        if (backgroundPane) backgroundPane.style.zIndex = "150";
        const basePane = map.getPane("basePane");
        if (basePane) basePane.style.zIndex = "220";
        map.invalidateSize();
    }, [map]);
    return null;
}

function BaseLayerChangeHandler({
    onChange,
}: {
    onChange: (name: string) => void;
}) {
    const map = useMap();
    useEffect(() => {
        const handleBaseLayerChange = (e: { name: string }) => {
            onChange(e.name);
        };
        map.on("baselayerchange", handleBaseLayerChange);
        return () => {
            map.off("baselayerchange", handleBaseLayerChange);
        };
    }, [map, onChange]);
    return null;
}

function ZoomResetter({ currentMap }: { currentMap: string }) {
    const map = useMap();
    useEffect(() => {
        map.setView([0, 0], 0);
        setTimeout(() => {
            map.setView([0, 0], MIN_ZOOM);
        }, 20);
    }, [currentMap, map]);
    return null;
}

export interface Marker {
    id: string;
    mapId: MapCode;
    coordinates: [number, number];
    icon: MarkerType;
    title: string;
    description: string;
    category: string;
    link: boolean;
    customlink: string | null;
}

interface YearSelectorProps {
    currentMap: string;
    onChange: (map: string) => void;
    layersControlRef: React.RefObject<L.Control.Layers | null>;
}

const YearSelector: React.FC<YearSelectorProps> = ({
    currentMap,
    onChange,
    layersControlRef,
}) => {
    useEffect(() => {
        if (!layersControlRef.current) return;

        const control = layersControlRef.current;
        const container = control.getContainer();
        if (!container) return;

        // Store original _update on the control if not already stored
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(control as any).originalUpdate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (control as any).originalUpdate = (control as any)._update;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalUpdate = (control as any).originalUpdate;

        const currentConfig = mapConfigs[currentMap];
        const variants = currentConfig ? currentConfig.variants : [];

        // Always remove existing wrapper
        const existingWrapper = container.querySelector("#year-wrapper");
        if (existingWrapper) {
            existingWrapper.remove();
        }

        if (variants.length > 1) {
            // Override _update to append the wrapper after update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (control as any)._update = function () {
                // Call original update
                originalUpdate.call(this);
                // Then append the wrapper
                let wrapper = container.querySelector(
                    "#year-wrapper"
                ) as HTMLElement;
                let select: HTMLSelectElement | null = null;
                if (!wrapper) {
                    // Create a wrapper div to match the structure
                    wrapper = document.createElement("div");
                    wrapper.id = "year-wrapper";
                    wrapper.style.padding = "5px 10px";
                    const label = document.createElement("label");
                    label.textContent = "Variant: ";
                    label.style.fontSize = "12px";
                    label.style.fontWeight = "bold";
                    select = document.createElement("select");
                    select.id = "year-select";
                    select.style.width = "100%";
                    select.style.marginTop = "5px";
                    select.innerHTML = variants
                        .map(
                            (variant) =>
                                `<option value="${variant}" style="color: #181611;">${variant}</option>`
                        )
                        .join("");
                    wrapper.appendChild(label);
                    wrapper.appendChild(select);
                } else {
                    select = wrapper.querySelector(
                        "#year-select"
                    ) as HTMLSelectElement;
                }
                if (select) {
                    select.value = currentMap;
                    select.onchange = (e) => {
                        onChange((e.target as HTMLSelectElement).value);
                    };
                }
                // Find the base layers list and append after
                const baseLayersList = container.querySelector(
                    ".leaflet-control-layers-base"
                );
                if (baseLayersList && !baseLayersList.contains(wrapper)) {
                    baseLayersList.appendChild(wrapper);
                } else if (!container.contains(wrapper)) {
                    container.appendChild(wrapper);
                }
            };

            // Call _update to add the wrapper initially
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (control as any)._update();
        } else {
            // Restore original _update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (control as any)._update = originalUpdate;
            // Call _update to refresh the control
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (control as any)._update();
        }
    }, [currentMap, onChange, layersControlRef]);

    return null;
};

export default function MapClient() {
    const markers: Marker[] = jsonMarkers as unknown as Marker[];

    const [currentMap, setCurrentMap] = useState("Arathia");

    const baseTileLayerRef = useRef<L.TileLayer | null>(null);
    const backgroundTileLayerRef = useRef<L.TileLayer | null>(null);
    const layersControlRef = useRef<L.Control.Layers | null>(null);

    useEffect(() => {
        if (baseTileLayerRef.current) {
            baseTileLayerRef.current.setUrl(mapConfigs[currentMap].url);
        }
        if (backgroundTileLayerRef.current) {
            backgroundTileLayerRef.current.setUrl(
                mapConfigs[currentMap].backgroundUrl
            );
        }
    }, [currentMap]);

    const overlayConfigs = mapCodes.flatMap((region) =>
        layerTypes.map((type) => ({
            region,
            type,
            name: `${typeNames[type]}`,
            checked: true,
        }))
    );

    const currentConfig = mapConfigs[currentMap];
    const visibleOverlays = currentConfig ? currentConfig.overlays : [];

    const handleBaseLayerChange = (name: string) => {
        setCurrentMap(name);
    };

    const bounds = L.latLngBounds(
        L.latLng(
            currentConfig.bounds.southWest[0],
            currentConfig.bounds.southWest[1]
        ),
        L.latLng(
            currentConfig.bounds.northEast[0],
            currentConfig.bounds.northEast[1]
        )
    );

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[0, 0]}
                zoom={MIN_ZOOM}
                zoomSnap={0.1}
                zoomDelta={0.5}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                scrollWheelZoom={true}
                wheelPxPerZoomLevel={120}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                attributionControl={false}
                maxBounds={bounds}
            >
                <MapResizer />
                <BaseLayerChangeHandler onChange={handleBaseLayerChange} />
                <CustomZoomControl />
                <ZoomResetter currentMap={currentMap} />
                {/* Background TileLayer */}
                <TileLayer
                    ref={backgroundTileLayerRef}
                    url={mapConfigs.Arathia.backgroundUrl}
                    pane="backgroundPane"
                />
                {/* Layers Control */}
                <LayersControl ref={layersControlRef} position="topright">
                    {/* Base Layers */}
                    <LayersControl.BaseLayer checked name="Arathia">
                        <TileLayer
                            ref={baseTileLayerRef}
                            url={mapConfigs.Arathia.url}
                            pane="basePane"
                            noWrap
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Morturia">
                        <TileLayer
                            url="/map/maps/morturia/{z}/{x}/{y}.webp"
                            pane="basePane"
                            noWrap
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Elysium">
                        <TileLayer
                            url="/map/maps/elysium/{z}/{x}/{y}.webp"
                            pane="basePane"
                            noWrap
                        />
                    </LayersControl.BaseLayer>
                    {/* Overlays */}
                    {visibleOverlays.flatMap((region) =>
                        layerTypes.map((type) => {
                            const config = overlayConfigs.find(
                                (c) => c.region === region && c.type === type
                            );
                            if (!config) return null;
                            return (
                                <LayersControl.Overlay
                                    key={`${currentMap}-${config.region}-${config.type}`}
                                    checked={true}
                                    name={config.name}
                                >
                                    <LayerGroup>
                                        {markers
                                            .filter(
                                                (m) =>
                                                    m.mapId === config.region &&
                                                    m.icon === config.type
                                            )
                                            .map((marker) => (
                                                <CustomMarker
                                                    key={marker.id}
                                                    marker={marker}
                                                />
                                            ))}
                                    </LayerGroup>
                                </LayersControl.Overlay>
                            );
                        })
                    )}
                </LayersControl>
                <YearSelector
                    key={currentMap}
                    currentMap={currentMap}
                    onChange={setCurrentMap}
                    layersControlRef={layersControlRef}
                />
                <DevMarker
                    currentMap={currentMap}
                    countryPolygons={countryPolygons}
                />
            </MapContainer>
        </div>
    );
}

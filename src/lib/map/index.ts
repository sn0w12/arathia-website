export const mapCodes = ["ar", "ar1213BR", "mo", "el"] as const;
export type MapCode = (typeof mapCodes)[number];

export const layerTypes = [
    "capital",
    "cityBig",
    "citySmall",
    "town",
    "nature",
    "important",
    "character",
] as const;
export type LayerType = (typeof layerTypes)[number];

export const typeNames: Record<LayerType, string> = {
    capital: "Capitals",
    cityBig: "Large Cities",
    citySmall: "Small Cities",
    town: "Towns",
    nature: "Nature",
    important: "Locations",
    character: "Characters",
};

interface MapConfig {
    id: string;
    url: string;
    backgroundUrl: string;
    minZoom: number;
    maxZoom: number;
    overlays: string[];
    variants: string[];
    bounds: { southWest: [number, number]; northEast: [number, number] };
}

export const mapConfigs: Record<string, MapConfig> = {
    Arathia: {
        id: "ar",
        url: "/map/maps/arathia/{z}/{x}/{y}.webp",
        backgroundUrl: "/map/maps/arathiaBackground/{z}/{x}/{y}.webp",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
        bounds: { southWest: [-70, -170], northEast: [70, 170] },
    },
    "Arathia Clean": {
        id: "ar",
        url: "/map/maps/arathiaClean/{z}/{x}/{y}.webp",
        backgroundUrl: "/map/maps/arathiaBackground/{z}/{x}/{y}.webp",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
        bounds: { southWest: [-70, -170], northEast: [70, 170] },
    },
    "Arathia 1213 B.R": {
        id: "ar1213BR",
        url: "/map/maps/arathia1213BR/{z}/{x}/{y}.webp",
        backgroundUrl: "/map/maps/arathiaBackground/{z}/{x}/{y}.webp",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar1213BR"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
        bounds: { southWest: [-70, -170], northEast: [70, 170] },
    },
    Morturia: {
        id: "mo",
        url: "/map/maps/morturia/{z}/{x}/{y}.webp",
        backgroundUrl: "/map/maps/morturiaBackground/{z}/{x}/{y}.webp",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["mo"],
        variants: ["Morturia"],
        bounds: { southWest: [-70, -170], northEast: [70, 170] },
    },
    Elysium: {
        id: "el",
        url: "/map/maps/elysium/{z}/{x}/{y}.webp",
        backgroundUrl: "/map/maps/elysiumBackground/{z}/{x}/{y}.webp",
        minZoom: 2.5,
        maxZoom: 5.4,
        overlays: ["el"],
        variants: ["Elysium"],
        bounds: { southWest: [-70, -170], northEast: [70, 170] },
    },
};

export const regionCodes = ["ar", "ar1213BR", "mo", "el"] as const;

export const layerTypes = [
    "capital",
    "cityBig",
    "citySmall",
    "town",
    "nature",
    "important",
    "character",
] as const;

export const typeNames: Record<string, string> = {
    capital: "Capitals",
    cityBig: "Large Cities",
    citySmall: "Small Cities",
    town: "Towns",
    nature: "Nature",
    important: "Locations",
    character: "Characters",
};

export const mapConfigs: Record<
    string,
    {
        url: string;
        backgroundUrl: string;
        minZoom: number;
        maxZoom: number;
        overlays: string[];
        variants: string[];
    }
> = {
    Arathia: {
        url: "https://www.arathia.net/maps/Main/arathia/{z}/{x}/{y}.png",
        backgroundUrl:
            "https://www.arathia.net/maps/Main/arathiaBackground/{z}/{x}/{y}.png",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
    },
    "Arathia Clean": {
        url: "https://www.arathia.net/maps/Main/arathiaClean/{z}/{x}/{y}.png",
        backgroundUrl:
            "https://www.arathia.net/maps/Main/arathiaBackground/{z}/{x}/{y}.png",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
    },
    "Arathia 1213 B.R": {
        url: "https://www.arathia.net/maps/Main/arathia1213BR/{z}/{x}/{y}.png",
        backgroundUrl:
            "https://www.arathia.net/maps/Main/arathiaBackground/{z}/{x}/{y}.png",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["ar1213BR"],
        variants: ["Arathia", "Arathia Clean", "Arathia 1213 B.R"],
    },
    Morturia: {
        url: "https://www.arathia.net/maps/Main/morturia/{z}/{x}/{y}.png",
        backgroundUrl:
            "https://www.arathia.net/maps/Main/morturiaBackground/{z}/{x}/{y}.png",
        minZoom: 2.75,
        maxZoom: 5.4,
        overlays: ["mo"],
        variants: ["Morturia"],
    },
    Elysium: {
        url: "https://www.arathia.net/maps/Main/elysium/{z}/{x}/{y}.png",
        backgroundUrl:
            "https://www.arathia.net/maps/Main/elysiumBackground/{z}/{x}/{y}.png",
        minZoom: 2.5,
        maxZoom: 5.4,
        overlays: ["el"],
        variants: ["Elysium"],
    },
};

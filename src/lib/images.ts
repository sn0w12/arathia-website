export interface ImageInfo {
    url: string;
    size: [number, number];
    bbox: [number, number, number, number];
    scale?: { x: number; y: number };
}

interface BaseImage {
    url: string;
    size: [number, number];
}

const hoverBgBaseImage: BaseImage = {
    url: "/textures/hover_bg.webp",
    size: [2048, 2048],
};
const textures1BaseImage: BaseImage = {
    url: "/textures/textures_1.webp",
    size: [4096, 2520],
};
const textures2BaseImage: BaseImage = {
    url: "/textures/textures_2.webp",
    size: [2079, 963],
};
const cloudsBaseImage: BaseImage = {
    url: "/textures/clouds.webp",
    size: [2048, 2048],
};

export const images: ImageInfo[] = [
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [0, 0, 1228, 352],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [0, 352, 1131, 444],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1226, 0, 822, 335],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [0, 797, 981, 310],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [0, 1107, 954, 339],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1224, 335, 824, 357],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1036, 1072, 1012, 335],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1140, 751, 868, 265],
    },
];
export const smallImages: ImageInfo[] = [
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1586, 1422, 425, 263],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1588, 1702, 372, 258],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1074, 1412, 509, 379],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [376, 1458, 682, 449],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [0, 1472, 374, 443],
    },
];
export const lines: ImageInfo[] = [
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [1136, 708, 903, 17],
    },
    {
        url: hoverBgBaseImage.url,
        size: hoverBgBaseImage.size,
        bbox: [995, 1039, 1012, 13],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [0, 0, 2621, 10],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [0, 49, 2428, 9],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [0, 33, 2453, 10],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [0, 16, 2587, 10],
    },
];

export const lightTextures: ImageInfo[] = [
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [2647, 304, 1028, 89],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [2655, 417, 1033, 89],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [2657, 533, 1032, 89],
    },
    {
        url: textures1BaseImage.url,
        size: textures1BaseImage.size,
        bbox: [2655, 645, 1022, 88],
    },
];

export const tightTextures: ImageInfo[] = [
    {
        url: textures2BaseImage.url,
        size: textures2BaseImage.size,
        bbox: [88, 462, 1601, 145],
    },
    {
        url: textures2BaseImage.url,
        size: textures2BaseImage.size,
        bbox: [86, 308, 1603, 145],
    },
    {
        url: textures2BaseImage.url,
        size: textures2BaseImage.size,
        bbox: [87, 803, 1601, 146],
    },
];
export const clouds: ImageInfo[] = [
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [0, 0, 689, 287],
    },
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [0, 318, 684, 381],
    },
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [1441, 12, 533, 261],
    },
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [4, 728, 444, 239],
    },
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [949, 736, 381, 217],
    },
    {
        url: cloudsBaseImage.url,
        size: cloudsBaseImage.size,
        bbox: [0, 1090, 445, 350],
    },
];

export function calculateScale(
    sprite: ImageInfo,
    scale: number | { x: number; y: number },
    scaleMultiplier: number,
    flipH: number,
    flipV: number,
    fitMode: "default" | "fitHeight" | "fitWidth",
    ref: React.RefObject<HTMLElement | null>
) {
    if (!ref.current?.parentElement) return { x: 1, y: 1 };
    const parent = ref.current.parentElement as HTMLElement;

    const [, , spriteW, spriteH] = sprite.bbox;
    const scaleXMultiplier = typeof scale === "number" ? scale : scale.x;
    const scaleYMultiplier = typeof scale === "number" ? scale : scale.y;

    let scaleX =
        (parent.clientWidth / spriteW) *
        (sprite.scale?.x ?? 1) *
        scaleXMultiplier *
        scaleMultiplier *
        flipH;
    let scaleY =
        (parent.clientHeight / spriteH) *
        (sprite.scale?.y ?? 1) *
        scaleYMultiplier *
        scaleMultiplier *
        flipV;

    if (fitMode === "fitHeight") {
        scaleX = scaleY;
    } else if (fitMode === "fitWidth") {
        scaleY = scaleX;
    }

    return { x: scaleX, y: scaleY };
}

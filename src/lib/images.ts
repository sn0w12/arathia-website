import imagesJson from "../../public/textures/image-info/images.json";
import smallImagesJson from "../../public/textures/image-info/smallImages.json";
import linesJson from "../../public/textures/image-info/lines.json";
import lightTexturesJson from "../../public/textures/image-info/lightTextures.json";
import tightTexturesJson from "../../public/textures/image-info/tightTextures.json";
import cloudsJson from "../../public/textures/image-info/clouds.json";

export interface ImageInfo {
    url: string;
    size: [number, number];
    bbox: [number, number, number, number];
    scale?: { x: number; y: number };
}

export const images: ImageInfo[] = imagesJson as ImageInfo[];
export const smallImages: ImageInfo[] = smallImagesJson as ImageInfo[];
export const lines: ImageInfo[] = linesJson as ImageInfo[];
export const lightTextures: ImageInfo[] = lightTexturesJson as ImageInfo[];
export const tightTextures: ImageInfo[] = tightTexturesJson as ImageInfo[];
export const clouds: ImageInfo[] = cloudsJson as ImageInfo[];

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

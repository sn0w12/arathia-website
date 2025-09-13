import { StaticImageData } from "next/image";
import { MapCode } from ".";

import AnFlag from "../../../public/logos/countries/AntariaFlag.webp";
import OdFlag from "../../../public/logos/countries/OdrheimrFlag.webp";
import ThFlag from "../../../public/logos/countries/TunglheimrFlag.webp";
import RhFlag from "../../../public/logos/countries/RheinlandFlag.webp";
import AzFlag from "../../../public/logos/countries/AzurithFlag.webp";
import TsFlag from "../../../public/logos/countries/TsukiFlag.webp";
import PrFlag from "../../../public/logos/countries/PrimoriaFlag.webp";
import DrFlag from "../../../public/logos/countries/DryadalisFlag.webp";
import TcFlag from "../../../public/logos/countries/flag-placeholder.webp";
import GiFlag from "../../../public/logos/countries/flag-placeholder.webp";
import AcFlag from "../../../public/logos/countries/flag-placeholder.webp";
import GoFlag from "../../../public/logos/countries/GoldenOrderFlag.webp";
import FpFlag from "../../../public/logos/countries/FreePeopleFlag.webp";
import SeFlag from "../../../public/logos/countries/flag-placeholder.webp";
import TaFlag from "../../../public/logos/countries/flag-placeholder.webp";
import TyFlag from "../../../public/logos/countries/flag-placeholder.webp";
import DaFlag from "../../../public/logos/countries/flag-placeholder.webp";
import ScFlag from "../../../public/logos/countries/flag-placeholder.webp";

interface RegionInfo {
    mapId: MapCode;
    name: string;
    flag: {
        img: StaticImageData;
        alt: string;
    };
}

export const regionMap: Record<string, RegionInfo> = {
    an: {
        mapId: "ar",
        name: "Holy Antarian Empire",
        flag: { img: AnFlag, alt: "Antarian Flag" },
    },
    od: {
        mapId: "ar",
        name: "Odrheimr",
        flag: { img: OdFlag, alt: "Odrheimr Flag" },
    },
    th: {
        mapId: "ar",
        name: "Tunglheimr",
        flag: { img: ThFlag, alt: "Tunglheimr Flag" },
    },
    rh: {
        mapId: "ar",
        name: "Rheinland",
        flag: { img: RhFlag, alt: "Rheinland Flag" },
    },
    az: {
        mapId: "ar",
        name: "Azurith",
        flag: { img: AzFlag, alt: "Azurith Flag" },
    },
    ts: {
        mapId: "ar",
        name: "Tsuki Ōkoku",
        flag: { img: TsFlag, alt: "Tsuki Ōkoku Flag" },
    },
    pr: {
        mapId: "ar",
        name: "Primoria",
        flag: { img: PrFlag, alt: "Primorian Flag" },
    },
    dr: {
        mapId: "ar",
        name: "Dryadalis",
        flag: { img: DrFlag, alt: "Dryadalis Flag" },
    },
    tc: {
        mapId: "ar",
        name: "Central Arathian Gulf CO",
        flag: { img: TcFlag, alt: "Central Arathian Gulf CO Flag" },
    },
    gi: {
        mapId: "ar",
        name: "Gigantoria",
        flag: { img: GiFlag, alt: "Gigantoria Flag" },
    },
    ac: {
        mapId: "ar",
        name: "Arcarum",
        flag: { img: AcFlag, alt: "Arcarum Flag" },
    },
    go: {
        mapId: "ar",
        name: "Golden Order",
        flag: { img: GoFlag, alt: "Golden Order Flag" },
    },
    fp: {
        mapId: "ar",
        name: "Free People of Antaria",
        flag: { img: FpFlag, alt: "Free People of Antaria Flag" },
    },
    se: {
        mapId: "ar1213BR",
        name: "Seraphyria",
        flag: { img: SeFlag, alt: "Seraphyrian Flag" },
    },
    ta: {
        mapId: "ar1213BR",
        name: "Talasir",
        flag: { img: TaFlag, alt: "Talasir Flag" },
    },
    ty: {
        mapId: "ar1213BR",
        name: "Thyrania",
        flag: { img: TyFlag, alt: "Thyranian Flag" },
    },
    da: {
        mapId: "ar1213BR",
        name: "Drakoria",
        flag: { img: DaFlag, alt: "Drakorian Flag" },
    },
    sc: {
        mapId: "mo",
        name: "Scientia",
        flag: { img: ScFlag, alt: "Scientian Flag" },
    },
};

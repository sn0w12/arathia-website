export type TimelineEventLevel =
    | "Universe Changing Event"
    | "World Changing Event"
    | "National Event"
    | "Local Event";

export type Year = `${number} ${"B.R" | "B.A" | "A.A"}`;

export interface TimelineEvent {
    year: Year;
    title: string;
    description: string;
    level: TimelineEventLevel;
}

export interface Era {
    era: string;
    description: string;
    subcategories: {
        title: string;
        events: TimelineEvent[];
    }[];
}

export type Timeline = Era[];

export const timelines = {
    Arathia: "Timeline",
    Elysium: "ElysiumTimeline",
    Morturia: "MorturiaTimeline",
};

export async function fetchTimeline(
    name: keyof typeof timelines
): Promise<Timeline | null> {
    const response = await fetch(
        `https://www.arathia.net/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=Timeline:${timelines[name]}&origin=*`
    );
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const content = pages[pageId].revisions["0"]["*"];
    const timelineData = JSON.parse(content) as Timeline;
    return timelineData;
}

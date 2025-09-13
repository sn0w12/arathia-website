import { MetadataRoute } from "next";

interface WikiPageData {
    pageid: number;
    title: string;
    revisions?: Array<{
        timestamp: string;
    }>;
}

type ChangeFrequency = NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
>;

function calculateChangeFrequency(dates: Date[]): ChangeFrequency {
    if (dates.length === 0) return "monthly";
    if (dates.length === 1) {
        // For single date (wiki pages), estimate frequency based on how recent it is
        const daysSinceLastChange =
            (Date.now() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastChange <= 2) return "daily";
        if (daysSinceLastChange <= 14) return "weekly";
        if (daysSinceLastChange <= 60) return "monthly";
        return "yearly";
    }
    // For multiple dates, calculate based on average interval
    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
        intervals.push(dates[i - 1].getTime() - dates[i].getTime());
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const avgDays = avgInterval / (1000 * 60 * 60 * 24);
    if (avgDays <= 1) return "daily";
    if (avgDays <= 7) return "weekly";
    if (avgDays <= 30) return "monthly";
    return "yearly";
}

async function getLastModifiedFromGitHub(
    filePaths: string[]
): Promise<{ lastModified: Date; changeFrequency: ChangeFrequency }> {
    const owner = "sn0w12";
    const repo = "arathia-website";
    const allDates: Date[] = [];

    for (const filePath of filePaths) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&per_page=10`;
        const headers: Record<string, string> = {
            "User-Agent": "Arathia-Website-Sitemap-Generator/1.0",
        };
        if (process.env.GITHUB_TOKEN) {
            headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
        }

        try {
            const response = await fetch(apiUrl, { headers });
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                data.forEach(
                    (commit: { commit: { committer: { date: string } } }) =>
                        allDates.push(new Date(commit.commit.committer.date))
                );
            }
        } catch (error) {
            console.error(
                `Error fetching last modified for ${filePath}:`,
                error
            );
        }
    }

    allDates.sort((a, b) => b.getTime() - a.getTime());
    const lastModified = allDates.length > 0 ? allDates[0] : new Date();
    const changeFrequency = calculateChangeFrequency(allDates);

    return { lastModified, changeFrequency };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.arathia.net";

    const staticPageConfigs = [
        { url: baseUrl, filePaths: ["src/app/page.tsx"] },
        {
            url: `${baseUrl}/characters`,
            filePaths: ["src/app/characters/page.tsx"],
        },
        {
            url: `${baseUrl}/map`,
            filePaths: [
                "src/app/map/page.tsx",
                "src/components/map/map-client.tsx",
            ],
        },
        {
            url: `${baseUrl}/timeline`,
            filePaths: ["src/app/timeline/page.tsx"],
        },
    ];

    const staticPages = await Promise.all(
        staticPageConfigs.map(async ({ url, filePaths }) => {
            const { lastModified, changeFrequency } =
                await getLastModifiedFromGitHub(filePaths);
            return {
                url,
                lastModified,
                changeFrequency,
                priority: 1,
            };
        })
    );

    staticPages[0].priority = 1;
    staticPages.slice(1).forEach((page) => {
        page.priority = 0.8;
    });

    // Fetch wiki pages from MediaWiki API with pagination
    const wikiPages: MetadataRoute.Sitemap = [];
    let continueToken: string | undefined = undefined;

    try {
        do {
            const apiUrl = new URL("https://www.arathia.net/w/api.php");
            apiUrl.searchParams.set("action", "query");
            apiUrl.searchParams.set("generator", "allpages");
            apiUrl.searchParams.set("prop", "revisions");
            apiUrl.searchParams.set("rvprop", "timestamp");
            apiUrl.searchParams.set("gaplimit", "500");
            apiUrl.searchParams.set("format", "json");

            if (continueToken) {
                apiUrl.searchParams.set("gapcontinue", continueToken);
            }

            const response = await fetch(apiUrl.toString(), {
                headers: {
                    "User-Agent": "Arathia-Website-Sitemap-Generator/1.0",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.query && data.query.pages) {
                const pages = Object.values(data.query.pages) as WikiPageData[];
                const batchPages = pages.map((page) => {
                    const revisions = page.revisions || [];
                    const revisionDates = revisions
                        .map((r) => new Date(r.timestamp))
                        .sort((a, b) => b.getTime() - a.getTime());
                    const lastModified =
                        revisionDates.length > 0
                            ? revisionDates[0]
                            : new Date();
                    const changeFrequency =
                        calculateChangeFrequency(revisionDates);

                    return {
                        url: `${baseUrl}/wiki/${page.title.replace(/ /g, "_")}`,
                        lastModified,
                        changeFrequency,
                        priority: 0.5,
                    };
                });

                wikiPages.push(...batchPages);
            }

            continueToken = data.continue?.gapcontinue;
        } while (continueToken);
    } catch (error) {
        console.error("Error fetching wiki pages:", error);
        // Continue with empty wiki pages array
    }

    return [...staticPages, ...wikiPages];
}

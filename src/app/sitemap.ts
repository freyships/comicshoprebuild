import type { MetadataRoute } from "next";
import { fetchAllListings } from "@/lib/queries";
import { toStateUrl } from "@/lib/state-slugs";

const SITE_URL = "https://comicbookstores.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await fetchAllListings("state_slug, updated_at");

  // Dedupe states and track latest update per state
  const stateMap = new Map<string, Date>();
  for (const l of listings) {
    const existing = stateMap.get(l.state_slug);
    const updated = l.updated_at ? new Date(l.updated_at) : new Date();
    if (!existing || updated > existing) {
      stateMap.set(l.state_slug, updated);
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/find-comic-shops-by-state/`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const statePages: MetadataRoute.Sitemap = [...stateMap.entries()].map(
    ([slug, lastMod]) => ({
      url: `${SITE_URL}/${toStateUrl(slug)}/`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...statePages];
}

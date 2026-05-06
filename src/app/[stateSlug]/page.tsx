import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchAllListings } from "@/lib/queries";
import type { Listing } from "@/lib/types";
import { toStateUrl, fromStateUrl } from "@/lib/state-slugs";
import { parseDescription } from "@/lib/parse-description";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { PillarSearch } from "@/components/pillar/PillarSearch";
import { TableOfContents } from "@/components/pillar/TableOfContents";
import { StoreCard } from "@/components/pillar/StoreCard";

const SITE_URL = "https://comicbookstores.co";

// Only allow valid state slugs — 404 everything else
export const dynamicParams = false;

export async function generateStaticParams() {
  const raw = await fetchAllListings<"state_slug">("state_slug");
  const uniqueSlugs = [...new Set(raw.map((r) => r.state_slug))];
  return uniqueSlugs.map((s) => ({ stateSlug: toStateUrl(s) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stateSlug: string }>;
}): Promise<Metadata> {
  const { stateSlug } = await params;
  const dbSlug = fromStateUrl(stateSlug);
  if (!dbSlug) return {};

  // Fetch state name + count
  const { data } = await supabase
    .from("listings")
    .select("state")
    .eq("state_slug", dbSlug)
    .limit(1)
    .single();

  const stateName = data?.state ?? dbSlug.replace(/-/g, " ");
  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("state_slug", dbSlug);

  const title = `Comic Book Shops in ${stateName}`;
  const description = `Browse ${count ?? 0} comic book stores in ${stateName}. Find hours, directions, pricing, selection, and more for every shop.`;
  const canonical = `${SITE_URL}/${stateSlug}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Comic Book Store Finder",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

interface CityGroup {
  city: string;
  citySlug: string;
  listings: Listing[];
}

export default async function StatePillarPage({
  params,
}: {
  params: Promise<{ stateSlug: string }>;
}) {
  const { stateSlug } = await params;
  const dbSlug = fromStateUrl(stateSlug);
  if (!dbSlug) notFound();

  // Fetch all listings for this state
  const PAGE_SIZE = 1000;
  const all: Listing[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("state_slug", dbSlug)
      .order("city", { ascending: true })
      .order("name", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as Listing[]));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  if (all.length === 0) notFound();

  const stateName = all[0].state;

  // Group by city
  const cityMap = new Map<string, CityGroup>();
  for (const l of all) {
    if (!cityMap.has(l.city_slug)) {
      cityMap.set(l.city_slug, {
        city: l.city,
        citySlug: l.city_slug,
        listings: [],
      });
    }
    cityMap.get(l.city_slug)!.listings.push(l);
  }
  const cityGroups = [...cityMap.values()];

  // City list for search + TOC
  const cities = cityGroups.map((g) => ({
    name: g.city,
    slug: g.citySlug,
    count: g.listings.length,
  }));

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Find by State", url: "/find-comic-shops-by-state/" },
    { name: `Comic Book Shops in ${stateName}`, url: `/${stateSlug}/` },
  ];

  // ItemList schema
  const listItems = all.map((l) => ({
    name: l.name,
    url: `/${stateSlug}/#${l.city_slug}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(`Comic Book Shops in ${stateName}`, listItems)
          ),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1">»</span>
          <Link
            href="/find-comic-shops-by-state/"
            className="hover:text-primary"
          >
            Find by State
          </Link>
          <span className="mx-1">»</span>
          <span className="text-foreground">{stateName}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl font-bold mb-2">
          Comic Book Shops in {stateName}
        </h1>
        <p className="text-muted mb-6">
          Browse {all.length.toLocaleString()} comic book{" "}
          {all.length === 1 ? "store" : "stores"} across{" "}
          {cityGroups.length.toLocaleString()}{" "}
          {cityGroups.length === 1 ? "city" : "cities"} in {stateName}.
        </p>

        {/* Search */}
        <div className="mb-6">
          <PillarSearch cities={cities} />
        </div>

        {/* Table of Contents */}
        <div className="mb-8">
          <TableOfContents cities={cities} />
        </div>

        {/* City Sections */}
        {cityGroups.map((group) => (
          <section key={group.citySlug} id={group.citySlug} className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-1">
              Comic Book Shops in {group.city}
            </h2>
            <p className="text-sm text-muted mb-4">
              {group.listings.length}{" "}
              {group.listings.length === 1 ? "shop" : "shops"} in {group.city},{" "}
              {stateName}
            </p>
            <div className="grid gap-4">
              {group.listings.map((listing) => (
                <StoreCard
                  key={listing.id}
                  listing={listing}
                  attrs={parseDescription(listing.description)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Back to top */}
        <div className="text-center py-8 border-t border-border">
          <a
            href="#"
            className="text-sm text-primary hover:underline"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </>
  );
}

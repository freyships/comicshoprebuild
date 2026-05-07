import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchAllListings } from "@/lib/queries";
import type { Listing } from "@/lib/types";
import { toStateUrl, fromStateUrl } from "@/lib/state-slugs";
import { parseDescription } from "@/lib/parse-description";
import {
  breadcrumbSchema,
  itemListSchema,
  collectionPageSchema,
} from "@/lib/schema";
import { PillarSearch } from "@/components/pillar/PillarSearch";
import { TableOfContents } from "@/components/pillar/TableOfContents";
import { StoreCard } from "@/components/pillar/StoreCard";
import { BackToTop } from "@/components/pillar/BackToTop";

const SITE_URL = "https://comicbookstores.co";

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

  // Pull state name + per-city counts in one query
  const { data: rows } = await supabase
    .from("listings")
    .select("state, city")
    .eq("state_slug", dbSlug);

  if (!rows || rows.length === 0) return {};

  const stateName = rows[0].state;
  const total = rows.length;

  // Top 3 cities by count, for the meta description
  const cityCounts = new Map<string, number>();
  for (const r of rows) {
    cityCounts.set(r.city, (cityCounts.get(r.city) ?? 0) + 1);
  }
  const topCities = [...cityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([city]) => city);

  // Title: kept short for non short states; "Comic Book Shops in {state}" only.
  // For long state names (e.g. District of Columbia), use a tighter format
  const baseTitle =
    stateName.length > 18
      ? `Comic Book Shops in ${stateName}`
      : `Comic Book Shops in ${stateName} (${total})`;

  const description = topCities.length >= 2
    ? `Browse ${total} comic book stores in ${stateName}, including shops in ${topCities.slice(0, -1).join(", ")} and ${topCities[topCities.length - 1]}. Hours, addresses, and store details.`
    : `Browse ${total} comic book stores in ${stateName}. Hours, addresses, store details, and more for every comic shop.`;

  const canonical = `${SITE_URL}/${stateSlug}/`;

  return {
    title: baseTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: baseTitle,
      description,
      url: canonical,
      siteName: "Comic Book Store Finder",
      type: "website",
    },
    twitter: { card: "summary", title: baseTitle, description },
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

  // Pull every state for the cross-state internal-link section at the bottom
  const allStateRows = await fetchAllListings<"state" | "state_slug">(
    "state, state_slug"
  );
  const stateCounts = new Map<string, { state: string; count: number }>();
  for (const r of allStateRows) {
    const ex = stateCounts.get(r.state_slug);
    if (ex) ex.count++;
    else stateCounts.set(r.state_slug, { state: r.state, count: 1 });
  }
  const otherStates = [...stateCounts.entries()]
    .filter(([slug]) => slug !== dbSlug)
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => a.state.localeCompare(b.state));

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

  const cities = cityGroups.map((g) => ({
    name: g.city,
    slug: g.citySlug,
    count: g.listings.length,
  }));

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Find by State", url: "/find-comic-shops-by-state/" },
    { name: `Comic Book Shops in ${stateName}`, url: `/${stateSlug}/` },
  ];

  const listItems = all.map((l) => ({
    name: l.name,
    url: `/${stateSlug}/#${l.city_slug}`,
    city: l.city,
    state: l.state,
    zip: l.zip_code,
    street: l.street_address,
    phone: l.phone,
    website: l.website,
    image: l.featured_image_url,
  }));

  const pageDescription = `Browse ${all.length} comic book stores in ${stateName} across ${cityGroups.length} cities. Hours, addresses, and store details.`;

  let storeIndex = 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema({
              name: `Comic Book Shops in ${stateName}`,
              description: pageDescription,
              url: `${SITE_URL}/${stateSlug}/`,
            })
          ),
        }}
      />
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

      {/* Masthead */}
      <section className="border-b-[3px] border-ink bg-paper-bright">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <nav className="font-mono text-xs text-ink-mute mb-6 uppercase">
            <Link href="/" className="hover:text-pulp-red">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/find-comic-shops-by-state/" className="hover:text-pulp-red">
              States
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{stateName}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <p className="display text-xs uppercase tracking-widest text-pulp-red mb-3">
                Vol. {stateName} · Field Guide
              </p>
              <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[0.95] mb-4">
                Comic Book Shops
                <br />
                in <span className="ink-underline">{stateName}.</span>
              </h1>
              <p className="text-lg text-ink-soft italic max-w-2xl leading-relaxed">
                {all.length.toLocaleString()} cataloged{" "}
                {all.length === 1 ? "shop" : "shops"} across{" "}
                {cityGroups.length.toLocaleString()}{" "}
                {cityGroups.length === 1 ? "city" : "cities"}. Search below or
                scroll the directory.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="panel halftone bg-pulp-yellow p-5 text-center rotate-[-2deg] inline-block">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-1">
                  Shops
                </p>
                <p className="display text-5xl text-ink leading-none mb-1">
                  {all.length}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest">
                  in this state
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + TOC */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sticky top-[58px] z-30 bg-paper">
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <PillarSearch cities={cities} />
          <TableOfContents cities={cities} />
        </div>
      </div>

      {/* City Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {cityGroups.map((group, gi) => (
          <section
            key={group.citySlug}
            id={group.citySlug}
            className="mb-14 scroll-mt-32"
          >
            {/* City header */}
            <header className="mb-6 pb-4 border-b-[3px] border-ink relative">
              <p className="font-mono text-[11px] text-ink-mute uppercase tracking-widest mb-1">
                Section №{(gi + 1).toString().padStart(2, "0")}
              </p>
              <h2 className="display text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
                Comic Book Shops in{" "}
                <span className="text-pulp-red">{group.city}</span>
              </h2>
              <p className="font-mono text-xs text-ink-mute uppercase tracking-wide mt-1">
                {group.listings.length}{" "}
                {group.listings.length === 1 ? "shop" : "shops"} · {group.city},{" "}
                {stateName}
              </p>
            </header>

            <div className="grid gap-5">
              {group.listings.map((listing) => {
                const idx = storeIndex++;
                return (
                  <StoreCard
                    key={listing.id}
                    listing={listing}
                    attrs={parseDescription(listing.description)}
                    index={idx}
                  />
                );
              })}
            </div>
          </section>
        ))}

        {/* Other states — internal linking */}
        <section className="mt-16 pt-10 border-t-[3px] border-ink">
          <div className="mb-8">
            <p className="display text-xs uppercase tracking-widest text-pulp-red mb-2">
              Keep Browsing
            </p>
            <h2 className="display text-2xl sm:text-3xl text-ink leading-tight mb-2">
              Comic Book Shops in Other States
            </h2>
            <p className="text-sm text-ink-mute italic">
              Done with {stateName}? Hop to a neighboring state or anywhere else in the country.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {otherStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${toStateUrl(s.slug)}/`}
                className="panel-sm panel-hover-sm p-3 flex justify-between items-baseline group"
              >
                <span className="display text-sm text-ink group-hover:text-pulp-red transition-colors">
                  {s.state}
                </span>
                <span className="font-mono text-[10px] text-ink-mute">
                  {s.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <BackToTop />

        {/* End-of-issue marker */}
        <div className="text-center py-12 mt-12 border-t-[3px] border-ink">
          <p className="display text-3xl text-ink mb-2">END OF ISSUE</p>
          <p className="font-mono text-xs text-ink-mute uppercase tracking-widest mb-6">
            That's every shop we have for {stateName}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/find-comic-shops-by-state/" className="btn-pulp btn-pulp-white">
              ← Browse All States
            </Link>
            <a href="#" className="btn-pulp btn-pulp-yellow">
              ↑ Back to Top
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fetchAllListings } from "@/lib/queries";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { toStateUrl } from "@/lib/state-slugs";

export const metadata: Metadata = {
  title: "Find Comic Book Shops by State",
  description:
    "Browse comic book stores across all 50 US states. Find local comic shops, get hours, directions, and store details in your state.",
  alternates: {
    canonical: "https://comicbookstores.co/find-comic-shops-by-state/",
  },
};

interface StateRow {
  state: string;
  state_slug: string;
  count: number;
}

export default async function FindByStatePage() {
  const { data } = await supabase.rpc("get_states_with_counts");

  let states: StateRow[] = data ?? [];
  if (states.length === 0) {
    const raw = await fetchAllListings("state, state_slug");
    const map = new Map<string, StateRow>();
    for (const r of raw) {
      const key = r.state_slug;
      if (map.has(key)) {
        map.get(key)!.count++;
      } else {
        map.set(key, { state: r.state, state_slug: r.state_slug, count: 1 });
      }
    }
    states = [...map.values()].sort((a, b) => a.state.localeCompare(b.state));
  }

  const total = states.reduce((sum, s) => sum + s.count, 0);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Find Comic Shops by State", url: "/find-comic-shops-by-state/" },
  ];
  const listItems = states.map((s) => ({
    name: `Comic Book Shops in ${s.state}`,
    url: `/${toStateUrl(s.state_slug)}/`,
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
            itemListSchema("Comic Book Shops by State", listItems)
          ),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="font-mono text-xs text-ink-mute mb-8">
          <Link href="/" className="hover:text-pulp-red uppercase">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="uppercase text-ink">All States</span>
        </nav>

        {/* Title block */}
        <div className="mb-12">
          <p className="display text-xs uppercase tracking-widest text-pulp-red mb-3">
            The Atlas
          </p>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[0.95] mb-4">
            Comic Book Shops
            <br />
            <span className="ink-underline">By State.</span>
          </h1>
          <p className="text-lg text-ink-soft italic max-w-2xl leading-relaxed">
            {total.toLocaleString()} cataloged shops across {states.length} states &amp; territories — pick your turf.
          </p>
        </div>

        <hr className="ink-rule mb-10" />

        {/* States grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {states.map((s, i) => (
            <Link
              key={s.state_slug}
              href={`/${toStateUrl(s.state_slug)}/`}
              className="panel panel-hover p-5 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-ink-faint w-8">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div>
                  <p className="display text-xl text-ink group-hover:text-pulp-red transition-colors leading-tight">
                    {s.state}
                  </p>
                  <p className="font-mono text-xs text-ink-mute uppercase">
                    {s.count} {s.count === 1 ? "shop" : "shops"}
                  </p>
                </div>
              </div>
              <span className="display text-pulp-red text-2xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

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

  // Fallback: query manually if RPC doesn't exist yet
  let states: StateRow[] = data ?? [];
  if (states.length === 0) {
    const raw = await fetchAllListings("state, state_slug");

    const map = new Map<string, StateRow>();
    for (const r of raw) {
      const key = r.state_slug;
      if (map.has(key)) {
        map.get(key)!.count++;
      } else {
        map.set(key, {
          state: r.state,
          state_slug: r.state_slug,
          count: 1,
        });
      }
    }
    states = [...map.values()].sort((a, b) =>
      a.state.localeCompare(b.state)
    );
  }

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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-muted mb-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1">»</span>
          <span className="text-foreground">Find Comic Shops by State</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">
          Find Comic Book Shops by State
        </h1>
        <p className="text-muted mb-8">
          Browse {states.reduce((sum, s) => sum + s.count, 0).toLocaleString()}{" "}
          comic book stores across {states.length} states. Select your state to
          find local comic shops near you.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {states.map((s) => (
            <Link
              key={s.state_slug}
              href={`/${toStateUrl(s.state_slug)}/`}
              className="flex items-center justify-between border border-border rounded-lg px-4 py-3 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="font-medium">{s.state}</span>
              <span className="text-sm text-muted">{s.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { homeMetadata } from "@/lib/seo";
import { HomeSearch } from "@/components/HomeSearch";

export const metadata = homeMetadata();

const TOP_STATES = [
  { name: "California", slug: "comic-book-shops-in-california" },
  { name: "Texas", slug: "comic-book-shops-in-texas" },
  { name: "Florida", slug: "comic-book-shops-in-florida" },
  { name: "New York", slug: "comic-book-shops-in-new-york" },
  { name: "Illinois", slug: "comic-book-shops-in-illinois" },
  { name: "Pennsylvania", slug: "comic-book-shops-in-pennsylvania" },
  { name: "Ohio", slug: "comic-book-shops-in-ohio" },
  { name: "Michigan", slug: "comic-book-shops-in-michigan" },
];

export default async function HomePage() {
  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  const total = count?.toLocaleString() ?? "2,000";

  return (
    <>
      {/* Hero ============================================ */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 relative">
              <span className="sticker mb-6">★ NEW ISSUE ★</span>
              <h1 className="display text-5xl sm:text-6xl lg:text-7xl text-ink leading-[0.9] mb-6">
                Find every
                <br />
                comic shop
                <br />
                <span className="ink-underline text-pulp-red">in America.</span>
              </h1>
              <p className="text-lg sm:text-xl text-ink-soft max-w-xl mb-8 italic leading-relaxed">
                A coast to coast directory of brick and mortar comic stores. Hand cataloged, easy to browse, no algorithm slop.
              </p>
              <HomeSearch />
              <p className="mt-4 text-sm text-ink-mute font-mono">
                or{" "}
                <Link
                  href="/find-comic-shops-by-state/"
                  className="underline underline-offset-4 hover:text-pulp-red"
                >
                  browse all 51 states &amp; territories →
                </Link>
              </p>
            </div>

            {/* Big number panel */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="panel halftone p-8 lg:p-10 bg-pulp-yellow text-center rotate-[-2deg] max-w-[380px]">
                  <p className="display text-xs uppercase tracking-widest text-ink mb-2">
                    Cataloged To Date
                  </p>
                  <p
                    className="display text-7xl sm:text-8xl text-ink leading-none mb-3"
                    style={{ WebkitTextStroke: "1px var(--ink)" }}
                  >
                    {total}
                  </p>
                  <p className="display text-sm uppercase tracking-wide text-ink">
                    Comic Book Shops
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 starburst hidden sm:flex rotate-12">
                  ALL 50<br />STATES
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker text-center">
        ★ MARVEL ★ DC ★ IMAGE ★ DARK HORSE ★ MANGA ★ INDIE ★ TRADING CARDS ★ FUNKO POPS ★
      </div>

      {/* Top States Grid ================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="display text-xs uppercase tracking-widest text-pulp-red mb-2">
              Vol. 1 — Browse By State
            </p>
            <h2 className="display text-3xl sm:text-4xl text-ink leading-tight">
              Pick your <span className="ink-underline">turf.</span>
            </h2>
          </div>
          <Link
            href="/find-comic-shops-by-state/"
            className="display text-sm uppercase tracking-wider text-ink hover:text-pulp-red flex items-center gap-2 underline underline-offset-4"
          >
            See all states →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TOP_STATES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/${s.slug}/`}
              className="panel panel-hover-sm p-5 text-center group"
            >
              <p className="font-mono text-xs text-ink-mute mb-1">
                №{(i + 1).toString().padStart(2, "0")}
              </p>
              <p className="display text-xl text-ink group-hover:text-pulp-red transition-colors">
                {s.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* The Story / Editorial Block ================================ */}
      <section className="bg-paper-dim border-y-[3px] border-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="display text-xs uppercase tracking-widest text-pulp-blue mb-2">
                The Editorial
              </p>
              <h2 className="display text-3xl sm:text-4xl text-ink leading-tight mb-6">
                We catalog the shops.
                <br />
                <span className="text-pulp-red">You go visit.</span>
              </h2>
              <p className="text-lg text-ink-soft leading-relaxed mb-4 italic">
                Every shop in our directory was indexed by hand. Addresses verified, hours noted, vibe summarized.
              </p>
              <p className="text-base text-ink-mute leading-relaxed">
                No paid placements. No fake reviews. No three-paragraph SEO
                fluff. Just a well-organized list of where to buy your weekly
                pull, find that long box of back issues, or pick up a deck box
                of Magic singles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="panel p-5 bg-pulp-red text-white">
                <p className="display text-base mb-2 leading-tight">
                  Graphic Novels
                </p>
                <p className="text-sm leading-snug text-white/95">
                  Marvel, DC, Image, indie. Every shelf cataloged.
                </p>
              </div>
              <div className="panel p-5 bg-pulp-blue text-white">
                <p className="display text-base mb-2 leading-tight">
                  Vintage Back Issues
                </p>
                <p className="text-sm leading-snug text-white/95">
                  Long boxes deep with first appearances and Bronze Age finds.
                </p>
              </div>
              <div className="panel p-5 bg-pulp-yellow text-ink">
                <p className="display text-base mb-2 leading-tight">
                  Trading Cards
                </p>
                <p className="text-sm leading-snug text-ink-soft">
                  Pokémon, Magic, Yu Gi Oh, and sports card breakers.
                </p>
              </div>
              <div className="panel p-5 bg-paper-bright text-ink">
                <p className="display text-base mb-2 leading-tight">
                  Manga &amp; Anime
                </p>
                <p className="text-sm leading-snug text-ink-soft">
                  From Shonen Jump to seinen with deep import sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA ============================================ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="display text-xs uppercase tracking-widest text-pulp-red mb-3">
          Don't See Your Local?
        </p>
        <h2 className="display text-3xl sm:text-4xl text-ink leading-tight mb-6">
          Help us add the next shop.
        </h2>
        <p className="text-lg text-ink-mute mb-8 max-w-xl mx-auto italic">
          We're always growing the directory. Submit a missing store, fix an
          error, or send us a love letter.
        </p>
        <Link href="/contact/" className="btn-pulp btn-pulp-yellow">
          Submit A Shop →
        </Link>
      </section>
    </>
  );
}


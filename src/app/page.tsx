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
  { name: "Georgia", slug: "comic-book-shops-in-georgia" },
  { name: "Washington", slug: "comic-book-shops-in-washington" },
  { name: "Arizona", slug: "comic-book-shops-in-arizona" },
  { name: "Colorado", slug: "comic-book-shops-in-colorado" },
];

export default async function HomePage() {
  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Local Comic Book Stores
        </h1>
        <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
          Explore {count?.toLocaleString() ?? "2,000"}+ comic book stores in
          the US. Get insights on comic book product selection, pricing and
          more.
        </p>
        <HomeSearch />
      </section>

      {/* Top States */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Browse Comic Book Shops by State
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {TOP_STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}/`}
              className="border border-border rounded-full px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/find-comic-shops-by-state/"
            className="border border-primary text-primary rounded-full px-4 py-2 text-sm hover:bg-primary hover:text-white transition-colors"
          >
            All States →
          </Link>
        </div>
      </section>

      {/* Content sections */}
      <section className="py-8 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Graphic Novels &amp; Trade Paperbacks
          </h3>
          <p className="text-sm text-muted">
            Discover local stores with extensive collections of graphic novels,
            trade paperbacks, and collected editions from Marvel, DC, Image, and
            independent publishers.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Collectibles &amp; Figurines
          </h3>
          <p className="text-sm text-muted">
            Find stores stocking Funko Pops, statues, action figures, and other
            collectibles alongside their comic book selections.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Manga, Anime, Trading Cards &amp; More
          </h3>
          <p className="text-sm text-muted">
            From manga volumes and anime merchandise to Pokemon, Magic: The
            Gathering, and Yu-Gi-Oh cards — find shops that carry it all.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Comic Shop Prices &amp; Selection
          </h3>
          <p className="text-sm text-muted">
            Browse store insights to compare prices and selection before you
            visit. Find the best shops for your budget and interests.
          </p>
        </div>
      </section>
    </div>
  );
}

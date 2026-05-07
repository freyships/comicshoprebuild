import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Comic Book Store Finder helps you discover 2,000+ comic book stores across the United States. Learn more about our mission.",
  alternates: { canonical: "https://comicbookstores.co/about/" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="font-mono text-xs text-ink-mute mb-8 uppercase">
        <Link href="/" className="hover:text-pulp-red">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">About</span>
      </nav>

      <div className="mb-12">
        <p className="display text-xs uppercase tracking-widest text-pulp-red mb-3">
          The Origin Story
        </p>
        <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[0.95]">
          We catalog
          <br />
          <span className="ink-underline">the shops.</span>
        </h1>
      </div>

      <div className="space-y-8 text-lg text-ink-soft leading-relaxed">
        <div className="panel bg-paper-bright p-6 sm:p-8">
          <p className="text-xl italic text-ink mb-0 leading-relaxed">
            "Comic Book Store Finder is the most thorough, hand-cataloged
            directory of brick-and-mortar comic shops in the United States —
            no aggregator junk, no algorithmic noise."
          </p>
        </div>

        <p>
          We've indexed over <strong className="text-ink">2,000 stores</strong> across all 50 states to help comic
          fans, collectors, and casual browsers find their perfect local
          shop.
        </p>

        <Section
          tag="Vol. 01"
          title="Our Mission"
          color="text-pulp-blue"
        >
          <p>
            Every comic fan deserves a great local store. Whether you're hunting
            the latest Marvel and DC releases, searching for rare back issues,
            browsing manga and graphic novels, or looking for collectibles like
            Funko Pops and trading cards — we help you find the right shop.
          </p>
        </Section>

        <Section
          tag="Vol. 02"
          title="What We Catalog"
          color="text-pulp-red"
        >
          <ul className="space-y-3 list-none pl-0">
            <BulletItem label="Detailed store profiles">
              Addresses, phone numbers, business hours, and photos.
            </BulletItem>
            <BulletItem label="Honest insights">
              Product selection, pricing, atmosphere, and customer experience.
            </BulletItem>
            <BulletItem label="Easy state-by-state browsing">
              One long, thorough page per state — no clickbait, no thin pages.
            </BulletItem>
            <BulletItem label="No paid placements">
              We don't take money to bump stores. The order is alphabetical.
            </BulletItem>
          </ul>
        </Section>

        <Section
          tag="Vol. 03"
          title="For Store Owners"
          color="text-pulp-blue"
        >
          <p>
            If you own or manage a comic book store and want to update your
            listing — or if your shop is missing — please reach out through our{" "}
            <Link
              href="/contact/"
              className="text-pulp-red hover:text-pulp-red-dark underline underline-offset-4"
            >
              contact page
            </Link>
            . We want every shop represented accurately.
          </p>
        </Section>

        <Section
          tag="Vol. 04"
          title="Letters to the Editor"
          color="text-pulp-red"
        >
          <p>
            Have feedback, suggestions, or found an error? We'd love to hear
            from you. Visit our{" "}
            <Link
              href="/contact/"
              className="text-pulp-red hover:text-pulp-red-dark underline underline-offset-4"
            >
              contact page
            </Link>{" "}
            to get in touch.
          </p>
        </Section>
      </div>

      {/* CTA */}
      <div className="mt-16 panel bg-pulp-yellow p-8 text-center">
        <p className="display text-2xl sm:text-3xl text-ink mb-3 leading-tight">
          Ready to explore?
        </p>
        <p className="text-ink-soft italic mb-6">
          Pick your state and see every comic shop on the map.
        </p>
        <Link href="/find-comic-shops-by-state/" className="btn-pulp">
          Browse All States →
        </Link>
      </div>
    </div>
  );
}

function Section({
  tag,
  title,
  color,
  children,
}: {
  tag: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className={`display text-xs uppercase tracking-widest mb-2 ${color}`}>
        {tag}
      </p>
      <h2 className="display text-2xl sm:text-3xl text-ink leading-tight mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BulletItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 items-start">
      <span className="display text-pulp-red text-lg leading-none mt-1 shrink-0">
        ✱
      </span>
      <div>
        <strong className="text-ink">{label}.</strong>{" "}
        <span className="text-ink-soft">{children}</span>
      </div>
    </li>
  );
}

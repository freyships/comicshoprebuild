import Image from "next/image";
import type { Listing, BusinessHoursEntry } from "@/lib/types";
import type { StoreAttributes } from "@/lib/parse-description";

function Chip({
  label,
  positive,
}: {
  label: string;
  positive: boolean | null;
}) {
  if (positive === null) return null;
  return (
    <span className={`chip ${positive ? "chip-yes" : "chip-no"}`}>
      {positive ? "✓" : "✗"} {label}
    </span>
  );
}

function formatHoursCompact(hours: BusinessHoursEntry[]): string {
  if (hours.length === 0) return "";
  const groups: { days: string[]; time: string }[] = [];
  for (const h of hours) {
    const time = `${h.open}–${h.close}`;
    const last = groups[groups.length - 1];
    if (last && last.time === time) {
      last.days.push(h.day);
    } else {
      groups.push({ days: [h.day], time });
    }
  }
  const abbr: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return groups
    .map((g) => {
      const first = abbr[g.days[0]] ?? g.days[0];
      const last = abbr[g.days[g.days.length - 1]] ?? g.days[g.days.length - 1];
      const dayRange = g.days.length > 1 ? `${first}–${last}` : first;
      return `${dayRange} ${g.time}`;
    })
    .join(" · ");
}

export function StoreCard({
  listing,
  attrs,
  index,
}: {
  listing: Listing;
  attrs: StoreAttributes;
  index: number;
}) {
  const addressParts = [
    listing.street_address,
    listing.city,
    listing.state,
    listing.zip_code,
  ].filter(Boolean);

  const mapsQuery = encodeURIComponent(
    `${listing.name}, ${addressParts.join(", ")}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const hoursText = listing.business_hours
    ? formatHoursCompact(listing.business_hours)
    : null;

  return (
    <article
      id={`shop-${listing.slug}`}
      className="panel panel-hover-sm overflow-hidden scroll-mt-32"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image — comic-panel framed */}
        {listing.featured_image_url ? (
          <div className="relative sm:w-56 sm:shrink-0 aspect-[4/3] sm:aspect-auto sm:h-auto bg-paper-dim border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-ink">
            <Image
              src={listing.featured_image_url}
              alt={`${listing.name} comic book store in ${listing.city}, ${listing.state}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 224px"
            />
            <span className="absolute top-2 left-2 font-mono text-[10px] bg-ink text-paper-bright px-1.5 py-0.5 uppercase tracking-wider">
              №{(index + 1).toString().padStart(3, "0")}
            </span>
          </div>
        ) : (
          <div className="sm:w-56 sm:shrink-0 aspect-[4/3] sm:aspect-auto bg-paper-dim border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-ink flex items-center justify-center">
            <span className="display text-3xl text-ink-faint">?</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5">
          <header className="mb-3">
            <h3 className="display text-xl sm:text-2xl text-ink leading-tight mb-1">
              {listing.name}
            </h3>
            <p className="font-mono text-xs text-ink-mute uppercase tracking-wide">
              {addressParts.slice(1).join(" · ")}
            </p>
          </header>

          {listing.street_address && (
            <p className="text-sm text-ink-soft mb-3 italic">
              {listing.street_address}
            </p>
          )}

          {/* Contact + Hours row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-mono mb-4">
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="text-ink hover:text-pulp-red underline-offset-4 hover:underline flex items-center gap-1.5"
              >
                <span aria-hidden>☏</span>
                {listing.phone}
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pulp-blue hover:text-pulp-red underline-offset-4 hover:underline flex items-center gap-1.5"
              >
                <span aria-hidden>↗</span>
                Website
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pulp-blue hover:text-pulp-red underline-offset-4 hover:underline flex items-center gap-1.5"
            >
              <span aria-hidden>⌖</span>
              Directions
            </a>
          </div>

          {hoursText && (
            <p className="text-xs text-ink-mute font-mono mb-3 leading-relaxed">
              <span className="text-ink font-semibold">HOURS:</span> {hoursText}
            </p>
          )}

          {(listing.summary || attrs.summary) && (
            <p className="text-sm text-ink-soft leading-relaxed mb-4 italic border-l-[3px] border-pulp-yellow pl-3">
              {listing.summary ?? attrs.summary}
            </p>
          )}

          {/* Attribute chips */}
          <div className="flex flex-wrap gap-1.5">
            <Chip label="Kid-Friendly" positive={attrs.kidFriendly} />
            <Chip label="Collectibles" positive={attrs.hasCollectibles} />
            <Chip label="Trading Cards" positive={attrs.hasTradingCards} />
            <Chip label="Manga" positive={attrs.hasManga} />
            {attrs.pricingNote && (
              <span className="chip chip-blue">$ {attrs.pricingNote}</span>
            )}
            {attrs.selectionNote && (
              <span className="chip chip-pink">{attrs.selectionNote}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

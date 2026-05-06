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
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
        positive
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {positive ? "✓" : "✗"} {label}
    </span>
  );
}

function formatHoursCompact(hours: BusinessHoursEntry[]): string {
  if (hours.length === 0) return "";

  // Group consecutive days with the same hours
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
}: {
  listing: Listing;
  attrs: StoreAttributes;
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
    <div className="border border-border rounded-lg overflow-hidden bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        {listing.featured_image_url && (
          <div className="sm:w-48 sm:shrink-0 relative aspect-[4/3] sm:aspect-auto sm:h-auto">
            <Image
              src={listing.featured_image_url}
              alt={listing.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-1">{listing.name}</h3>

          {/* Address */}
          <p className="text-sm text-muted mb-2">{addressParts.join(", ")}</p>

          {/* Contact row */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="text-secondary hover:underline"
              >
                {listing.phone}
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                Website
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline"
            >
              Get Directions
            </a>
          </div>

          {/* Hours */}
          {hoursText && (
            <p className="text-xs text-muted mb-2">{hoursText}</p>
          )}

          {/* Summary */}
          {attrs.summary && (
            <p className="text-sm text-muted mb-2">{attrs.summary}</p>
          )}

          {/* Attribute chips */}
          <div className="flex flex-wrap gap-1.5">
            <Chip label="Kid-Friendly" positive={attrs.kidFriendly} />
            <Chip label="Collectibles" positive={attrs.hasCollectibles} />
            <Chip label="Trading Cards" positive={attrs.hasTradingCards} />
            <Chip label="Manga" positive={attrs.hasManga} />
            {attrs.pricingNote && (
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {attrs.pricingNote}
              </span>
            )}
            {attrs.selectionNote && (
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                {attrs.selectionNote}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

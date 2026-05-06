import type { Listing } from "@/lib/types";

export function ListingHeader({ listing }: { listing: Listing }) {
  const fullAddress = [
    listing.street_address,
    listing.city,
    listing.state,
    listing.zip_code,
    listing.country,
  ]
    .filter(Boolean)
    .join(", ");

  const directionsUrl =
    listing.latitude && listing.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
      <address className="not-italic text-muted mb-4">{fullAddress}</address>
      <div className="flex flex-wrap gap-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          Get Directions
        </a>
        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded hover:bg-surface transition-colors"
          >
            Visit Website
          </a>
        )}
        {listing.phone && (
          <a
            href={`tel:${listing.phone}`}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded hover:bg-surface transition-colors"
          >
            {listing.phone}
          </a>
        )}
      </div>
    </header>
  );
}

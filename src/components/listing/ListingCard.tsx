import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const href = `/comic-shop/${listing.country_slug}/${listing.state_slug}/${listing.city_slug}/${listing.slug}/`;

  return (
    <Link
      href={href}
      className="block border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
    >
      {listing.featured_image_url && (
        <div className="relative h-40 bg-surface">
          <Image
            src={listing.featured_image_url}
            alt={listing.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="font-semibold mb-1">{listing.name}</h2>
        <p className="text-sm text-muted">
          {listing.street_address && `${listing.street_address}, `}
          {listing.city}, {listing.state} {listing.zip_code}
        </p>
        {listing.phone && (
          <p className="text-sm text-muted mt-1">{listing.phone}</p>
        )}
      </div>
    </Link>
  );
}

import Image from "next/image";
import type { Listing } from "@/lib/types";

export function ListingImage({ listing }: { listing: Listing }) {
  if (!listing.featured_image_url) return null;

  return (
    <div className="relative mb-6 rounded-lg overflow-hidden aspect-video max-h-[420px]">
      <Image
        src={listing.featured_image_url}
        alt={`${listing.name} - Comic book store in ${listing.city}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 896px"
        preload
      />
    </div>
  );
}

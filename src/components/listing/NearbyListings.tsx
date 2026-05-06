import Link from "next/link";
import type { Listing } from "@/lib/types";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearbyListings({
  current,
  nearby,
}: {
  current: Listing;
  nearby: Listing[];
}) {
  if (nearby.length === 0) return null;

  const withDistance = nearby
    .filter((n) => n.id !== current.id)
    .map((n) => ({
      ...n,
      distance:
        current.latitude && current.longitude && n.latitude && n.longitude
          ? haversineDistance(
              Number(current.latitude),
              Number(current.longitude),
              Number(n.latitude),
              Number(n.longitude)
            )
          : null,
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    .slice(0, 5);

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Comic Book Stores Near You
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withDistance.map((n) => (
          <Link
            key={n.id}
            href={`/comic-shop/${n.country_slug}/${n.state_slug}/${n.city_slug}/${n.slug}/`}
            className="block border border-border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-1">{n.name}</h3>
            <p className="text-sm text-muted">
              {n.city}, {n.state}
            </p>
            {n.distance !== null && (
              <p className="text-xs text-muted mt-1">
                {n.distance < 0.1
                  ? `${Math.round(n.distance * 5280)} feet away`
                  : `${n.distance.toFixed(1)} miles away`}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

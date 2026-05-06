import Link from "next/link";
import type { Listing } from "@/lib/types";

export function Breadcrumbs({ listing }: { listing: Listing }) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: listing.country, href: `/comic-shop/${listing.country_slug}/` },
    {
      label: listing.state,
      href: `/comic-shop/${listing.country_slug}/${listing.state_slug}/`,
    },
    {
      label: listing.city,
      href: `/comic-shop/city/${listing.city_slug}/`,
    },
    { label: listing.name, href: "" },
  ];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted py-3">
      <ol className="flex flex-wrap gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">»</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

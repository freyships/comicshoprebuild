import type { Metadata } from "next";

const SITE_NAME = "Comic Book Store Finder";
const SITE_URL = "https://comicbookstores.co";
const DEFAULT_DESCRIPTION =
  "Explore 2000+ comic book stores in the US. Get insights on comic book product selection, pricing and more.";

export function listingMetadata(listing: {
  name: string;
  city: string;
  state: string;
  description: string | null;
  featured_image_url: string | null;
  country_slug: string;
  state_slug: string;
  city_slug: string;
  slug: string;
}): Metadata {
  const title = `${listing.name} - Comic Book Store in ${listing.city}, ${listing.state}`;
  const description = listing.description
    ? listing.description.slice(0, 160).replace(/\s+/g, " ").trim()
    : `Find ${listing.name} in ${listing.city}, ${listing.state}. Hours, directions, and more.`;
  const canonical = `${SITE_URL}/comic-shop/${listing.country_slug}/${listing.state_slug}/${listing.city_slug}/${listing.slug}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      ...(listing.featured_image_url
        ? { images: [{ url: listing.featured_image_url, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(listing.featured_image_url ? { images: [listing.featured_image_url] } : {}),
    },
  };
}

export function locationMetadata(opts: {
  type: "city" | "state" | "zip";
  label: string;
  count: number;
  path: string;
}): Metadata {
  const title = `Comic Book Shops in ${opts.label}`;
  const description =
    opts.count > 0
      ? `Browse ${opts.count} comic book ${opts.count === 1 ? "store" : "stores"} in ${opts.label}. Find hours, directions, and details.`
      : `Looking for comic book stores in ${opts.label}? Check back soon or browse nearby locations.`;
  const canonical = `${SITE_URL}${opts.path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title, description },
    ...(opts.count === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export function homeMetadata(): Metadata {
  return {
    title: `Find Your Local Comic Book Stores | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `Find Your Local Comic Book Stores | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Find Your Local Comic Book Stores | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

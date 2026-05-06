const SITE_URL = "https://comicbookstores.co";
const SITE_NAME = "Comic Book Store Finder";

interface BusinessHoursEntry {
  day: string;
  open: string;
  close: string;
}

interface Listing {
  name: string;
  description: string | null;
  street_address: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  business_hours: BusinessHoursEntry[] | null;
  featured_image_url: string | null;
  country_slug: string;
  state_slug: string;
  city_slug: string;
  slug: string;
}

const DAY_MAP: Record<string, string> = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

function to24h(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let h = parseInt(match[1], 10);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${h.toString().padStart(2, "0")}:${m}`;
}

export function localBusinessSchema(listing: Listing) {
  const url = `${SITE_URL}/comic-book-shops-in-${listing.state_slug}/#${listing.city_slug}`;

  const openingHours = (listing.business_hours ?? []).map((entry) => {
    const abbr = DAY_MAP[entry.day] ?? entry.day;
    return `${abbr} ${to24h(entry.open)}-${to24h(entry.close)}`;
  });

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    ...(listing.description
      ? { description: listing.description.slice(0, 300) }
      : {}),
    url,
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(listing.website ? { sameAs: listing.website } : {}),
    ...(listing.featured_image_url
      ? { image: listing.featured_image_url }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.street_address ?? "",
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip_code ?? "",
      addressCountry: listing.country,
    },
    ...(listing.latitude && listing.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: listing.latitude,
            longitude: listing.longitude,
          },
        }
      : {}),
    ...(openingHours.length > 0 ? { openingHours } : {}),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function itemListSchema(
  name: string,
  listings: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.name,
      url: `${SITE_URL}${l.url}`,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
  };
}

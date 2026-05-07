const SITE_URL = "https://comicbookstores.co";
const SITE_NAME = "Comic Book Store Finder";

interface ListItemInput {
  name: string;
  url: string;
  city?: string;
  state?: string;
  zip?: string | null;
  street?: string | null;
  phone?: string | null;
  website?: string | null;
  image?: string | null;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
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

/**
 * ItemList of stores with rich Place/LocalBusiness data per item.
 * Used on state pillar pages so search engines can extract structured
 * info for every shop without us emitting hundreds of separate scripts.
 */
export function itemListSchema(name: string, listings: ListItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => {
      const item: Record<string, unknown> = {
        "@type": "LocalBusiness",
        name: l.name,
        url: `${SITE_URL}${l.url}`,
      };
      if (l.image) item.image = l.image;
      if (l.phone) item.telephone = l.phone;
      if (l.website) item.sameAs = l.website;
      if (l.city && l.state) {
        item.address = {
          "@type": "PostalAddress",
          ...(l.street ? { streetAddress: l.street } : {}),
          addressLocality: l.city,
          addressRegion: l.state,
          ...(l.zip ? { postalCode: l.zip } : {}),
          addressCountry: "US",
        };
      }
      return {
        "@type": "ListItem",
        position: i + 1,
        item,
      };
    }),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
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

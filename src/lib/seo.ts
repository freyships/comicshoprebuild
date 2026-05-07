import type { Metadata } from "next";

const SITE_NAME = "Comic Book Store Finder";
const SITE_URL = "https://comicbookstores.co";
const DEFAULT_DESCRIPTION =
  "Find local comic book stores anywhere in the United States. Hand cataloged directory of over 2,000 comic shops with hours, addresses, and store details.";

export function homeMetadata(): Metadata {
  const title = `Find Your Local Comic Book Stores | ${SITE_NAME}`;
  return {
    title: { absolute: title },
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: {
      title,
      description: DEFAULT_DESCRIPTION,
      url: `${SITE_URL}/`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

/**
 * Utility for converting between database state_slug values
 * and SEO-friendly pillar page URL slugs.
 *
 * Database: "california"
 * URL:      "comic-book-shops-in-california"
 */

const PREFIX = "comic-book-shops-in-";

/** Convert a database state_slug to a pillar page URL slug. */
export function toStateUrl(stateSlug: string): string {
  return `${PREFIX}${stateSlug}`;
}

/** Extract the database state_slug from a pillar page URL slug. Returns null if format doesn't match. */
export function fromStateUrl(urlSlug: string): string | null {
  if (!urlSlug.startsWith(PREFIX)) return null;
  return urlSlug.slice(PREFIX.length);
}

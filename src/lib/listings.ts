// Listings live in the repo (data/listings.json), exported once from the old
// Supabase project with scripts/export_listings.mjs. Read only at build time:
// every page is pre-rendered, so visitors never trigger a data read.
//
// data/state-order.json keeps each state's listing order exactly as Postgres
// sorted it ("ORDER BY city, name"), so pages don't depend on JS string sorting.
//
// To edit listings: change data/listings.json (and state-order.json if you add,
// remove or rename a shop), commit, push. The site rebuilds automatically.
import listingsJson from "../../data/listings.json";
import stateOrderJson from "../../data/state-order.json";
import type { Listing } from "./types";

const ALL = listingsJson as unknown as Listing[];
const STATE_ORDER = stateOrderJson as Record<string, number[]>;
const BY_ID = new Map(ALL.map((l) => [l.id, l]));

/** Every listing, in the database row order the live (Vercel) build saw. That order
 *  breaks ties in the "top cities" meta description, so it must not be re-sorted.
 *  (One California row was moved to match the May 2026 build exactly.) */
export function allListings(): Listing[] {
  return ALL;
}

/** Listings in one state, ordered by city then name (database order). */
export function listingsForState(stateSlug: string): Listing[] {
  return (STATE_ORDER[stateSlug] ?? []).map((id) => BY_ID.get(id)!).filter(Boolean);
}

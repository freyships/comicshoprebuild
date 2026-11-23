import { allListings } from "./listings";
import type { Listing } from "./types";

/**
 * All listings with only the requested columns (comma-separated, like the old
 * Supabase select). Same rows, same order as before.
 */
export async function fetchAllListings<T extends keyof Listing>(
  select: string
): Promise<Pick<Listing, T>[]> {
  const cols = select.split(",").map((c) => c.trim()) as T[];
  return allListings().map((l) => {
    const row = {} as Pick<Listing, T>;
    for (const c of cols) row[c] = l[c];
    return row;
  });
}

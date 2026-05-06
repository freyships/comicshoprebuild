import { supabase } from "./supabase";
import type { Listing } from "./types";

/**
 * Fetch all rows from a table, paginating through Supabase's 1000-row limit.
 */
export async function fetchAllListings<T extends keyof Listing>(
  select: string
): Promise<Pick<Listing, T>[]> {
  const PAGE_SIZE = 1000;
  const all: any[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("listings")
      .select(select)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return all;
}

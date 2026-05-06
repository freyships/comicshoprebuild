"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // For now, redirect to the find-by-state page.
    // Users can then pick their state and use the in-page search.
    router.push("/find-comic-shops-by-state/");
    setQuery("");
  }

  return (
    <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by state, city, or zip…"
        className="flex-1 border border-border rounded-l-lg px-4 py-3 text-base focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="bg-primary text-white px-6 py-3 rounded-r-lg font-medium hover:bg-primary-hover transition-colors"
      >
        Search
      </button>
    </form>
  );
}

"use client";

import { useState, useMemo } from "react";

interface City {
  name: string;
  slug: string;
  count: number;
}

export function PillarSearch({ cities }: { cities: City[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return cities;
    const q = query.toLowerCase().trim();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, cities]);

  function handleJump(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setQuery("");
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city…"
        className="w-full border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary"
      />
      {query.trim() && filtered.length > 0 && (
        <ul className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filtered.slice(0, 20).map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => handleJump(c.slug)}
                className="w-full text-left px-4 py-2 hover:bg-surface transition-colors flex justify-between"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-muted">
                  {c.count} {c.count === 1 ? "shop" : "shops"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && filtered.length === 0 && (
        <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg px-4 py-3 text-muted text-sm">
          No cities found matching &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

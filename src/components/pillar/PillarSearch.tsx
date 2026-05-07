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
        placeholder="Search a city in this state…"
        className="input-pulp"
      />
      {query.trim() && filtered.length > 0 && (
        <ul className="absolute z-40 top-full left-0 right-0 mt-2 panel max-h-72 overflow-y-auto p-0">
          {filtered.slice(0, 30).map((c, i) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => handleJump(c.slug)}
                className={`w-full text-left px-4 py-3 hover:bg-pulp-yellow flex justify-between items-baseline transition-colors ${
                  i !== filtered.length - 1 ? "border-b-2 border-ink/15" : ""
                }`}
              >
                <span className="display text-base">{c.name}</span>
                <span className="font-mono text-xs text-ink-mute">
                  {c.count} {c.count === 1 ? "shop" : "shops"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && filtered.length === 0 && (
        <div className="absolute z-40 top-full left-0 right-0 mt-2 panel px-4 py-3 text-sm italic text-ink-mute">
          No cities found matching &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

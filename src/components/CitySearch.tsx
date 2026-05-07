"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type City = {
  n: string;   // city name
  c: string;   // city slug (anchor on pillar page)
  s: string;   // state name
  ss: string;  // state slug
  k: number;   // shop count
};

interface Props {
  variant?: "hero" | "header";
  placeholder?: string;
}

export function CitySearch({
  variant = "hero",
  placeholder = "Find your city or state",
}: Props) {
  const router = useRouter();
  const [cities, setCities] = useState<City[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Lazy fetch on first focus to avoid downloading 113KB on every page load
  async function ensureCities() {
    if (cities) return;
    try {
      const res = await fetch("/cities.json");
      const data: City[] = await res.json();
      setCities(data);
    } catch {
      setCities([]);
    }
  }

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = useMemo(() => {
    if (!query.trim() || !cities) return [];
    const q = query.toLowerCase().trim();

    type Match = { kind: "state" | "city"; rank: number; entry: City };
    const out: Match[] = [];
    const seenStates = new Set<string>();

    // 1. Find state matches first (deduped)
    for (const c of cities) {
      if (seenStates.has(c.ss)) continue;
      const sname = c.s.toLowerCase();
      if (sname.startsWith(q)) {
        out.push({ kind: "state", rank: 0, entry: c });
        seenStates.add(c.ss);
      } else if (sname.includes(q)) {
        out.push({ kind: "state", rank: 1, entry: c });
        seenStates.add(c.ss);
      }
    }

    // 2. City matches
    for (const c of cities) {
      const cname = c.n.toLowerCase();
      if (cname.startsWith(q)) {
        out.push({ kind: "city", rank: 0, entry: c });
      } else if (cname.includes(q)) {
        out.push({ kind: "city", rank: 2, entry: c });
      }
    }

    out.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      // Bigger cities first within same rank
      return b.entry.k - a.entry.k;
    });
    return out.slice(0, 8);
  }, [query, cities]);

  function go(m: { kind: "state" | "city"; entry: City }) {
    const base = `/comic-book-shops-in-${m.entry.ss}/`;
    const url = m.kind === "city" ? `${base}#${m.entry.c}` : base;
    setOpen(false);
    setQuery("");
    router.push(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0) {
      go(matches[Math.max(0, Math.min(active, matches.length - 1))]);
    } else if (query.trim()) {
      router.push("/find-comic-shops-by-state/");
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = variant === "hero";

  const inputClass = isHero
    ? "input-pulp text-base"
    : "bg-paper border-[2.5px] border-ink px-3 py-2 text-sm font-mono w-full focus:outline-none focus:bg-paper-bright placeholder:text-ink-mute";

  const wrapClass = isHero
    ? "flex max-w-lg w-full"
    : "flex w-full";

  return (
    <div ref={wrapRef} className={`relative ${isHero ? "max-w-lg w-full" : "w-full"}`}>
      <form onSubmit={handleSubmit} className={wrapClass}>
        <div className={isHero ? "flex-1" : "flex flex-1"}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => {
              ensureCities();
              if (query.trim()) setOpen(true);
            }}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className={inputClass}
            autoComplete="off"
          />
          {!isHero && (
            <button
              type="submit"
              className="bg-ink text-paper-bright border-[2.5px] border-ink border-l-0 px-3 py-2 hover:bg-pulp-red transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          )}
        </div>
        {isHero && (
          <button type="submit" className="btn-pulp ml-3 shrink-0">
            Search →
          </button>
        )}
      </form>

      {open && query.trim() && (
        <div
          className={`absolute z-50 left-0 ${isHero ? "right-0 max-w-lg" : "right-0"} mt-2 panel-sm bg-paper-bright max-h-80 overflow-y-auto`}
        >
          {matches.length === 0 && cities !== null && (
            <p className="px-4 py-3 text-sm italic text-ink-mute">
              No matches for &ldquo;{query}&rdquo;. Try a city or state name.
            </p>
          )}
          {matches.length === 0 && cities === null && (
            <p className="px-4 py-3 text-sm italic text-ink-mute">Loading cities…</p>
          )}
          {matches.map((m, i) => (
            <button
              key={`${m.kind}-${m.entry.ss}-${m.entry.c}-${i}`}
              type="button"
              onClick={() => go(m)}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left px-4 py-2.5 flex justify-between items-baseline gap-3 transition-colors ${
                i === active ? "bg-pulp-yellow" : "hover:bg-pulp-yellow"
              } ${i !== matches.length - 1 ? "border-b-2 border-ink/15" : ""}`}
            >
              <span className="min-w-0">
                {m.kind === "city" ? (
                  <>
                    <span className="display text-sm">{m.entry.n}</span>
                    <span className="text-xs text-ink-mute italic ml-2">
                      in {m.entry.s}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="display text-sm">{m.entry.s}</span>
                    <span className="text-xs text-ink-mute italic ml-2">all shops</span>
                  </>
                )}
              </span>
              <span className="font-mono text-[10px] text-ink-mute uppercase shrink-0">
                {m.kind === "city" ? `${m.entry.k} shop${m.entry.k === 1 ? "" : "s"}` : "state"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" strokeLinecap="round" />
    </svg>
  );
}

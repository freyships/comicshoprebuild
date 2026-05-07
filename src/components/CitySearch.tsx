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

type Shop = {
  n: string;   // shop name
  sl: string;  // shop slug (anchor on pillar page: #shop-{sl})
  ss: string;  // state slug
  cs: string;  // city slug (fallback anchor)
};

type Index = { cities: City[]; shops: Shop[] };

type Match =
  | { kind: "state"; rank: number; entry: City }
  | { kind: "city"; rank: number; entry: City }
  | { kind: "shop"; rank: number; entry: Shop };

interface Props {
  variant?: "hero" | "header";
  placeholder?: string;
}

export function CitySearch({
  variant = "hero",
  placeholder = "Search by city, state, or shop name",
}: Props) {
  const router = useRouter();
  const [index, setIndex] = useState<Index | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Lazy fetch on first focus
  async function ensureIndex() {
    if (index) return;
    try {
      const res = await fetch("/cities.json");
      const data: Index = await res.json();
      setIndex(data);
    } catch {
      setIndex({ cities: [], shops: [] });
    }
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = useMemo<Match[]>(() => {
    if (!query.trim() || !index) return [];
    const q = query.toLowerCase().trim();
    const out: Match[] = [];
    const seenStates = new Set<string>();

    // States (deduped) — rank 0 prefix, rank 1 contains
    for (const c of index.cities) {
      if (seenStates.has(c.ss)) continue;
      const sname = c.s.toLowerCase();
      if (sname.startsWith(q)) {
        out.push({ kind: "state", rank: 0, entry: c });
        seenStates.add(c.ss);
      } else if (sname.includes(q)) {
        out.push({ kind: "state", rank: 2, entry: c });
        seenStates.add(c.ss);
      }
    }

    // Cities — rank 0 prefix, rank 2 contains
    for (const c of index.cities) {
      const cname = c.n.toLowerCase();
      if (cname.startsWith(q)) {
        out.push({ kind: "city", rank: 0, entry: c });
      } else if (cname.includes(q)) {
        out.push({ kind: "city", rank: 3, entry: c });
      }
    }

    // Shops — rank 1 prefix, rank 4 contains (shops typically less specific)
    for (const s of index.shops) {
      const sn = s.n.toLowerCase();
      if (sn.startsWith(q)) {
        out.push({ kind: "shop", rank: 1, entry: s });
      } else if (sn.includes(q)) {
        out.push({ kind: "shop", rank: 4, entry: s });
      }
    }

    out.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      // Tiebreak: cities by shop count, shops/states by name
      if (a.kind === "city" && b.kind === "city") {
        return b.entry.k - a.entry.k;
      }
      return a.entry.n.localeCompare(b.entry.n);
    });

    return out.slice(0, 10);
  }, [query, index]);

  function go(m: Match) {
    let url = "";
    if (m.kind === "state") {
      url = `/comic-book-shops-in-${m.entry.ss}/`;
    } else if (m.kind === "city") {
      url = `/comic-book-shops-in-${m.entry.ss}/#${m.entry.c}`;
    } else {
      url = `/comic-book-shops-in-${m.entry.ss}/#shop-${m.entry.sl}`;
    }
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
  const wrapClass = isHero ? "flex max-w-lg w-full" : "flex w-full";

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
              ensureIndex();
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
          className={`absolute z-[60] left-0 ${isHero ? "right-0 max-w-lg" : "right-0"} mt-2 panel-sm bg-paper-bright max-h-96 overflow-y-auto`}
        >
          {matches.length === 0 && index !== null && (
            <p className="px-4 py-3 text-sm italic text-ink-mute">
              No matches for &ldquo;{query}&rdquo;. Try a city, state, or shop name.
            </p>
          )}
          {matches.length === 0 && index === null && (
            <p className="px-4 py-3 text-sm italic text-ink-mute">Loading…</p>
          )}
          {matches.map((m, i) => {
            const isActive = i === active;
            const rowCls = `w-full text-left px-4 py-2.5 flex justify-between items-baseline gap-3 transition-colors ${
              isActive ? "bg-pulp-yellow" : "hover:bg-pulp-yellow"
            } ${i !== matches.length - 1 ? "border-b-2 border-ink/15" : ""}`;
            return (
              <button
                key={`${m.kind}-${i}`}
                type="button"
                onClick={() => go(m)}
                onMouseEnter={() => setActive(i)}
                className={rowCls}
              >
                <span className="min-w-0 flex-1 truncate">
                  {m.kind === "state" && (
                    <>
                      <span className="display text-sm">{m.entry.s}</span>
                      <span className="text-xs text-ink-mute italic ml-2">
                        all shops
                      </span>
                    </>
                  )}
                  {m.kind === "city" && (
                    <>
                      <span className="display text-sm">{m.entry.n}</span>
                      <span className="text-xs text-ink-mute italic ml-2">
                        in {m.entry.s}
                      </span>
                    </>
                  )}
                  {m.kind === "shop" && (
                    <>
                      <span className="text-sm font-semibold">
                        {m.entry.n}
                      </span>
                    </>
                  )}
                </span>
                <span className="font-mono text-[10px] text-ink-mute uppercase shrink-0">
                  {m.kind === "state" && "state"}
                  {m.kind === "city" &&
                    `${m.entry.k} shop${m.entry.k === 1 ? "" : "s"}`}
                  {m.kind === "shop" && "shop"}
                </span>
              </button>
            );
          })}
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

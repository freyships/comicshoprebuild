"use client";

import { useState } from "react";

interface City {
  name: string;
  slug: string;
  count: number;
}

export function TableOfContents({ cities }: { cities: City[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="panel-sm bg-paper-bright">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-pulp-yellow transition-colors"
        aria-expanded={open}
      >
        <span className="display text-sm uppercase tracking-wider">
          Index — {cities.length} {cities.length === 1 ? "city" : "cities"}
        </span>
        <span
          className={`display text-lg transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t-[2.5px] border-ink p-4 grid gap-x-4 gap-y-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-paper">
          {cities.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="flex justify-between items-baseline py-1 text-sm hover:text-pulp-red transition-colors"
              onClick={() => setOpen(false)}
            >
              <span className="truncate">{c.name}</span>
              <span className="font-mono text-xs text-ink-mute ml-2 shrink-0">
                {c.count}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

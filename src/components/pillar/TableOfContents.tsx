"use client";

interface City {
  name: string;
  slug: string;
  count: number;
}

export function TableOfContents({ cities }: { cities: City[] }) {
  return (
    <details className="border border-border rounded-lg bg-surface">
      <summary className="px-4 py-3 cursor-pointer font-medium text-sm select-none">
        Jump to a City ({cities.length} cities)
      </summary>
      <div className="px-4 pb-4 grid gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-sm">
        {cities.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="hover:text-primary transition-colors py-0.5"
          >
            {c.name}{" "}
            <span className="text-muted">({c.count})</span>
          </a>
        ))}
      </div>
    </details>
  );
}

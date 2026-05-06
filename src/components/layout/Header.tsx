"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Redirect to find-by-state; in-page search handles city filtering
    router.push("/find-comic-shops-by-state/");
    setQuery("");
  }

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Comic Book Store Finder"
            width={600}
            height={150}
            className="h-14 w-auto"
          />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by state or city…"
            className="flex-1 border border-border rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r text-sm hover:bg-primary-hover transition-colors"
          >
            Search
          </button>
        </form>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/find-comic-shops-by-state/" className="text-foreground hover:text-primary transition-colors">
            Find by State
          </Link>
          <Link href="/about/" className="text-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact/" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by state or city…"
            className="flex-1 border border-border rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r text-sm hover:bg-primary-hover transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push("/find-comic-shops-by-state/");
    setQuery("");
  }

  return (
    <form onSubmit={handleSearch} className="flex max-w-lg w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find your state…"
        className="flex-1 input-pulp text-base"
      />
      <button type="submit" className="btn-pulp ml-3 shrink-0">
        Search →
      </button>
    </form>
  );
}

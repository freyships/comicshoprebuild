"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CitySearch } from "@/components/CitySearch";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top ticker strip */}
      <div className="ticker text-center">
        ★ ISSUE 001 ★ COAST-TO-COAST COMIC SHOP DIRECTORY ★ EST. 2024 ★
      </div>

      <header className="bg-paper-bright border-b-[3px] border-ink sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 flex items-center gap-3">
            <div className="bg-pulp-red border-[2.5px] border-ink shadow-[3px_3px_0_0_var(--ink)] w-11 h-11 flex items-center justify-center rotate-[-3deg]">
              <span className="display text-white text-xl">CB</span>
            </div>
            <span className="display text-xl sm:text-2xl text-ink leading-none">
              Comic Book
              <br />
              <span className="text-pulp-red">Stores</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/find-comic-shops-by-state/">Browse States</NavLink>
            <NavLink href="/about/">About</NavLink>
            <NavLink href="/contact/">Contact</NavLink>
          </nav>

          {/* Desktop search */}
          <div className="hidden lg:block w-56">
            <CitySearch variant="header" placeholder="Find a city" />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((m) => !m)}
            className="md:hidden border-[2.5px] border-ink bg-pulp-yellow shadow-[3px_3px_0_0_var(--ink)] p-2"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" strokeLinecap="round" />
                  <path d="M4 12h16" strokeLinecap="round" />
                  <path d="M4 17h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t-[3px] border-ink bg-paper-bright px-4 py-4 space-y-3">
            <CitySearch variant="header" placeholder="Find a city" />
            <nav className="flex flex-col gap-1">
              <MobileLink href="/find-comic-shops-by-state/" onClick={() => setMenuOpen(false)}>
                Browse States
              </MobileLink>
              <MobileLink href="/about/" onClick={() => setMenuOpen(false)}>
                About
              </MobileLink>
              <MobileLink href="/contact/" onClick={() => setMenuOpen(false)}>
                Contact
              </MobileLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="display text-xs text-ink px-3 py-2 hover:bg-pulp-yellow border-2 border-transparent hover:border-ink transition-colors uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="display text-sm text-ink px-3 py-2.5 hover:bg-pulp-yellow border-2 border-transparent hover:border-ink uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}

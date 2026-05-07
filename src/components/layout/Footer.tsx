import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t-[4px] border-ink bg-paper-dim">
      {/* Sawtooth top border */}
      <div
        aria-hidden
        className="h-3 bg-ink"
        style={{
          maskImage:
            "linear-gradient(135deg, var(--ink) 25%, transparent 25%) 0 0/14px 14px",
          WebkitMaskImage:
            "linear-gradient(135deg, var(--ink) 25%, transparent 25%) 0 0/14px 14px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3 mb-10">
          <div>
            <p className="display text-2xl text-ink mb-2 leading-tight">
              Comic Book
              <br />
              <span className="text-pulp-red">Stores</span>
            </p>
            <p className="text-sm text-ink-mute italic max-w-xs">
              An independent directory of every brick-and-mortar comic shop in the United States.
            </p>
          </div>

          <div>
            <p className="display text-xs text-ink-mute uppercase tracking-widest mb-4">
              Browse
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-pulp-red underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-comic-shops-by-state/" className="hover:text-pulp-red underline-offset-4 hover:underline">
                  All States
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-pulp-red underline-offset-4 hover:underline">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="display text-xs text-ink-mute uppercase tracking-widest mb-4">
              Letters to the Editor
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about/" className="hover:text-pulp-red underline-offset-4 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-pulp-red underline-offset-4 hover:underline">
                  Contact / Submit a Shop
                </Link>
              </li>
              <li>
                <a
                  href="mailto:comicbookstorefinder@gmail.com"
                  className="hover:text-pulp-red underline-offset-4 hover:underline break-all"
                >
                  comicbookstorefinder@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="ink-rule mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 text-xs text-ink-mute font-mono">
          <p>© {new Date().getFullYear()} COMIC BOOK STORE FINDER · ALL RIGHTS RESERVED</p>
          <p className="italic">PRINTED ON DIGITAL NEWSPRINT</p>
        </div>
      </div>
    </footer>
  );
}

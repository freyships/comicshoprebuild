import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Comic Book Store Finder</p>
        <nav className="flex gap-6">
          <Link href="/find-comic-shops-by-state/" className="hover:text-primary transition-colors">
            Find by State
          </Link>
          <Link href="/about/" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact/" className="hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/sitemap.xml" className="hover:text-primary transition-colors">
            Sitemap
          </Link>
        </nav>
      </div>
    </footer>
  );
}

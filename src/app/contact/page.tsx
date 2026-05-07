import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Comic Book Store Finder. Report listing errors, suggest new stores, or ask questions.",
  alternates: { canonical: "https://comicbookstores.co/contact/" },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="font-mono text-xs text-ink-mute mb-8 uppercase">
        <Link href="/" className="hover:text-pulp-red">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Contact</span>
      </nav>

      <div className="mb-10">
        <p className="display text-xs uppercase tracking-widest text-pulp-red mb-3">
          Letters to the Editor
        </p>
        <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[0.95] mb-4">
          Drop us a <span className="ink-underline">line.</span>
        </h1>
        <p className="text-lg text-ink-soft italic max-w-xl leading-relaxed">
          Spotted an error in a listing? Want to suggest a shop we missed? Own
          a comic store? Send a note below.
        </p>
      </div>

      <div className="panel bg-paper-bright p-6 sm:p-8 mb-10">
        <ContactForm />
      </div>

      <div className="border-t-[3px] border-ink pt-8">
        <p className="display text-xs uppercase tracking-widest text-pulp-blue mb-2">
          Other Ways To Reach Us
        </p>
        <h2 className="display text-2xl text-ink mb-3">Send a postcard.</h2>
        <p className="text-base text-ink-soft">
          Email directly:{" "}
          <a
            href="mailto:comicbookstorefinder@gmail.com"
            className="text-pulp-red hover:text-pulp-red-dark underline underline-offset-4 break-all"
          >
            comicbookstorefinder@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

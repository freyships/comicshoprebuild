import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Comic Book Store Finder. Report listing errors, suggest new stores, or ask questions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question, found an error in a listing, or want to suggest a new
        store? Fill out the form below and we&apos;ll get back to you as soon as
        possible.
      </p>

      <ContactForm />

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
        <p className="text-muted">
          Email us directly at{" "}
          <a
            href="mailto:comicbookstorefinder@gmail.com"
            className="text-primary hover:underline"
          >
            comicbookstorefinder@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

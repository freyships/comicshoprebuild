import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Comic Book Store Finder helps you discover 2,000+ comic book stores across the United States. Learn more about our mission.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Comic Book Store Finder</h1>

      <div className="space-y-6 text-foreground leading-relaxed">
        <p>
          Comic Book Store Finder is the most comprehensive directory of comic
          book stores in the United States. We&apos;ve cataloged over 2,000
          stores across all 50 states to help comic fans find their perfect
          local shop.
        </p>

        <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
        <p>
          We believe every comic fan deserves a great local store. Whether
          you&apos;re hunting for the latest Marvel and DC releases, searching
          for rare back issues, browsing manga and graphic novels, or looking
          for collectibles like Funko Pops and trading cards — we help you find
          the right shop.
        </p>

        <h2 className="text-xl font-semibold mt-8">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Detailed store profiles</strong> with addresses, phone
            numbers, business hours, and photos
          </li>
          <li>
            <strong>Honest insights</strong> on product selection, pricing,
            atmosphere, and customer experience
          </li>
          <li>
            <strong>Easy search</strong> by city name or zip code to find stores
            near you
          </li>
          <li>
            <strong>Nearby store suggestions</strong> so you can plan visits to
            multiple shops in your area
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">For Store Owners</h2>
        <p>
          If you own or manage a comic book store and would like to update your
          listing information, please reach out to us through our{" "}
          <a href="/contact/" className="text-primary hover:underline">
            contact page
          </a>
          . We want to make sure every store is represented accurately.
        </p>

        <h2 className="text-xl font-semibold mt-8">Stay Connected</h2>
        <p>
          Have feedback, suggestions, or found an error? We&apos;d love to hear
          from you. Visit our{" "}
          <a href="/contact/" className="text-primary hover:underline">
            contact page
          </a>{" "}
          to get in touch.
        </p>
      </div>
    </div>
  );
}

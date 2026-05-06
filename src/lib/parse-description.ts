export interface StoreAttributes {
  summary: string;
  kidFriendly: boolean | null;
  hasCollectibles: boolean | null;
  hasTradingCards: boolean | null;
  hasManga: boolean | null;
  pricingNote: string | null;
  selectionNote: string | null;
}

/**
 * Parse a GeoDirectory description into concise, scannable attributes.
 */
export function parseDescription(raw: string | null): StoreAttributes {
  if (!raw) {
    return {
      summary: "",
      kidFriendly: null,
      hasCollectibles: null,
      hasTradingCards: null,
      hasManga: null,
      pricingNote: null,
      selectionNote: null,
    };
  }

  const text = raw.replace(/&amp;/g, "&");

  // Extract sections by known headings
  const sections = new Map<string, string>();
  const headings = [
    "Comic Book Store Details",
    "How much do things cost here?",
    "How's the product selection here?",
    "Collectibles & Action Figures",
    "Trading Cards, Manga, Anime & More",
    "Is this place kid-friendly?",
  ];

  for (let i = 0; i < headings.length; i++) {
    const start = text.indexOf(headings[i]);
    if (start === -1) continue;

    const contentStart = start + headings[i].length;
    let end = text.length;
    for (let j = 0; j < headings.length; j++) {
      if (j === i) continue;
      const nextStart = text.indexOf(headings[j], contentStart);
      if (nextStart !== -1 && nextStart < end) {
        end = nextStart;
      }
    }
    sections.set(headings[i], text.slice(contentStart, end).trim());
  }

  // Build summary: first 1-2 sentences from the main section
  const mainContent =
    sections.get("Comic Book Store Details") ?? text.split("\n\n")[1] ?? "";
  const firstSentences = mainContent
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ")
    .trim();
  const summary = firstSentences.length > 200
    ? firstSentences.slice(0, 197) + "..."
    : firstSentences;

  // Kid-friendly detection
  const kidSection = sections.get("Is this place kid-friendly?") ?? "";
  let kidFriendly: boolean | null = null;
  if (kidSection) {
    const lower = kidSection.toLowerCase();
    if (
      lower.includes("family-friendly") ||
      lower.includes("kid-friendly") ||
      lower.includes("children love") ||
      lower.includes("young readers") ||
      lower.includes("great for kids") ||
      lower.includes("welcoming") ||
      lower.includes("family friendly")
    ) {
      kidFriendly = true;
    } else if (
      lower.includes("not specifically") ||
      lower.includes("not particularly") ||
      lower.includes("adults")
    ) {
      kidFriendly = false;
    } else {
      kidFriendly = true; // Default positive if section exists with content
    }
  }

  // Collectibles
  const collectSection = sections.get("Collectibles & Action Figures") ?? "";
  let hasCollectibles: boolean | null = null;
  if (collectSection) {
    const lower = collectSection.toLowerCase();
    hasCollectibles = !lower.includes("not mentioned") && !lower.includes("no specific");
  }

  // Trading cards & manga
  const tradingSection =
    sections.get("Trading Cards, Manga, Anime & More") ?? "";
  let hasTradingCards: boolean | null = null;
  let hasManga: boolean | null = null;
  if (tradingSection) {
    const lower = tradingSection.toLowerCase();
    hasTradingCards =
      lower.includes("trading card") || lower.includes("pokemon") || lower.includes("magic");
    hasManga =
      lower.includes("manga") || lower.includes("anime");
  }

  // Pricing — one-liner
  const priceSection = sections.get("How much do things cost here?") ?? "";
  let pricingNote: string | null = null;
  if (priceSection) {
    const lower = priceSection.toLowerCase();
    if (lower.includes("affordable") || lower.includes("budget") || lower.includes("reasonable")) {
      pricingNote = "Budget-friendly pricing";
    } else if (lower.includes("competitive")) {
      pricingNote = "Competitive pricing";
    } else if (lower.includes("higher") || lower.includes("premium")) {
      pricingNote = "Premium pricing";
    } else if (lower.includes("mixed")) {
      pricingNote = "Mixed pricing reviews";
    } else {
      pricingNote = "Standard pricing";
    }
  }

  // Selection — one-liner
  const selectionSection =
    sections.get("How's the product selection here?") ?? "";
  let selectionNote: string | null = null;
  if (selectionSection) {
    const lower = selectionSection.toLowerCase();
    if (lower.includes("impressive") || lower.includes("extensive") || lower.includes("huge")) {
      selectionNote = "Extensive selection";
    } else if (lower.includes("well-stocked") || lower.includes("good variety")) {
      selectionNote = "Well-stocked";
    } else if (lower.includes("curated") || lower.includes("niche")) {
      selectionNote = "Curated selection";
    } else if (lower.includes("limited") || lower.includes("small")) {
      selectionNote = "Limited selection";
    } else {
      selectionNote = "Good selection";
    }
  }

  return {
    summary,
    kidFriendly,
    hasCollectibles,
    hasTradingCards,
    hasManga,
    pricingNote,
    selectionNote,
  };
}

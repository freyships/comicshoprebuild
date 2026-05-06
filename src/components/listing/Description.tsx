export function Description({ text }: { text: string | null }) {
  if (!text) return null;

  // Split on common section headers that were previously <h4> tags
  const sections = text.split(/\n\n+/);

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3">About This Store</h2>
      <div className="prose max-w-none text-foreground">
        {sections.map((section, i) => {
          const trimmed = section.trim();
          if (!trimmed) return null;

          // Check if it looks like a heading (short line, often a question or title)
          const isHeading =
            trimmed.length < 80 &&
            !trimmed.includes(".") &&
            (trimmed.endsWith("?") ||
              trimmed === "Comic Book Store Details" ||
              trimmed.startsWith("How") ||
              trimmed.startsWith("What") ||
              trimmed.startsWith("Is ") ||
              trimmed.startsWith("Collectibles") ||
              trimmed.startsWith("Trading Cards"));

          if (isHeading) {
            return (
              <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
                {trimmed}
              </h3>
            );
          }

          return (
            <p key={i} className="mb-3 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    </section>
  );
}

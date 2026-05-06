import type { BusinessHoursEntry } from "@/lib/types";

export function BusinessHours({ hours }: { hours: BusinessHoursEntry[] | null }) {
  if (!hours || hours.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Hours of Operation</h2>
      <table className="w-full text-sm">
        <tbody>
          {hours.map((entry) => (
            <tr key={entry.day} className="border-b border-border">
              <td className="py-2 pr-4 font-medium">{entry.day}</td>
              <td className="py-2 text-muted">
                {entry.open} – {entry.close}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

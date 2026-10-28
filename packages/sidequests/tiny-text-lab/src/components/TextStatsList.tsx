import type { TextStats } from "../lib/stats";
import { formatReadingTime } from "../lib/stats";

const numberFormat = new Intl.NumberFormat("en");

export function TextStatsList({ stats }: { stats: TextStats }) {
  const items = [
    { label: "Words", value: numberFormat.format(stats.words) },
    { label: "Characters", value: numberFormat.format(stats.characters) },
    { label: "Without spaces", value: numberFormat.format(stats.charactersWithoutSpaces) },
    { label: "Lines", value: numberFormat.format(stats.lines) },
    { label: "Paragraphs", value: numberFormat.format(stats.paragraphs) },
    { label: "Reading time", value: formatReadingTime(stats.readingMinutes) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-3 py-2">
          <dt className="text-meta text-text-muted">{item.label}</dt>
          <dd className="font-display text-lg font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

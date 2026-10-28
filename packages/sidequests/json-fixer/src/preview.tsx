/**
 * Card illustration. Decorative: the card's title and description carry the
 * meaning. Uses semantic token classes so it works in both themes.
 */
export function JsonFixerPreview() {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" className="h-full w-full">
      <rect x="24" y="24" width="272" height="132" rx="14" className="fill-surface-muted" />
      <text x="44" y="112" className="fill-accent font-display" fontSize="72" fontWeight="600">
        {"{"}
      </text>
      <text x="246" y="112" className="fill-accent font-display" fontSize="72" fontWeight="600">
        {"}"}
      </text>
      <rect x="92" y="58" width="96" height="10" rx="5" className="fill-text-muted" />
      <rect x="112" y="80" width="112" height="10" rx="5" className="fill-green" />
      <rect x="112" y="102" width="84" height="10" rx="5" className="fill-green" />
      <rect x="92" y="124" width="64" height="10" rx="5" className="fill-text-muted" />
    </svg>
  );
}

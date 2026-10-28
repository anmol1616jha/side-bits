/**
 * Card illustration. Decorative: the card's title and description carry the
 * meaning. Uses semantic token classes so it works in both themes.
 */
export function TinyTextLabPreview() {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" className="h-full w-full">
      <text x="36" y="124" className="fill-text font-display" fontSize="88" fontWeight="600">
        Aa
      </text>
      <rect x="172" y="56" width="112" height="10" rx="5" className="fill-accent" />
      <rect x="172" y="80" width="88" height="10" rx="5" className="fill-text-muted" />
      <rect x="172" y="104" width="104" height="10" rx="5" className="fill-text-muted" />
      <rect x="172" y="128" width="64" height="10" rx="5" className="fill-text-muted" />
    </svg>
  );
}

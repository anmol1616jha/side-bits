/**
 * Card illustration. Decorative: the card's title and description carry the
 * meaning. Uses semantic token classes so it works in both themes.
 */
export function RandomTopicGeneratorPreview() {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" className="h-full w-full">
      <circle cx="100" cy="90" r="52" fill="none" strokeWidth="12" className="stroke-border" />
      <circle
        cx="100"
        cy="90"
        r="52"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="327"
        strokeDashoffset="90"
        transform="rotate(-90 100 90)"
        className="stroke-accent"
      />
      <rect x="96" y="58" width="8" height="36" rx="4" className="fill-text" />
      <rect x="182" y="46" width="112" height="70" rx="14" className="fill-surface" />
      <path d="M204 114 L198 134 L222 114 Z" className="fill-surface" />
      <rect x="198" y="66" width="80" height="9" rx="4.5" className="fill-green" />
      <rect x="198" y="86" width="56" height="9" rx="4.5" className="fill-text-muted" />
    </svg>
  );
}

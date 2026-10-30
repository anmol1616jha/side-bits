/**
 * Card illustration. Decorative: the card's title and description carry the
 * meaning. Uses semantic token classes so it works in both themes.
 */
export function WordGeneratorPreview() {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" className="h-full w-full">
      <rect x="44" y="30" width="150" height="34" rx="6" className="fill-surface" />
      <rect x="44" y="30" width="6" height="34" rx="3" className="fill-green" />
      <rect x="62" y="42" width="78" height="10" rx="5" className="fill-text" />
      <rect x="64" y="76" width="150" height="34" rx="6" className="fill-surface" />
      <rect x="64" y="76" width="6" height="34" rx="3" className="fill-accent" />
      <rect x="82" y="88" width="98" height="10" rx="5" className="fill-text" />
      <rect x="84" y="122" width="150" height="34" rx="6" className="fill-surface" />
      <rect x="84" y="122" width="6" height="34" rx="3" className="fill-warning" />
      <rect x="102" y="134" width="62" height="10" rx="5" className="fill-text-muted" />
      <path
        d="M262 52 L268 70 L286 76 L268 82 L262 100 L256 82 L238 76 L256 70 Z"
        className="fill-accent"
      />
      <path
        d="M236 118 L239 127 L248 130 L239 133 L236 142 L233 133 L224 130 L233 127 Z"
        className="fill-green"
      />
    </svg>
  );
}

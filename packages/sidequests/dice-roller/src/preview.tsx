/**
 * Card illustration. Decorative: the card's title and description carry the
 * meaning. Uses semantic token classes so it works in both themes.
 */
export function DiceRollerPreview() {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" className="h-full w-full">
      <ellipse cx="118" cy="146" rx="46" ry="7" className="fill-border" />
      <ellipse cx="212" cy="140" rx="40" ry="6" className="fill-border" />
      <g transform="rotate(-12 118 92)">
        <rect
          x="76"
          y="50"
          width="84"
          height="84"
          rx="14"
          strokeWidth="3"
          className="fill-surface stroke-accent"
        />
        <circle cx="96" cy="70" r="7" className="fill-text" />
        <circle cx="140" cy="70" r="7" className="fill-text" />
        <circle cx="118" cy="92" r="7" className="fill-text" />
        <circle cx="96" cy="114" r="7" className="fill-text" />
        <circle cx="140" cy="114" r="7" className="fill-text" />
      </g>
      <g transform="rotate(14 212 96)">
        <rect
          x="178"
          y="62"
          width="68"
          height="68"
          rx="12"
          strokeWidth="3"
          className="fill-surface stroke-border"
        />
        <circle cx="196" cy="80" r="6" className="fill-accent" />
        <circle cx="212" cy="96" r="6" className="fill-accent" />
        <circle cx="228" cy="112" r="6" className="fill-accent" />
      </g>
      <path
        d="M58 40 l6 -10 M48 52 l-10 -4 M262 44 l8 -8 M272 58 l10 -2"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-text-muted"
      />
    </svg>
  );
}

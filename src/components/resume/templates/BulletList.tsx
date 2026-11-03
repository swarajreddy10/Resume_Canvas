import type { CSSProperties } from 'react';

/** How one template draws its bullet points. */
export interface BulletLook {
  symbol: string;
  marker: CSSProperties;
  item: CSSProperties;
}

const LIST: CSSProperties = { margin: 0, padding: 0, listStyle: 'none' };

/** An experience entry's bullet points, drawn with the template's own symbol and type. */
export default function BulletList({
  bullets,
  look,
}: Readonly<{ bullets: string[] | undefined; look: BulletLook }>) {
  if (!bullets || bullets.length === 0) return null;
  // One style object per list, shared by its items.
  const item: CSSProperties = { display: 'flex', ...look.item };
  const marker: CSSProperties = { flexShrink: 0, ...look.marker };
  return (
    <ul style={LIST}>
      {bullets.map((bullet, i) => (
        <li key={i} style={item}>
          <span style={marker}>{look.symbol}</span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

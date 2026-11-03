/** How one template draws its bullet points; every template sets all of it. */
export interface BulletLook {
  marker: string;
  markerColor: string;
  markerWeight: number;
  /** Lowers the marker to the first line of text; omitted where the font needs none. */
  markerOffset?: string;
  gap: string;
  fontSize: string;
  lineHeight: string;
  spacing: string;
}

/** An experience entry's bullet points, drawn with the template's own marker and type. */
export default function BulletList({
  bullets,
  look,
}: {
  bullets: string[] | undefined;
  look: BulletLook;
}) {
  if (!bullets || bullets.length === 0) return null;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {bullets.map((bullet, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: look.gap,
            fontSize: look.fontSize,
            color: '#374151',
            lineHeight: look.lineHeight,
            marginBottom: look.spacing,
          }}
        >
          <span
            style={{
              color: look.markerColor,
              fontWeight: look.markerWeight,
              flexShrink: 0,
              marginTop: look.markerOffset,
            }}
          >
            {look.marker}
          </span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

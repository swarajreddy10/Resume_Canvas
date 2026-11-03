import type { CSSProperties, ReactNode } from 'react';

/** How one template draws an entry's opening row; `row` adjusts alignment and spacing. */
export interface DatedRowLook {
  row?: CSSProperties;
  title: CSSProperties;
  dates: CSSProperties;
}

/** A heading on the left and the entry's date range on the right, as a résumé entry opens. */
export default function DatedRow({
  children,
  entry,
  look,
}: Readonly<{
  children: ReactNode;
  entry: { startDate: string; endDate: string };
  look: DatedRowLook;
}>) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        ...look.row,
      }}
    >
      <span style={look.title}>{children}</span>
      <span style={look.dates}>
        {entry.startDate} – {entry.endDate}
      </span>
    </div>
  );
}

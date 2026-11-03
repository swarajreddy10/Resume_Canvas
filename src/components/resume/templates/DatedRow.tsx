import type { CSSProperties, ReactNode } from 'react';

/** A heading on the left and its date range on the right, as a résumé entry opens. */
export default function DatedRow({
  children,
  startDate,
  endDate,
  titleStyle,
  dateStyle,
  align = 'baseline',
  marginBottom,
}: {
  children: ReactNode;
  startDate: string;
  endDate: string;
  titleStyle: CSSProperties;
  dateStyle: CSSProperties;
  align?: 'baseline' | 'flex-start';
  marginBottom?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: align,
        marginBottom,
      }}
    >
      <span style={titleStyle}>{children}</span>
      <span style={dateStyle}>
        {startDate} – {endDate}
      </span>
    </div>
  );
}

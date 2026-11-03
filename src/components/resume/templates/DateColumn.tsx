import type { ReactNode } from 'react';

/** The right-aligned date column beside an entry in the two-column layouts. */
export default function DateColumn({
  width,
  color,
  lineHeight,
  children,
}: Readonly<{
  width: string;
  color: string;
  lineHeight?: number;
  children: ReactNode;
}>) {
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        textAlign: 'right',
        fontSize: '10px',
        color,
        paddingTop: '2px',
        fontStyle: 'italic',
        lineHeight,
      }}
    >
      {children}
    </div>
  );
}

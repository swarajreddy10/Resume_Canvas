import type { CSSProperties, ReactNode } from 'react';

/**
 * A résumé section of repeated entries (experience, education, projects): nothing when
 * the list is empty, otherwise the template's heading and one spaced block per entry.
 * Entries are stateless and positional, so the index is their key
 * (https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key).
 */
export default function EntrySection<T>({
  items,
  heading,
  marginBottom,
  itemGap,
  itemStyle,
  children,
}: Readonly<{
  items: T[] | undefined;
  heading: ReactNode;
  marginBottom: string;
  itemGap: string;
  itemStyle?: CSSProperties;
  children: (item: T) => ReactNode;
}>) {
  if (!items || items.length === 0) return null;
  // Every entry but the last is followed by the gap; two style objects serve them all.
  const spaced: CSSProperties = { ...itemStyle, marginBottom: itemGap };
  const last: CSSProperties = { ...itemStyle, marginBottom: 0 };
  return (
    <div style={{ marginBottom }}>
      {heading}
      {items.map((item, i) => (
        <div key={i} style={i < items.length - 1 ? spaced : last}>
          {children(item)}
        </div>
      ))}
    </div>
  );
}

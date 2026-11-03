import type { CSSProperties, ReactNode } from 'react';

/** A résumé section holding one paragraph, such as the summary; nothing when it is empty. */
export default function TextSection({
  text,
  heading,
  marginBottom,
  textStyle,
}: Readonly<{
  text: string | undefined;
  heading: ReactNode;
  marginBottom: string;
  textStyle: CSSProperties;
}>) {
  if (!text) return null;
  return (
    <div style={{ marginBottom }}>
      {heading}
      <p style={textStyle}>{text}</p>
    </div>
  );
}

import type { ReactNode } from 'react';
import type { Experience } from '@/types/resume.unified';
import DatedRow, { type DatedRowLook } from './DatedRow';
import EntrySection from './EntrySection';
import ExperienceDetails, {
  type ExperienceDetailsLook,
} from './ExperienceDetails';

/** How a single-column template draws its experience entries. */
export type ExperienceLook = DatedRowLook & ExperienceDetailsLook;

/**
 * The experience section of a single-column layout: each entry opens with the position
 * and its dates on one row, then the company, description and bullet points.
 */
export default function ExperienceSection({
  items,
  heading,
  marginBottom,
  itemGap,
  look,
}: Readonly<{
  items: Experience[] | undefined;
  heading: ReactNode;
  marginBottom: string;
  itemGap: string;
  look: ExperienceLook;
}>) {
  return (
    <EntrySection
      items={items}
      heading={heading}
      marginBottom={marginBottom}
      itemGap={itemGap}
    >
      {(exp) => (
        <>
          <DatedRow entry={exp} look={look}>
            {exp.position}
          </DatedRow>
          <ExperienceDetails entry={exp} look={look} />
        </>
      )}
    </EntrySection>
  );
}

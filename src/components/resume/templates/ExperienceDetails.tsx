import type { CSSProperties } from 'react';
import type { Experience } from '@/types/resume.unified';
import BulletList, { type BulletLook } from './BulletList';

/** How one template draws the body of an experience entry. */
export interface ExperienceDetailsLook {
  company: CSSProperties;
  /** Placed between the company and its location, e.g. ", " or " | ". */
  locationSeparator: string;
  description: CSSProperties;
  bullets: BulletLook;
}

/** Company and location, the optional description, then the bullet points. */
export default function ExperienceDetails({
  entry,
  look,
}: Readonly<{ entry: Experience; look: ExperienceDetailsLook }>) {
  return (
    <>
      <div style={look.company}>
        {entry.company}
        {entry.location ? `${look.locationSeparator}${entry.location}` : ''}
      </div>
      {entry.description && <p style={look.description}>{entry.description}</p>}
      <BulletList bullets={entry.bullets} look={look.bullets} />
    </>
  );
}

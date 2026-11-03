import { ResumeData } from '@/types/resume.unified';
import DatedRow, { type DatedRowLook } from './DatedRow';
import EntrySection from './EntrySection';
import ExperienceSection, { type ExperienceLook } from './ExperienceSection';
import TextSection from './TextSection';

interface CorporateTemplateProps {
  data: ResumeData;
  isMobile?: boolean;
}

const INDIGO = '#4f46e5';

const HEADING: DatedRowLook = {
  title: {
    fontSize: '13px',
    fontWeight: 800,
    color: '#0f172a',
    fontFamily: "'Georgia', serif",
  },
  dates: {
    fontSize: '10.5px',
    color: '#64748b',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    marginLeft: '10px',
  },
};

const EXPERIENCE: ExperienceLook = {
  ...HEADING,
  row: { marginBottom: '1px' },
  company: {
    fontSize: '11.5px',
    fontWeight: 700,
    color: INDIGO,
    marginBottom: '6px',
  },
  locationSeparator: ' | ',
  description: {
    fontSize: '11px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0 0 5px',
    fontStyle: 'italic',
  },
  bullets: {
    symbol: '◆',
    marker: { fontWeight: 900, color: INDIGO },
    item: {
      gap: '8px',
      fontSize: '11.5px',
      color: '#374151',
      lineHeight: '1.6',
      marginBottom: '3px',
    },
  },
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div
        style={{
          fontSize: '10.5px',
          fontWeight: 900,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: '#0f172a',
          paddingBottom: '5px',
          borderBottom: '2px solid #0f172a',
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default function CorporateTemplate({ data }: CorporateTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        background: '#fff',
        padding: '52px 56px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '12px',
        color: '#1a1a1a',
        lineHeight: 1.5,
        boxSizing: 'border-box' as const,
      }}
    >
      {/* ── Centered Header ───────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 6px',
            lineHeight: 1.1,
            fontFamily: "'Georgia', serif",
          }}
        >
          {personalInfo?.name || 'YOUR NAME'}
        </h1>

        {personalInfo?.position && (
          <div
            style={{
              fontSize: '14px',
              color: INDIGO,
              fontWeight: 600,
              marginBottom: '8px',
              fontFamily: "'Georgia', serif",
            }}
          >
            {personalInfo.position}
          </div>
        )}

        {/* Contact row with · separators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            fontSize: '10.5px',
            color: '#475569',
            marginBottom: '4px',
            gap: '0',
          }}
        >
          {[personalInfo?.email, personalInfo?.phone, personalInfo?.address]
            .filter(Boolean)
            .map((v, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ margin: '0 6px', color: '#94a3b8' }}>·</span>
                )}
                <span>{v}</span>
              </span>
            ))}
        </div>

        {personalInfo?.linkedin && (
          <div
            style={{ fontSize: '10.5px', color: INDIGO, marginBottom: '6px' }}
          >
            {personalInfo.linkedin}
          </div>
        )}

        {/* Double rule */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ borderTop: '3px solid #0f172a' }} />
          <div style={{ height: '4px' }} />
          <div style={{ borderTop: '1px solid #0f172a' }} />
        </div>
      </div>

      {/* ── Professional Summary ───────────────────── */}
      <TextSection
        text={personalInfo?.summary}
        heading={<SectionHeader title="Professional Summary" />}
        marginBottom="22px"
        textStyle={{
          fontSize: '11.5px',
          color: '#374151',
          lineHeight: '1.7',
          margin: 0,
        }}
      />

      {/* ── Core Competencies ─────────────────────── */}
      {skills && skills.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <SectionHeader title="Core Competencies" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '5px 16px',
            }}
          >
            {skills.map((skill, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#1e293b',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    background: INDIGO,
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Professional Experience ────────────────── */}
      <ExperienceSection
        items={experience}
        heading={<SectionHeader title="Professional Experience" />}
        marginBottom="22px"
        itemGap="18px"
        look={EXPERIENCE}
      />

      {/* ── Education ─────────────────────────────── */}
      <EntrySection
        items={education}
        heading={<SectionHeader title="Education" />}
        marginBottom="22px"
        itemGap="12px"
      >
        {(edu) => (
          <>
            <DatedRow entry={edu} look={HEADING}>
              {edu.degree}, {edu.field}
            </DatedRow>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: INDIGO,
              }}
            >
              {edu.school}
              {edu.location ? ` | ${edu.location}` : ''}
            </div>
            {edu.gpa && (
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                GPA: {edu.gpa}/4.0
              </div>
            )}
          </>
        )}
      </EntrySection>

      {/* ── Certifications ────────────────────────── */}
      {certifications && certifications.length > 0 && (
        <div>
          <SectionHeader title="Certifications & Professional Development" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 24px',
            }}
          >
            {certifications.map((cert, i) => (
              <div key={i}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  {cert.name}
                </span>
                <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                  {' '}
                  | {cert.issuer} ({cert.date})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

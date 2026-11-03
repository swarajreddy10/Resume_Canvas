import { ResumeData } from '@/types/resume.unified';
import ExperienceSection, { type ExperienceLook } from './ExperienceSection';
import TextSection from './TextSection';

interface ExecutiveTemplateProps {
  data: ResumeData;
  isMobile?: boolean;
}

const SIDEBAR_BG = '#1b4332';
const GREEN = '#4ade80';
const GREEN_MID = '#2d6a4f';
const GREEN_LIGHT = '#86efac';
const GREEN_PALE = '#d1fae5';
const GREEN_TEXT = '#ecfdf5';

const SKILL_BAR_WIDTHS = [92, 85, 88, 78, 90, 82, 75, 88, 80, 70];

const EXPERIENCE: ExperienceLook = {
  title: {
    fontSize: '13.5px',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1.2,
  },
  dates: {
    fontSize: '10.5px',
    color: '#64748b',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    marginLeft: '10px',
    marginTop: '2px',
  },
  row: { alignItems: 'flex-start', marginBottom: '2px' },
  company: {
    fontSize: '12px',
    fontWeight: 700,
    color: SIDEBAR_BG,
    marginBottom: '6px',
  },
  locationSeparator: ' · ',
  description: {
    fontSize: '11px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0 0 6px',
    fontStyle: 'italic',
  },
  bullets: {
    symbol: '•',
    marker: { color: SIDEBAR_BG, fontWeight: 700, marginTop: '1px' },
    item: {
      gap: '8px',
      fontSize: '11.5px',
      color: '#374151',
      lineHeight: '1.6',
      marginBottom: '4px',
    },
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: '9px',
        fontWeight: 800,
        letterSpacing: '0.2em',
        textTransform: 'uppercase' as const,
        color: GREEN,
        marginBottom: '10px',
      }}
    >
      {title}
    </div>
  );
}

function MainSectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          color: '#1b4332',
        }}
      >
        {title}
      </span>
      <div
        style={{ height: '1.5px', background: '#1b4332', marginTop: '4px' }}
      />
    </div>
  );
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        background: '#fff',
        fontSize: '12px',
      }}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────── */}
      <div
        style={{
          width: '240px',
          minHeight: '1123px',
          background: SIDEBAR_BG,
          color: '#fff',
          padding: '40px 24px',
          flexShrink: 0,
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.15)',
            border: `2px solid ${GREEN}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: GREEN,
            marginBottom: '14px',
          }}
        >
          {getInitials(personalInfo?.name || 'YN')}
        </div>

        {/* Name + Title */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '6px',
          }}
        >
          {personalInfo?.name || 'YOUR NAME'}
        </div>
        {personalInfo?.position && (
          <div
            style={{
              fontSize: '10px',
              color: GREEN_LIGHT,
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            {personalInfo.position}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: GREEN_MID,
            marginBottom: '20px',
          }}
        />

        {/* DETAILS section */}
        <div style={{ marginBottom: '24px' }}>
          <SidebarSectionTitle title="Details" />
          {[
            personalInfo?.address,
            personalInfo?.email,
            personalInfo?.phone,
            personalInfo?.linkedin,
          ]
            .filter(Boolean)
            .map((v, i) => (
              <div
                key={i}
                style={{
                  fontSize: '10px',
                  color: GREEN_PALE,
                  marginBottom: '5px',
                  lineHeight: 1.45,
                  wordBreak: 'break-all' as const,
                }}
              >
                {v}
              </div>
            ))}
        </div>

        {/* EXPERTISE with skill bars */}
        {skills && skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SidebarSectionTitle title="Expertise" />
            {skills.slice(0, 6).map((s, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: GREEN_TEXT,
                    marginBottom: '3px',
                  }}
                >
                  {s}
                </div>
                <div
                  style={{
                    height: '3px',
                    background: GREEN_MID,
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${SKILL_BAR_WIDTHS[i % SKILL_BAR_WIDTHS.length]}%`,
                      background: GREEN,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION in sidebar */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SidebarSectionTitle title="Education" />
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: GREEN_TEXT,
                    lineHeight: 1.35,
                  }}
                >
                  {edu.degree}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: GREEN_LIGHT,
                    lineHeight: 1.35,
                  }}
                >
                  {edu.field}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: GREEN_PALE,
                    lineHeight: 1.35,
                  }}
                >
                  {edu.school}
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    color: '#6ee7b7',
                    lineHeight: 1.35,
                    marginTop: '1px',
                  }}
                >
                  {edu.startDate} – {edu.endDate}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS in sidebar */}
        {certifications && certifications.length > 0 && (
          <div>
            <SidebarSectionTitle title="Certifications" />
            {certifications.map((cert, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: GREEN_TEXT,
                    lineHeight: 1.4,
                  }}
                >
                  {cert.name}
                </div>
                <div style={{ fontSize: '9.5px', color: '#6ee7b7' }}>
                  {cert.issuer} · {cert.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN ───────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: '40px 36px',
          background: '#fff',
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Profile / Summary */}
        <TextSection
          text={personalInfo?.summary}
          heading={<MainSectionHeader title="Profile" />}
          marginBottom="24px"
          textStyle={{
            fontSize: '11.5px',
            color: '#374151',
            lineHeight: '1.7',
            margin: 0,
          }}
        />

        {/* Employment History */}
        <ExperienceSection
          items={experience}
          heading={<MainSectionHeader title="Employment History" />}
          marginBottom="24px"
          itemGap="20px"
          look={EXPERIENCE}
        />

        {/* References */}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <p
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            References available upon request.
          </p>
        </div>
      </div>
    </div>
  );
}

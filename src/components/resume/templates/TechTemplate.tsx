import { ResumeData } from '@/types/resume.unified';

interface TechTemplateProps {
  data: ResumeData;
  isMobile?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 900,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: '#2563eb',
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{ height: '1.5px', background: '#2563eb', marginTop: '4px' }}
      />
    </div>
  );
}

export default function TechTemplate({ data }: TechTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  const contactParts: string[] = [];
  if (personalInfo?.email) contactParts.push(personalInfo.email);
  if (personalInfo?.phone) contactParts.push(personalInfo.phone);
  if (personalInfo?.address) contactParts.push(personalInfo.address);
  if (personalInfo?.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo?.github) contactParts.push(personalInfo.github);

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        background: '#fff',
        padding: '48px 52px',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '12px',
        color: '#374151',
        lineHeight: 1.5,
        boxSizing: 'border-box' as const,
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '10px',
        }}
      >
        {/* Main header text */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#1d4ed8',
              letterSpacing: '-0.02em',
              margin: '0 0 4px',
              lineHeight: 1.05,
            }}
          >
            {personalInfo?.name || 'YOUR NAME'}
          </h1>
          {personalInfo?.position && (
            <div
              style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: 500,
                marginBottom: '8px',
              }}
            >
              {personalInfo.position}
            </div>
          )}
          {/* Contact row with bullet separators */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              alignItems: 'center',
              fontSize: '11px',
              color: '#64748b',
              gap: '0',
            }}
          >
            {contactParts.map((part, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ margin: '0 6px', color: '#94a3b8' }}>•</span>
                )}
                <span>{part}</span>
              </span>
            ))}
          </div>
        </div>
        {/* Initials avatar circle */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: '#2563eb',
            flexShrink: 0,
          }}
        >
          {getInitials(personalInfo?.name || 'YN')}
        </div>
      </div>

      {/* Full-width blue rule */}
      <div
        style={{ height: '2px', background: '#2563eb', marginBottom: '20px' }}
      />

      {/* ── Summary ───────────────────────────────── */}
      {personalInfo?.summary && (
        <div style={{ marginBottom: '20px' }}>
          <SectionHeader title="Summary" />
          <p
            style={{
              fontSize: '12px',
              color: '#374151',
              lineHeight: '1.65',
              margin: 0,
            }}
          >
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* ── Professional Experience ────────────────── */}
      {experience && experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionHeader title="Professional Experience" />
          {experience.map((exp, i) => (
            <div
              key={i}
              style={{ marginBottom: i < experience.length - 1 ? '16px' : 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '1px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  {exp.position}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2563eb',
                  marginBottom: '5px',
                }}
              >
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.description && (
                <p
                  style={{
                    fontSize: '11px',
                    color: '#374151',
                    lineHeight: '1.55',
                    margin: '0 0 4px',
                    fontStyle: 'italic',
                  }}
                >
                  {exp.description}
                </p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        gap: '7px',
                        fontSize: '11.5px',
                        color: '#374151',
                        lineHeight: '1.55',
                        marginBottom: '3px',
                      }}
                    >
                      <span
                        style={{
                          color: '#2563eb',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        ›
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Education ─────────────────────────────── */}
      {education && education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionHeader title="Education" />
          {education.map((edu, i) => (
            <div
              key={i}
              style={{ marginBottom: i < education.length - 1 ? '12px' : 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  {edu.degree} in {edu.field}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2563eb',
                }}
              >
                {edu.school}
                {edu.location ? `, ${edu.location}` : ''}
                {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Technical Skills ──────────────────────── */}
      {skills && skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionHeader title="Technical Skills" />
          <div
            style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}
          >
            {skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Projects ──────────────────────────────── */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionHeader title="Projects" />
          {projects.map((p, i) => (
            <div
              key={i}
              style={{ marginBottom: i < projects.length - 1 ? '12px' : 0 }}
            >
              <span
                style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}
              >
                {p.name}
              </span>
              <p
                style={{
                  fontSize: '11.5px',
                  color: '#374151',
                  lineHeight: '1.55',
                  margin: '3px 0',
                }}
              >
                {p.description}
              </p>
              {p.technologies && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap' as const,
                    gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  {(Array.isArray(p.technologies)
                    ? p.technologies
                    : [p.technologies]
                  ).map((t, k) => (
                    <span
                      key={k}
                      style={{
                        fontSize: '10px',
                        color: '#1d4ed8',
                        background: '#eff6ff',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        fontWeight: 600,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Certifications ────────────────────────── */}
      {certifications && certifications.length > 0 && (
        <div>
          <SectionHeader title="Certifications" />
          {certifications.map((cert, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '5px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  {cert.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginLeft: '6px',
                  }}
                >
                  — {cert.issuer}
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px',
                }}
              >
                {cert.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

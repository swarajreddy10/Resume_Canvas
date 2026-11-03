import { ResumeData } from '@/types/resume.unified';
import BulletList from './BulletList';

interface CreativeTemplateProps {
  data: ResumeData;
  isMobile?: boolean;
}

const PINK = '#ec4899';
const PURPLE = '#9333ea';
const SIDEBAR_BG = '#fdf2f8';

const STAR_RATINGS = [5, 5, 4, 5, 4, 3, 5, 4];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: '11px', letterSpacing: '1px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? PINK : '#d1d5db' }}>
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

function SidebarHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: PINK,
        }}
      >
        {title}
      </span>
      <div
        style={{
          height: '1.5px',
          background: PINK,
          marginTop: '4px',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function MainSectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: PINK,
        }}
      >
        {title}
      </span>
      <div
        style={{
          height: '1.5px',
          background: PINK,
          marginTop: '4px',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        background: '#fff',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* ── HEADER (full width) ───────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '32px 40px 28px',
          background: '#fff',
          borderBottom: '2px solid #fce7f3',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#ec4899,#9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {getInitials(personalInfo?.name || 'YN')}
        </div>

        {/* Name + position + contact */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 3px',
              lineHeight: 1.1,
            }}
          >
            {personalInfo?.name || 'YOUR NAME'}
          </h1>
          {personalInfo?.position && (
            <div
              style={{
                fontSize: '13px',
                color: PINK,
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              {personalInfo.position}
            </div>
          )}
          {/* Contact row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: '0 16px',
              fontSize: '11px',
              color: '#6b7280',
            }}
          >
            {personalInfo?.email && (
              <span>
                <span style={{ color: PINK, marginRight: '3px' }}>✉</span>
                {personalInfo.email}
              </span>
            )}
            {personalInfo?.phone && (
              <span>
                <span style={{ color: PINK, marginRight: '3px' }}>✆</span>
                {personalInfo.phone}
              </span>
            )}
            {personalInfo?.address && (
              <span>
                <span style={{ color: PINK, marginRight: '3px' }}>⌖</span>
                {personalInfo.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY: two columns ────────────────────── */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* LEFT MAIN */}
        <div
          style={{
            flex: 1,
            padding: '32px 36px 32px 40px',
            boxSizing: 'border-box' as const,
          }}
        >
          {/* Profile */}
          {personalInfo?.summary && (
            <div style={{ marginBottom: '24px' }}>
              <MainSectionHeader title="Profile" />
              <p
                style={{
                  fontSize: '12px',
                  color: '#374151',
                  lineHeight: '1.7',
                  margin: 0,
                }}
              >
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Employment History */}
          {experience && experience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <MainSectionHeader title="Employment History" />
              {experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: i < experience.length - 1 ? '18px' : 0,
                  }}
                >
                  {/* Date column */}
                  <div
                    style={{
                      width: '70px',
                      flexShrink: 0,
                      textAlign: 'right' as const,
                      fontSize: '10px',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                      paddingTop: '2px',
                      lineHeight: 1.45,
                    }}
                  >
                    {exp.startDate}–
                    <br />
                    {exp.endDate}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.2,
                        marginBottom: '1px',
                      }}
                    >
                      {exp.position}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: PINK,
                        marginBottom: '2px',
                      }}
                    >
                      {exp.company}
                    </div>
                    {exp.location && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#9ca3af',
                          marginBottom: '5px',
                        }}
                      >
                        {exp.location}
                      </div>
                    )}
                    <BulletList
                      bullets={exp.bullets}
                      look={{
                        marker: '→',
                        markerColor: PINK,
                        markerWeight: 700,
                        gap: '6px',
                        fontSize: '11px',
                        lineHeight: '1.6',
                        spacing: '3px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <MainSectionHeader title="Education" />
              {education.map((edu, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: i < education.length - 1 ? '14px' : 0,
                  }}
                >
                  {/* Date column */}
                  <div
                    style={{
                      width: '70px',
                      flexShrink: 0,
                      textAlign: 'right' as const,
                      fontSize: '10px',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                      paddingTop: '2px',
                      lineHeight: 1.45,
                    }}
                  >
                    {edu.startDate}–{edu.endDate}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      {edu.degree} in {edu.field}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: PINK,
                        fontWeight: 600,
                      }}
                    >
                      {edu.school}
                      {edu.location ? `, ${edu.location}` : ''}
                    </div>
                    {edu.gpa && (
                      <div style={{ fontSize: '10.5px', color: '#9ca3af' }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          style={{
            width: '220px',
            flexShrink: 0,
            padding: '32px 24px',
            background: SIDEBAR_BG,
            boxSizing: 'border-box' as const,
          }}
        >
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SidebarHeader title="Skills" />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column' as const,
                  gap: '8px',
                }}
              >
                {skills.map((s, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#374151',
                        fontWeight: 700,
                        marginBottom: '2px',
                      }}
                    >
                      {s}
                    </div>
                    <StarRating
                      rating={STAR_RATINGS[i % STAR_RATINGS.length]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SidebarHeader title="Projects" />
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '3px',
                    }}
                  >
                    {p.name}
                  </div>
                  <p
                    style={{
                      fontSize: '10.5px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      margin: '0 0 6px',
                    }}
                  >
                    {p.description}
                  </p>
                  {p.technologies && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap' as const,
                        gap: '3px',
                      }}
                    >
                      {(Array.isArray(p.technologies)
                        ? p.technologies
                        : [p.technologies]
                      ).map((t, k) => (
                        <span
                          key={k}
                          style={{
                            fontSize: '9.5px',
                            color: PURPLE,
                            background: '#fce7f3',
                            padding: '1px 6px',
                            borderRadius: '4px',
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

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <SidebarHeader title="Certifications" />
              {certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.35,
                    }}
                  >
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                    {cert.issuer} · {cert.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

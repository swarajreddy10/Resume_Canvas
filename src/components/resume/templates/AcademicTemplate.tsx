import { ResumeData } from '@/types/resume.unified';

interface AcademicTemplateProps {
  data: ResumeData;
  isMobile?: boolean;
}

const TEAL = '#0d9488';
const DOT_RATINGS = [5, 4, 5, 3, 5, 4, 3, 5];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function DotRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: '12px', letterSpacing: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? TEAL : '#d1d5db' }}>
          {i < rating ? '●' : '○'}
        </span>
      ))}
    </span>
  );
}

function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <span
        style={{
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: TEAL,
        }}
      >
        {title}
      </span>
      <div
        style={{
          height: '1.5px',
          background: TEAL,
          marginTop: '4px',
          opacity: 0.4,
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
          fontSize: '10.5px',
          fontWeight: 900,
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          color: TEAL,
        }}
      >
        {title}
      </span>
      <div style={{ height: '1.5px', background: TEAL, marginTop: '4px' }} />
    </div>
  );
}

export default function AcademicTemplate({ data }: AcademicTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  // Split skills: first 5 get dot ratings, rest get chip treatment
  const ratedSkills = skills ? skills.slice(0, 5) : [];
  const chipSkills = skills ? skills.slice(5) : [];

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: '#fff',
        fontSize: '12px',
      }}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────── */}
      <div
        style={{
          width: '220px',
          minHeight: '1123px',
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '40px 22px',
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
            background: TEAL,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '20px',
          }}
        >
          {getInitials(personalInfo?.name || 'YN')}
        </div>

        {/* DETAILS */}
        <div style={{ marginBottom: '24px' }}>
          <SidebarSectionTitle title="Details" />
          {[
            { label: 'Address', value: personalInfo?.address },
            { label: 'Email', value: personalInfo?.email },
            { label: 'Phone', value: personalInfo?.phone },
            { label: 'LinkedIn', value: personalInfo?.linkedin },
          ]
            .filter((item) => item.value)
            .map((item, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <div
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: TEAL,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    marginBottom: '1px',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: '#374151',
                    lineHeight: 1.4,
                    wordBreak: 'break-all' as const,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
        </div>

        {/* SKILLS with dot ratings */}
        {ratedSkills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SidebarSectionTitle title="Skills" />
            {ratedSkills.map((s, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
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
                <DotRating rating={DOT_RATINGS[i % DOT_RATINGS.length]} />
              </div>
            ))}
          </div>
        )}

        {/* TECHNICAL: remaining skills as chips */}
        {chipSkills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SidebarSectionTitle title="Technical" />
            <div
              style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}
            >
              {chipSkills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '9.5px',
                    color: TEAL,
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN ───────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: '40px 36px',
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Name + Position + decorative line */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#0f172a',
              fontFamily: "'Georgia', serif",
              letterSpacing: '-0.01em',
              margin: '0 0 4px',
              lineHeight: 1.1,
            }}
          >
            {personalInfo?.name || 'YOUR NAME'}
          </h1>
          {personalInfo?.position && (
            <div
              style={{
                fontSize: '13px',
                color: TEAL,
                fontWeight: 600,
                marginBottom: '12px',
              }}
            >
              {personalInfo.position}
            </div>
          )}
          {/* Thin line + diamond + line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ flex: 1, height: '1.5px', background: TEAL }} />
            <div
              style={{
                width: '7px',
                height: '7px',
                background: TEAL,
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, height: '1.5px', background: TEAL }} />
          </div>
        </div>

        {/* Research Interests / Profile */}
        {personalInfo?.summary && (
          <div style={{ marginBottom: '22px' }}>
            <MainSectionHeader title="Research Interests" />
            <p
              style={{
                fontSize: '11.5px',
                color: '#374151',
                lineHeight: '1.75',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Employment History */}
        {experience && experience.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <MainSectionHeader title="Employment History" />
            {experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  marginBottom: i < experience.length - 1 ? '18px' : 0,
                }}
              >
                {/* Date column */}
                <div
                  style={{
                    width: '90px',
                    flexShrink: 0,
                    textAlign: 'right' as const,
                    fontSize: '10px',
                    color: '#64748b',
                    paddingTop: '2px',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                  }}
                >
                  {exp.startDate}–
                  <br />
                  {exp.endDate}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '1px',
                    }}
                  >
                    {exp.position}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: TEAL,
                      marginBottom: '5px',
                    }}
                  >
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: '11.5px',
                        color: '#4b5563',
                        lineHeight: '1.65',
                        margin: '0 0 5px',
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
                            lineHeight: '1.65',
                            marginBottom: '3px',
                          }}
                        >
                          <span
                            style={{
                              color: TEAL,
                              fontWeight: 900,
                              flexShrink: 0,
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
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <MainSectionHeader title="Education" />
            {education.map((edu, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  marginBottom: i < education.length - 1 ? '12px' : 0,
                }}
              >
                <div
                  style={{
                    width: '90px',
                    flexShrink: 0,
                    textAlign: 'right' as const,
                    fontSize: '10px',
                    color: '#64748b',
                    paddingTop: '2px',
                    fontStyle: 'italic',
                  }}
                >
                  {edu.startDate}–{edu.endDate}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0f172a',
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: TEAL,
                    }}
                  >
                    {edu.school}
                    {edu.location ? `, ${edu.location}` : ''}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      GPA: {edu.gpa}/4.0
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Research Projects */}
        {projects && projects.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <MainSectionHeader title="Research Projects" />
            {projects.map((p, i) => (
              <div
                key={i}
                style={{
                  borderLeft: `3px solid ${TEAL}`,
                  paddingLeft: '14px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '3px',
                  }}
                >
                  {p.name}
                </div>
                <p
                  style={{
                    fontSize: '11.5px',
                    color: '#4b5563',
                    lineHeight: '1.65',
                    margin: '0 0 4px',
                  }}
                >
                  {p.description}
                </p>
                {p.technologies && (
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: TEAL,
                      fontStyle: 'italic',
                    }}
                  >
                    Methods:{' '}
                    {Array.isArray(p.technologies)
                      ? p.technologies.join(', ')
                      : p.technologies}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills inline */}
        {skills && skills.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <MainSectionHeader title="Technical Skills" />
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap' as const,
                gap: '4px 0',
              }}
            >
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '11.5px', color: '#374151' }}>
                  {s}
                  {i < skills.length - 1 ? (
                    <span style={{ color: TEAL, margin: '0 7px' }}>·</span>
                  ) : (
                    ''
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <MainSectionHeader title="Certifications & Awards" />
            {certifications.map((cert, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    width: '90px',
                    flexShrink: 0,
                    textAlign: 'right' as const,
                    fontSize: '10.5px',
                    color: '#64748b',
                    fontStyle: 'italic',
                  }}
                >
                  {cert.date}
                </div>
                <div style={{ flex: 1, fontSize: '11.5px', color: '#0f172a' }}>
                  <span style={{ fontWeight: 700 }}>{cert.name}</span>
                  <span style={{ color: '#64748b' }}> — {cert.issuer}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

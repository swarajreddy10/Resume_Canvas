import { ResumeData } from '@/types/resume.unified';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="mx-auto w-full max-w-[900px] bg-white font-serif text-slate-900 shadow-sm">
      <div className="grid grid-cols-[1fr_2fr] gap-0">
        <aside className="min-h-full rounded-l-3xl bg-slate-900 px-6 py-7 text-white">
          <div className="text-xl font-black uppercase tracking-wide">
            {personalInfo?.name || 'YOUR NAME'}
          </div>
          <div className="mt-2 space-y-1 text-sm text-slate-200">
            {personalInfo?.email && <div>{personalInfo.email}</div>}
            {personalInfo?.phone && <div>{personalInfo.phone}</div>}
            {personalInfo?.address && <div>{personalInfo.address}</div>}
            {personalInfo?.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
          {skills && skills.length > 0 && (
            <SidebarBlock title="Key Competencies">
              <ul className="space-y-1 text-sm text-slate-100">
                {skills.slice(0, 8).map((skill, idx) => (
                  <li key={idx}>• {skill}</li>
                ))}
              </ul>
            </SidebarBlock>
          )}
          {certifications && certifications.length > 0 && (
            <SidebarBlock title="Certifications">
              <ul className="space-y-1 text-sm text-slate-100">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.name}
                    {cert.issuer ? ` — ${cert.issuer}` : ''}
                  </li>
                ))}
              </ul>
            </SidebarBlock>
          )}
        </aside>

        <main className="rounded-r-3xl bg-white px-8 py-8">
          {personalInfo?.summary && (
            <Section title="Profile">
              <p className="text-sm leading-relaxed text-slate-800">
                {personalInfo.summary}
              </p>
            </Section>
          )}

          {experience && experience.length > 0 && (
            <Section title="Executive Experience">
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <Row
                      left={exp.position}
                      right={`${exp.startDate} — ${exp.endDate}`}
                    />
                    <div className="text-sm font-semibold text-slate-800">
                      {exp.company}
                      {exp.location && (
                        <span className="text-slate-600">
                          {' '}
                          • {exp.location}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-slate-700">
                        {exp.description}
                      </p>
                    )}
                    {exp.bullets && (
                      <ul className="ml-4 list-disc space-y-1 text-sm text-slate-800">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {education && education.length > 0 && (
            <Section title="Education">
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <Row
                      left={`${edu.degree} in ${edu.field}`}
                      right={`${edu.startDate} — ${edu.endDate}`}
                    />
                    <div className="text-sm font-semibold text-slate-800">
                      {edu.school}
                      {edu.location && (
                        <span className="text-slate-600">
                          {' '}
                          • {edu.location}
                        </span>
                      )}
                    </div>
                    {edu.gpa && (
                      <div className="text-sm text-slate-700">
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {children}
    </section>
  );
}

function Row({
  left,
  right,
  rightClass = 'text-xs font-semibold uppercase tracking-wide text-slate-600',
}: {
  left: string | undefined;
  right?: string;
  rightClass?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <div className="text-base font-semibold text-slate-900">{left}</div>
      {right && <div className={rightClass}>{right}</div>}
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 space-y-2">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">
        {title}
      </p>
      {children}
    </div>
  );
}

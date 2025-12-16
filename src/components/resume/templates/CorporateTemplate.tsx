import { ResumeData } from '@/types/resume.unified';

interface CorporateTemplateProps {
  data: ResumeData;
}

export default function CorporateTemplate({ data }: CorporateTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="mx-auto w-full max-w-[850px] bg-white px-8 py-8 font-sans text-slate-900">
      <Header personalInfo={personalInfo} />

      {personalInfo?.summary && (
        <Section title="Professional Summary">
          <p className="text-sm leading-relaxed text-slate-800">
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {skills && skills.length > 0 && (
        <Section title="Core Skills">
          <div className="flex flex-wrap gap-2 text-sm text-slate-800">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-200 px-3 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {experience && experience.length > 0 && (
        <Section title="Experience">
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
                    <span className="text-slate-600"> • {exp.location}</span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-sm text-slate-700">{exp.description}</p>
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
                    <span className="text-slate-600"> • {edu.location}</span>
                  )}
                </div>
                {edu.gpa && (
                  <div className="text-sm text-slate-700">GPA: {edu.gpa}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications && certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-2">
            {certifications.map((cert, idx) => (
              <Row
                key={idx}
                left={`${cert.name}${cert.issuer ? ` • ${cert.issuer}` : ''}`}
                right={cert.date}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Header({
  personalInfo,
}: {
  personalInfo: ResumeData['personalInfo'];
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
      <h1 className="text-4xl font-black tracking-tight">
        {personalInfo?.name || 'YOUR NAME'}
      </h1>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
        {personalInfo?.email && <span>{personalInfo.email}</span>}
        {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
        {personalInfo?.address && <span>• {personalInfo.address}</span>}
      </div>
      {(personalInfo?.linkedin ||
        personalInfo?.github ||
        personalInfo?.website) && (
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
          {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>• {personalInfo.github}</span>}
          {personalInfo?.website && <span>• {personalInfo.website}</span>}
        </div>
      )}
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
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
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

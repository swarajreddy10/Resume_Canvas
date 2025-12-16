import { cn } from '@/lib/utils';
import { ResumeData } from '@/types/resume.unified';

interface TechTemplateProps {
  data: ResumeData;
}

// Two-column tech layout: left timeline, right skills/projects sidebar
export default function TechTemplate({ data }: TechTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <div className="mx-auto grid w-full max-w-[900px] grid-cols-[2fr_1fr] gap-6 bg-white px-10 py-8 font-sans text-slate-900">
      <div className="col-span-2 border-b border-slate-200 pb-4">
        <h1 className="text-4xl font-black tracking-tight">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.address && <span>• {personalInfo.address}</span>}
        </div>
        {(personalInfo?.linkedin ||
          personalInfo?.github ||
          personalInfo?.website) && (
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-semibold text-blue-700">
            {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo?.github && <span>• {personalInfo.github}</span>}
            {personalInfo?.website && <span>• {personalInfo.website}</span>}
          </div>
        )}
        {personalInfo?.summary && (
          <p className="mt-3 text-sm leading-relaxed text-slate-800">
            {personalInfo.summary}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {experience && experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 rounded-lg">
                  <Row
                    left={exp.position}
                    right={`${exp.startDate} — ${exp.endDate}`}
                  />
                  <div className="text-sm font-semibold text-blue-700">
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

        {projects && projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-3">
              {projects.map((project, idx) => (
                <div key={idx} className="space-y-1">
                  <Row
                    left={project.name}
                    right={project.url || undefined}
                    rightClass="text-xs font-semibold uppercase tracking-wide text-blue-700"
                  />
                  <p className="text-sm text-slate-700">
                    {project.description}
                  </p>
                  {project.technologies && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Stack: {project.technologies}
                    </p>
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
                  <div className="text-sm font-semibold text-blue-700">
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
      </div>

      <aside className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-5">
        {skills && skills.length > 0 && (
          <Section title="Technical Skills" compact>
            <div className="flex flex-wrap gap-2 text-sm text-slate-800">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-slate-200 px-3 py-1 bg-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {certifications && certifications.length > 0 && (
          <Section title="Certifications" compact>
            <div className="space-y-2 text-sm text-slate-800">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="font-semibold">
                    {cert.name}
                    {cert.issuer ? ` • ${cert.issuer}` : ''}
                  </span>
                  <span className="text-xs text-slate-600">{cert.date}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </aside>
    </div>
  );
}

function Section({
  title,
  compact = false,
  children,
}: {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('space-y-3', compact ? '' : 'mt-2')}>
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

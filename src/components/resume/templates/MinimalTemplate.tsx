import { ResumeData } from '@/types/resume.unified';

interface MinimalTemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="bg-white min-h-[11in] w-[8.5in] mx-auto shadow-lg print:shadow-none print:w-full print:min-h-0 p-8">
      {/* Header */}
      <div className="mb-8">
        {personalInfo ? (
          <>
            <h1 className="text-4xl font-light text-gray-900 mb-3">
              {personalInfo.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <span>{personalInfo.email}</span>
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
            </div>
            {(personalInfo.linkedin ||
              personalInfo.github ||
              personalInfo.website) && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {personalInfo.linkedin && (
                  <span>{personalInfo.linkedin.replace('https://', '')}</span>
                )}
                {personalInfo.github && (
                  <span>{personalInfo.github.replace('https://', '')}</span>
                )}
                {personalInfo.website && (
                  <span>{personalInfo.website.replace('https://', '')}</span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-8">
            <h1 className="text-4xl font-light mb-3">Your Name</h1>
            <p className="text-gray-600">Add your personal information</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4 border-b border-gray-200 pb-1">
            Experience
          </h2>
          {experience.map((exp, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {exp.position}
                </h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                {exp.company} • {exp.location}
              </p>
              {exp.description && (
                <p className="text-gray-700 mb-3 text-sm">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="space-y-1">
                  {exp.bullets.map(
                    (bullet: string, i: number) =>
                      bullet && (
                        <li key={i} className="text-gray-700 text-sm flex">
                          <span className="mr-2">—</span>
                          <span>{bullet}</span>
                        </li>
                      )
                  )}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4 border-b border-gray-200 pb-1">
            Education
          </h2>
          {education.map((edu, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.field} • {edu.location}
                    {edu.gpa && ` • ${edu.gpa}`}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xl font-light text-gray-900 mb-4 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string) => (
              <span key={skill} className="text-gray-700 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

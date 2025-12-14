import { ResumeData } from '@/types/resume.unified';

interface ClassicTemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div className="bg-white min-h-[11in] w-[8.5in] mx-auto shadow-lg print:shadow-none print:w-full print:min-h-0 p-8 font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        {personalInfo ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personalInfo.name}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{personalInfo.email}</div>
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.address && <div>{personalInfo.address}</div>}
            </div>
          </>
        ) : (
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Your Name</h1>
            <p className="text-gray-600">Add your personal information</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Experience
          </h2>
          {experience.map((exp, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-1">
                {exp.company}, {exp.location}
              </p>
              {exp.description && (
                <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                  {exp.bullets.map(
                    (bullet: string, i: number) =>
                      bullet && <li key={i}>{bullet}</li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {education.map((edu, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">
                    {edu.school}, {edu.location}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {edu.field}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <span className="text-sm text-gray-600">
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
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="text-gray-700">{skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );
}

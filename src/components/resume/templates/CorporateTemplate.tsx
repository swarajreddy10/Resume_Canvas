import { ResumeData } from '@/types/resume.unified';

interface CorporateTemplateProps {
  data: ResumeData;
}

export default function CorporateTemplate({ data }: CorporateTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = data;

  return (
    <div className="w-[210mm] mx-auto bg-white p-10 font-sans text-gray-800 min-h-[297mm]">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>|</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.address && <span>|</span>}
          {personalInfo?.address && <span>{personalInfo.address}</span>}
        </div>
        {personalInfo?.linkedin && (
          <div className="text-xs text-blue-600 mt-1">
            {personalInfo.linkedin}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Core Competencies */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((skill, idx) => (
              <div key={idx} className="text-xs text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest border-b border-gray-200 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold text-gray-900">
                  {exp.position}
                </h3>
                <span className="text-xs text-gray-600 italic">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-700 mb-2">
                {exp.company} | {exp.location}
              </div>
              {exp.bullets && (
                <ul className="space-y-1">
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-700 pl-4 relative before:content-['◆'] before:absolute before:left-0 before:text-gray-400"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest border-b border-gray-200 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-gray-900">
                  {edu.degree}, {edu.field}
                </h3>
                <span className="text-xs text-gray-600 italic">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {edu.school} | {edu.location}
              </div>
              {edu.gpa && (
                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">
            Certifications
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-xs text-gray-700">
                <span className="font-semibold">{cert.name}</span> |{' '}
                {cert.issuer} ({cert.date})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

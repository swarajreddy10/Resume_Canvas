import { ResumeData } from '@/types/resume.unified';

interface TechTemplateProps {
  data: ResumeData;
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

  return (
    <div className="w-[210mm] mx-auto bg-white p-10 font-sans text-gray-900 min-h-[297mm]">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.address && <span>• {personalInfo.address}</span>}
        </div>
        {(personalInfo?.linkedin || personalInfo?.github) && (
          <div className="flex gap-3 text-sm text-blue-600 mt-1">
            {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo?.github && <span>• {personalInfo.github}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">
                  {exp.position}
                </h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.bullets && (
                <ul className="list-disc ml-5 space-y-1">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          {projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {project.name}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                {project.description}
              </p>
              {project.technologies && (
                <p className="text-xs text-blue-600 font-semibold">
                  Tech: {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-sm text-blue-600 font-semibold">
                {edu.school} {edu.location && `• ${edu.location}`}
              </div>
              {edu.gpa && (
                <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {cert.name} • {cert.issuer}
              </span>
              <span className="text-sm text-gray-600">{cert.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { ResumeData } from '@/types/resume.unified';

interface CorporateTemplateProps {
  data: ResumeData;
}

export default function CorporateTemplate({ data }: CorporateTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-6 font-sans text-black">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="text-sm text-gray-700">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo?.address && <span> • {personalInfo.address}</span>}
        </div>
        {(personalInfo?.linkedin || personalInfo?.website) && (
          <div className="text-sm text-gray-700 mt-1">
            {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo?.website && <span> • {personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            PROFESSIONAL EXPERIENCE
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {exp.company}, {exp.location}
              </div>
              {exp.description && (
                <p className="text-sm text-gray-800 mb-2">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-none space-y-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-800 pl-4">
                      • {bullet}
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
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {edu.school}, {edu.location}
                {edu.gpa && <span> • GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            SKILLS
          </h2>
          <div className="text-sm text-gray-800 leading-relaxed">
            {skills.join(', ')}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            CERTIFICATIONS
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold">{cert.name}</span>
                <span className="text-xs text-gray-600">{cert.date}</span>
              </div>
              <div className="text-sm text-gray-700">{cert.issuer}</div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 text-gray-900">
            PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-sm font-bold">{project.name}</h3>
              <p className="text-sm text-gray-800 mb-1">
                {project.description}
              </p>
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Technologies:</span>{' '}
                {project.technologies}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { ResumeData } from '@/types/resume.unified';

interface AcademicTemplateProps {
  data: ResumeData;
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

  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-6 font-serif text-black">
      {/* Header - Formal academic style */}
      <div className="text-center mb-6 pb-3 border-b border-gray-400">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="text-xs text-gray-700">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo?.address && <span> • {personalInfo.address}</span>}
        </div>
        {(personalInfo?.linkedin || personalInfo?.website) && (
          <div className="text-xs text-gray-700 mt-1">
            {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo?.website && <span> • {personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Research Interests / Summary */}
      {personalInfo?.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            RESEARCH INTERESTS
          </h2>
          <p className="text-xs leading-relaxed text-gray-800">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Education - Most important for academic roles */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-bold">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {edu.school}, {edu.location}
                {edu.gpa && <span> • GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Academic Experience / Research Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            RESEARCH & ACADEMIC EXPERIENCE
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xs font-bold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700 mb-2">
                {exp.company}, {exp.location}
              </div>
              {exp.description && (
                <p className="text-xs text-gray-800 mb-2">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-none space-y-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-xs text-gray-800 pl-3">
                      • {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Research Projects / Publications */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            RESEARCH PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xs font-bold">{project.name}</h3>
              <p className="text-xs text-gray-800 mb-1">
                {project.description}
              </p>
              <div className="text-xs text-gray-700">
                <span className="font-semibold">Methods/Tools:</span>{' '}
                {project.technologies}
              </div>
              {project.url && (
                <div className="text-xs text-gray-600 mt-1">{project.url}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills / Technical Competencies */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            TECHNICAL SKILLS
          </h2>
          <div className="text-xs text-gray-800 leading-relaxed">
            {skills.join(', ')}
          </div>
        </div>
      )}

      {/* Certifications / Professional Development */}
      {certifications && certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
            CERTIFICATIONS & PROFESSIONAL DEVELOPMENT
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold">{cert.name}</span>
                <span className="text-xs text-gray-600">{cert.date}</span>
              </div>
              <div className="text-xs text-gray-700">{cert.issuer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

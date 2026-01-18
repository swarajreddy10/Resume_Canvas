import { ResumeData } from '@/types/resume.unified';

interface CreativeTemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <div className="w-[210mm] mx-auto bg-white font-sans text-gray-900 min-h-[297mm]">
      {/* Header with accent */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm opacity-90">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.address && <span>• {personalInfo.address}</span>}
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* About */}
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-purple-600 mb-2 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              ABOUT ME
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
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
            <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              EXPERIENCE
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4 pl-4 border-l-2 border-purple-200">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-xs text-purple-600 font-semibold">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.bullets && (
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-purple-400"
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              PROJECTS
            </h2>
            {projects.map((project, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-700 mt-1">
                  {project.description}
                </p>
                {project.technologies && (
                  <p className="text-xs text-purple-600 font-medium mt-1">
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
            <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              EDUCATION
            </h2>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-xs text-gray-700">
                  {edu.school} • {edu.startDate} - {edu.endDate}
                </p>
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
            <h2 className="text-base font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600"></span>
              CERTIFICATIONS
            </h2>
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-xs text-gray-700 mb-1">
                <span className="font-semibold">{cert.name}</span> •{' '}
                {cert.issuer} • {cert.date}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

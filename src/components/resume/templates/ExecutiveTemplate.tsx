import { ResumeData } from '@/types/resume.unified';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <div className="w-[210mm] mx-auto bg-white flex font-serif text-gray-900 min-h-[297mm]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">
            {personalInfo?.name || 'YOUR NAME'}
          </h1>
          <div className="h-1 w-12 bg-white mb-3"></div>
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-2">
              Contact
            </h3>
            {personalInfo?.email && (
              <p className="text-gray-300 mb-1">{personalInfo.email}</p>
            )}
            {personalInfo?.phone && (
              <p className="text-gray-300 mb-1">{personalInfo.phone}</p>
            )}
            {personalInfo?.address && (
              <p className="text-gray-300 mb-1">{personalInfo.address}</p>
            )}
            {personalInfo?.linkedin && (
              <p className="text-gray-300 mb-1">{personalInfo.linkedin}</p>
            )}
          </div>

          {skills && skills.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">
                Core Competencies
              </h3>
              <div className="space-y-1">
                {skills.map((skill, idx) => (
                  <div key={idx} className="text-gray-300 text-sm">
                    • {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">
                Certifications
              </h3>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-gray-300 text-sm font-semibold">
                    {cert.name}
                  </p>
                  <p className="text-gray-400 text-sm">{cert.issuer}</p>
                  <p className="text-gray-400 text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">
                Education
              </h3>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-gray-300 text-sm font-semibold">
                    {edu.degree}
                  </p>
                  <p className="text-gray-300 text-sm">{edu.field}</p>
                  <p className="text-gray-400 text-sm">{edu.school}</p>
                  <p className="text-gray-400 text-sm">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-400 text-sm">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-b-2 border-gray-900 pb-1">
              Executive Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-900 pb-1">
              Professional Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-sm text-gray-600 font-semibold">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.bullets && (
                  <ul className="space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 pl-3 relative before:content-['▪'] before:absolute before:left-0"
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

        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-900 pb-1">
              Key Projects
            </h2>
            {projects.map((project, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="text-base font-bold text-gray-900">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.description}
                </p>
                {project.technologies && (
                  <p className="text-sm text-gray-600 italic mt-1">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

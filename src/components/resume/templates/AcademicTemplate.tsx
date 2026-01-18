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
    <div className="w-[210mm] mx-auto bg-white p-10 font-serif text-gray-900 min-h-[297mm]">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {personalInfo?.name || 'YOUR NAME'}
        </h1>
        <div className="text-xs text-gray-700 space-y-1">
          <div>{personalInfo?.address}</div>
          <div>
            {personalInfo?.email}{' '}
            {personalInfo?.phone && `• ${personalInfo.phone}`}
          </div>
          {personalInfo?.linkedin && <div>{personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* Research Interests */}
      {personalInfo?.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Research Interests
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed italic">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700 italic">
                {edu.school}, {edu.location}
              </div>
              {edu.gpa && (
                <p className="text-xs text-gray-600">GPA: {edu.gpa}/4.0</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Academic Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Academic Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold text-gray-900">
                  {exp.position}
                </h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700 italic mb-1">
                {exp.company}, {exp.location}
              </div>
              {exp.bullets && (
                <ul className="list-disc ml-5 space-y-0.5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="text-xs text-gray-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Research Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Research Projects
          </h2>
          {projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                {project.name}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {project.description}
              </p>
              {project.technologies && (
                <p className="text-xs text-gray-600 italic mt-1">
                  Methods: {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Technical Skills
          </h2>
          <p className="text-xs text-gray-700">{skills.join(' • ')}</p>
        </div>
      )}

      {/* Certifications & Awards */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">
            Certifications & Awards
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-1">
              <span className="text-xs text-gray-700">
                <span className="font-semibold">{cert.name}</span>,{' '}
                {cert.issuer}, {cert.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

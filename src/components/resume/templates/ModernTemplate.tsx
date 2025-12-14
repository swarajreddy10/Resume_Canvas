import { ResumeData } from '@/types/resume.unified';

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills } = data;
  const { projects, certifications } = data;

  return (
    <div
      className="bg-white min-h-[11in] w-[8.5in] mx-auto shadow-lg print:shadow-none print:w-full print:min-h-0 print:text-black"
      style={{ printColorAdjust: 'exact' }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        {personalInfo ? (
          <>
            <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              <span>{personalInfo.email}</span>
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
            </div>
            {(personalInfo.linkedin ||
              personalInfo.github ||
              personalInfo.website) && (
              <div className="flex flex-wrap gap-6 text-blue-200 mt-2 text-sm">
                {personalInfo.linkedin && (
                  <span>
                    LinkedIn: {personalInfo.linkedin.replace('https://', '')}
                  </span>
                )}
                {personalInfo.github && (
                  <span>
                    GitHub: {personalInfo.github.replace('https://', '')}
                  </span>
                )}
                {personalInfo.website && (
                  <span>
                    Website: {personalInfo.website.replace('https://', '')}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold mb-2">Your Name</h1>
            <p className="text-blue-200">
              Add your personal information to see it here
            </p>
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {personalInfo?.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index: number) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-blue-200"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 font-medium text-lg">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-gray-700 mb-3 italic">
                      {exp.description}
                    </p>
                  )}

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {exp.bullets.map(
                        (bullet: string, bulletIndex: number) =>
                          bullet && (
                            <li key={bulletIndex} className="flex items-start">
                              <span className="text-blue-600 mr-2 mt-1">▸</span>
                              <span className="text-gray-700">{bullet}</span>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 font-medium">{edu.school}</p>
                    <p className="text-gray-600">
                      {edu.field} • {edu.location}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Technical Skills
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill: string) => (
                <div
                  key={skill}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 px-4 py-2 rounded-lg text-center"
                >
                  <span className="text-blue-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index: number) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <p className="text-blue-600 text-sm mb-2">
                    {project.technologies}
                  </p>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  {project.url && (
                    <a
                      href={String(project.url)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-blue-600 text-sm">{cert.issuer}</p>
                  <p className="text-gray-600 text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

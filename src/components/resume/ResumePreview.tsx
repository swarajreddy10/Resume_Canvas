import { ResumeData, Experience, Education } from '@/types/resume.unified';

interface ResumePreviewProps {
  data: {
    personalInfo?: ResumeData['personalInfo'];
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
  };
  template?: 'modern' | 'classic';
}

export default function ResumePreview({
  data,
  template = 'modern',
}: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = data;

  if (template === 'modern') {
    return (
      <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 shadow-lg rounded-lg w-full min-w-0 overflow-x-auto text-xs sm:text-sm">
        {/* Header */}
        {personalInfo && (
          <div className="border-b-2 border-blue-600 pb-2 sm:pb-3 mb-3 sm:mb-4">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 word-wrap break-words hyphens-auto">
              {personalInfo.name}
            </h1>
            <div className="flex flex-col gap-0.5 sm:gap-1 text-xs text-gray-600">
              <span className="word-wrap break-all">{personalInfo.email}</span>
              {personalInfo.phone && (
                <span className="word-wrap break-words">
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.address && (
                <span className="word-wrap break-words">
                  {personalInfo.address}
                </span>
              )}
            </div>
            {(personalInfo.linkedin ||
              personalInfo.github ||
              personalInfo.website) && (
              <div className="flex flex-col gap-0.5 sm:gap-1 text-xs text-blue-600 mt-1 sm:mt-2">
                {personalInfo.linkedin && (
                  <a
                    href={personalInfo.linkedin}
                    className="hover:underline word-wrap break-all"
                  >
                    LinkedIn
                  </a>
                )}
                {personalInfo.github && (
                  <a
                    href={personalInfo.github}
                    className="hover:underline word-wrap break-all"
                  >
                    GitHub
                  </a>
                )}
                {personalInfo.website && (
                  <a
                    href={personalInfo.website}
                    className="hover:underline word-wrap break-all"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 border-l-4 border-blue-600 pl-2">
              Experience
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {experience.map((exp: Experience, index: number) => (
                <div key={index} className="border-l-2 border-gray-200 pl-2">
                  <div className="mb-0.5 sm:mb-1">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm word-wrap break-words hyphens-auto">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-gray-600 block">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium mb-0.5 sm:mb-1 text-xs word-wrap break-words">
                    {exp.company} • {exp.location}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mb-1 word-wrap break-words hyphens-auto">
                      {exp.description}
                    </p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 pl-1">
                      {exp.bullets.map(
                        (bullet: string, bulletIndex: number) =>
                          bullet && (
                            <li
                              key={bulletIndex}
                              className="word-wrap break-words hyphens-auto"
                            >
                              {bullet}
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu: Education, index: number) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium">{edu.school}</p>
                  <p className="text-gray-700 text-sm">
                    {edu.field} • {edu.location}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 border-l-4 border-blue-600 pl-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium break-words"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!personalInfo && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Your resume preview will appear here</p>
            <p className="text-sm">
              Start filling out your information to see the preview
            </p>
          </div>
        )}
      </div>
    );
  }

  // Classic template (fallback)
  return (
    <div className="bg-white p-8 shadow-lg max-w-2xl mx-auto font-serif">
      {personalInfo && (
        <div className="text-center border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {personalInfo.name}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            <div>{personalInfo.email}</div>
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
          </div>
        </div>
      )}

      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      {!personalInfo && (
        <div className="text-center py-12 text-gray-500">
          <p>Classic template preview will appear here</p>
        </div>
      )}
    </div>
  );
}

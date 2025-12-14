interface ResumeDataForPDF {
  title?: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    summary?: string;
  };
  experience?: Array<{
    position?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    field?: string;
    school?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: string[];
}

export async function generatePDF(
  resumeData: ResumeDataForPDF
): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resumeData.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
        .experience-item, .education-item { margin-bottom: 15px; }
        .job-title { font-weight: bold; }
        .company { font-style: italic; }
        .date { color: #666; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData.personalInfo?.name || 'Resume'}</h1>
        <p>${resumeData.personalInfo?.email || ''} | ${resumeData.personalInfo?.phone || ''}</p>
        <p>${resumeData.personalInfo?.address || ''}</p>
      </div>
      
      ${
        resumeData.personalInfo?.summary
          ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${resumeData.personalInfo.summary}</p>
        </div>
      `
          : ''
      }
      
      ${
        resumeData.experience?.length
          ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${resumeData.experience
            .map(
              (exp) => `
            <div class="experience-item">
              <div class="job-title">${exp.position}</div>
              <div class="company">${exp.company} | ${exp.location}</div>
              <div class="date">${exp.startDate} - ${exp.endDate}</div>
              <p>${exp.description}</p>
              ${exp.bullets?.length ? `<ul>${exp.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
      
      ${
        resumeData.education?.length
          ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resumeData.education
            .map(
              (edu) => `
            <div class="education-item">
              <div class="job-title">${edu.degree} in ${edu.field}</div>
              <div class="company">${edu.school} | ${edu.location}</div>
              <div class="date">${edu.startDate} - ${edu.endDate}</div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
      
      ${
        resumeData.skills?.length
          ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills">
            ${resumeData.skills.map((skill) => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      `
          : ''
      }
    </body>
    </html>
  `;

  return Buffer.from(html, 'utf-8');
}

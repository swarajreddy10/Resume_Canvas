import puppeteer from 'puppeteer';
import { appConfig } from '@/lib/config/app.config';
import { logger } from '@/lib/utils/logger';

interface ResumeDataForPDF {
  title?: string;
  templateId?: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    summary?: string;
    linkedin?: string;
    github?: string;
    website?: string;
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
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    url?: string;
  }>;
}

function generateModernTemplateHTML(data: ResumeDataForPDF): string {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.title || 'Resume'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          background: white;
        }
        .resume-container {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
          background: white;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 2rem;
        }
        .header h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .header .contact {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          color: #dbeafe;
          margin-bottom: 0.5rem;
        }
        .header .links {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          color: #bfdbfe;
          font-size: 0.875rem;
        }
        .content {
          padding: 2rem;
        }
        .section {
          margin-bottom: 2rem;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #2563eb;
        }
        .summary {
          color: #374151;
          line-height: 1.6;
          text-align: justify;
        }
        .experience-item {
          position: relative;
          padding-left: 1.5rem;
          border-left: 2px solid #dbeafe;
          margin-bottom: 1.5rem;
        }
        .experience-item::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 0;
          width: 16px;
          height: 16px;
          background: #2563eb;
          border-radius: 50%;
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        .company {
          color: #2563eb;
          font-weight: 500;
          font-size: 1.125rem;
        }
        .date-badge {
          background: #f3f4f6;
          color: #4b5563;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .job-description {
          color: #374151;
          margin-bottom: 0.75rem;
          font-style: italic;
        }
        .bullets {
          list-style: none;
        }
        .bullets li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .bullets li::before {
          content: '▸';
          color: #2563eb;
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }
        .education-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .degree {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .school {
          color: #2563eb;
          font-weight: 500;
        }
        .field {
          color: #4b5563;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .skill-item {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          text-align: center;
          color: #1e40af;
          font-weight: 500;
        }
        .project-item {
          border-left: 4px solid #dbeafe;
          padding-left: 1rem;
          margin-bottom: 1rem;
        }
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .project-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .project-tech {
          color: #2563eb;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .project-description {
          color: #374151;
          font-size: 0.875rem;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .cert-item {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .cert-name {
          font-weight: 600;
          color: #111827;
        }
        .cert-issuer {
          color: #2563eb;
          font-size: 0.875rem;
        }
        .cert-date {
          color: #4b5563;
          font-size: 0.875rem;
        }
        @media print {
          .resume-container { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <!-- Header Section -->
        <div class="header">
          <h1>${personalInfo?.name || 'Your Name'}</h1>
          <div class="contact">
            ${personalInfo?.email ? `<span>${personalInfo.email}</span>` : ''}
            ${personalInfo?.phone ? `<span>${personalInfo.phone}</span>` : ''}
            ${personalInfo?.address ? `<span>${personalInfo.address}</span>` : ''}
          </div>
          ${
            personalInfo?.linkedin ||
            personalInfo?.github ||
            personalInfo?.website
              ? `
          <div class="links">
            ${personalInfo?.linkedin ? `<span>LinkedIn: ${personalInfo.linkedin.replace('https://', '')}</span>` : ''}
            ${personalInfo?.github ? `<span>GitHub: ${personalInfo.github.replace('https://', '')}</span>` : ''}
            ${personalInfo?.website ? `<span>Website: ${personalInfo.website.replace('https://', '')}</span>` : ''}
          </div>
          `
              : ''
          }
        </div>

        <div class="content">
          <!-- Professional Summary -->
          ${
            personalInfo?.summary
              ? `
          <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary">${personalInfo.summary}</p>
          </section>
          `
              : ''
          }

          <!-- Experience Section -->
          ${
            experience?.length
              ? `
          <section class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${experience
              .map(
                (exp) => `
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <h3 class="job-title">${exp.position || ''}</h3>
                  <p class="company">${exp.company || ''} • ${exp.location || ''}</p>
                </div>
                <span class="date-badge">${exp.startDate || ''} - ${exp.endDate || ''}</span>
              </div>
              ${exp.description ? `<p class="job-description">${exp.description}</p>` : ''}
              ${
                exp.bullets?.length
                  ? `
              <ul class="bullets">
                ${exp.bullets.map((bullet) => (bullet ? `<li>${bullet}</li>` : '')).join('')}
              </ul>
              `
                  : ''
              }
            </div>
            `
              )
              .join('')}
          </section>
          `
              : ''
          }

          <!-- Education Section -->
          ${
            education?.length
              ? `
          <section class="section">
            <h2 class="section-title">Education</h2>
            ${education
              .map(
                (edu) => `
            <div class="education-item">
              <div>
                <h3 class="degree">${edu.degree || ''}</h3>
                <p class="school">${edu.school || ''}</p>
                <p class="field">${edu.field || ''} • ${edu.location || ''}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</p>
              </div>
              <span class="date-badge">${edu.startDate || ''} - ${edu.endDate || ''}</span>
            </div>
            `
              )
              .join('')}
          </section>
          `
              : ''
          }

          <!-- Skills Section -->
          ${
            skills?.length
              ? `
          <section class="section">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
              ${skills.map((skill) => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
          </section>
          `
              : ''
          }

          <!-- Projects Section -->
          ${
            projects?.length
              ? `
          <section class="section">
            <h2 class="section-title">Projects</h2>
            ${projects
              .map(
                (project) => `
            <div class="project-item">
              <div class="project-header">
                <h3 class="project-name">${project.name || ''}</h3>
                <span class="date-badge">${project.startDate || ''} - ${project.endDate || ''}</span>
              </div>
              <p class="project-tech">${project.technologies || ''}</p>
              <p class="project-description">${project.description || ''}</p>
            </div>
            `
              )
              .join('')}
          </section>
          `
              : ''
          }

          <!-- Certifications Section -->
          ${
            certifications?.length
              ? `
          <section class="section">
            <h2 class="section-title">Certifications</h2>
            <div class="cert-grid">
              ${certifications
                .map(
                  (cert) => `
              <div class="cert-item">
                <h3 class="cert-name">${cert.name || ''}</h3>
                <p class="cert-issuer">${cert.issuer || ''}</p>
                <p class="cert-date">${cert.date || ''}</p>
              </div>
              `
                )
                .join('')}
            </div>
          </section>
          `
              : ''
          }
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function generatePDF(
  resumeData: ResumeDataForPDF
): Promise<Buffer> {
  let browser;

  try {
    const launchArgs = [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
    ];

    if (!appConfig.security.puppeteer.sandbox) {
      launchArgs.push('--no-sandbox', '--disable-setuid-sandbox');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: launchArgs,
      timeout: appConfig.security.puppeteer.timeout,
      protocolTimeout: appConfig.security.puppeteer.protocolTimeout,
    });

    const page = await browser.newPage();
    const html = generateModernTemplateHTML(resumeData);

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 10000,
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.25in',
        right: '0.25in',
        bottom: '0.25in',
        left: '0.25in',
      },
      timeout: 15000,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    logger.error('Error generating PDF', { error });
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

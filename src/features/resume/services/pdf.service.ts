import { appConfig } from '@/lib/config/app.config';
import { sanitizeString } from '@/lib/security/sanitize';
import { logger } from '@/lib/utils/logger';
import puppeteer from 'puppeteer';

interface ResumeDataForPDF {
  title?: string;
  templateId?: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    position?: string;
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

const safe = (val?: string) => sanitizeString(val || '', { allowHtml: false });
const renderList = (items?: string[], className = '') =>
  items?.length
    ? `<ul class="${className}">${items
        .filter(Boolean)
        .map((item) => `<li>${safe(item)}</li>`)
        .join('')}</ul>`
    : '';

function executiveTemplate(data: ResumeDataForPDF): string {
  const { personalInfo, experience, education, skills, certifications } = data;
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${safe(personalInfo?.name || 'Resume')}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', serif; color: #0f172a; background: white; }
      .container { display: grid; grid-template-columns: 1fr 2fr; width: 8.5in; min-height: 11in; margin: 0 auto; }
      .sidebar { background: #0f172a; color: #e2e8f0; padding: 28px; }
      .main { padding: 28px; background: white; }
      h1 { font-size: 28px; font-weight: 800; letter-spacing: 0.4px; }
      .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #cbd5e1; margin: 18px 0 10px; }
      .pill { display: inline-block; background: #1e293b; padding: 6px 10px; border-radius: 10px; margin-bottom: 8px; font-size: 12px; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .section h2 { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
      .item { margin-bottom: 12px; }
      .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
      .title { font-size: 15px; font-weight: 700; }
      .subtitle { font-size: 13px; color: #1d4ed8; font-weight: 600; }
      .meta { font-size: 12px; color: #475569; }
      .desc { font-size: 12px; color: #334155; margin: 6px 0; }
      ul { padding-left: 18px; color: #cbd5e1; font-size: 12px; }
      ul li { margin-bottom: 6px; }
    </style>
  </head>
  <body>
    <div class="container">
      <aside class="sidebar">
        ${
          personalInfo?.position
            ? `<div class="pill">${safe(personalInfo.position)}</div>`
            : ''
        }
        <h1>${safe(personalInfo?.name || 'Your Name')}</h1>
        <div class="section">
          <div class="label">Contact</div>
          ${safe(personalInfo?.email)}<br/>
          ${safe(personalInfo?.phone)}<br/>
          ${safe(personalInfo?.address)}<br/>
          ${safe(personalInfo?.linkedin)}
        </div>
        ${
          skills?.length
            ? `<div class="section"><div class="label">Key Competencies</div>${renderList(skills)}</div>`
            : ''
        }
        ${
          certifications?.length
            ? `<div class="section"><div class="label">Certifications</div>${renderList(
                certifications.map(
                  (c) =>
                    `${safe(c.name)}${c.issuer ? ` — ${safe(c.issuer)}` : ''}`
                )
              )}</div>`
            : ''
        }
      </aside>
      <main class="main">
        ${
          personalInfo?.summary
            ? `<div class="section"><h2>Profile</h2><p class="desc">${safe(personalInfo.summary)}</p></div>`
            : ''
        }
        ${
          experience?.length
            ? `<div class="section"><h2>Experience</h2>${experience
                .map(
                  (exp) => `
              <div class="item">
                <div class="row">
                  <div>
                    <div class="title">${safe(exp.position)}</div>
                    <div class="subtitle">${safe(exp.company)}</div>
                  </div>
                  <div class="meta">${safe(exp.startDate)} — ${safe(exp.endDate)}</div>
                </div>
                <div class="meta">${safe(exp.location)}</div>
                ${exp.description ? `<div class="desc">${safe(exp.description)}</div>` : ''}
                ${renderList(exp.bullets)}
              </div>
            `
                )
                .join('')}</div>`
            : ''
        }
        ${
          education?.length
            ? `<div class="section"><h2>Education</h2>${education
                .map(
                  (edu) => `
              <div class="item">
                <div class="row">
                  <div class="title">${safe(edu.degree)} in ${safe(edu.field)}</div>
                  <div class="meta">${safe(edu.startDate)} — ${safe(edu.endDate)}</div>
                </div>
                <div class="subtitle">${safe(edu.school)}</div>
                <div class="meta">${safe(edu.location)}${edu.gpa ? ` • GPA: ${safe(edu.gpa)}` : ''}</div>
              </div>
            `
                )
                .join('')}</div>`
            : ''
        }
      </main>
    </div>
  </body>
  </html>`;
}

function techTemplate(data: ResumeDataForPDF): string {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${safe(personalInfo?.name || 'Resume')}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #0f172a; background: white; }
      .grid { display: grid; grid-template-columns: 2fr 1fr; width: 8.5in; min-height: 11in; margin: 0 auto; gap: 20px; padding: 20px; }
      .header { grid-column: 1 / -1; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
      h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.3px; }
      .meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; color: #334155; font-size: 12px; }
      .section { margin-top: 14px; page-break-inside: avoid; }
      .section h2 { font-size: 13px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
      .item { margin-bottom: 12px; }
      .row { display: flex; justify-content: space-between; gap: 8px; }
      .title { font-size: 15px; font-weight: 700; }
      .subtitle { font-size: 13px; color: #2563eb; font-weight: 600; }
      .text { font-size: 12px; color: #475569; }
      ul { padding-left: 16px; color: #334155; font-size: 12px; }
      ul li { margin-bottom: 6px; }
      .pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #dbeafe; background: #f8fafc; padding: 6px 10px; border-radius: 999px; font-size: 12px; color: #1d4ed8; margin: 4px 4px 0 0; }
      .sidebar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
    </style>
  </head>
  <body>
    <div class="grid">
      <header class="header">
        <h1>${safe(personalInfo?.name || 'Your Name')}</h1>
        <div class="meta">
          ${personalInfo?.email ? `<span>${safe(personalInfo.email)}</span>` : ''}
          ${personalInfo?.phone ? `<span>${safe(personalInfo.phone)}</span>` : ''}
          ${personalInfo?.address ? `<span>${safe(personalInfo.address)}</span>` : ''}
          ${personalInfo?.linkedin ? `<span>${safe(personalInfo.linkedin)}</span>` : ''}
          ${personalInfo?.github ? `<span>${safe(personalInfo.github)}</span>` : ''}
        </div>
        ${personalInfo?.summary ? `<p class="text" style="margin-top:8px;">${safe(personalInfo.summary)}</p>` : ''}
      </header>

      <main>
        ${
          experience?.length
            ? `<div class="section"><h2>Experience</h2>${experience
                .map(
                  (exp) => `
            <div class="item">
              <div class="row">
                <div>
                  <div class="title">${safe(exp.position)}</div>
                  <div class="subtitle">${safe(exp.company)}</div>
                </div>
                <div class="text">${safe(exp.startDate)} — ${safe(exp.endDate)}</div>
              </div>
              <div class="text">${safe(exp.location)}</div>
              ${exp.description ? `<div class="text" style="margin:6px 0;">${safe(exp.description)}</div>` : ''}
              ${renderList(exp.bullets)}
            </div>
          `
                )
                .join('')}</div>`
            : ''
        }

        ${
          projects?.length
            ? `<div class="section"><h2>Projects</h2>${projects
                .map(
                  (project) => `
            <div class="item">
              <div class="row">
                <div class="title">${safe(project.name)}</div>
                <div class="text">${safe(project.startDate)} — ${safe(project.endDate)}</div>
              </div>
              <div class="text" style="color:#1d4ed8;">${safe(project.technologies)}</div>
              <div class="text">${safe(project.description)}</div>
            </div>
          `
                )
                .join('')}</div>`
            : ''
        }

        ${
          education?.length
            ? `<div class="section"><h2>Education</h2>${education
                .map(
                  (edu) => `
            <div class="item">
              <div class="row">
                <div class="title">${safe(edu.degree)} in ${safe(edu.field)}</div>
                <div class="text">${safe(edu.startDate)} — ${safe(edu.endDate)}</div>
              </div>
              <div class="subtitle">${safe(edu.school)}</div>
              <div class="text">${safe(edu.location)}${edu.gpa ? ` • GPA: ${safe(edu.gpa)}` : ''}</div>
            </div>
          `
                )
                .join('')}</div>`
            : ''
        }
      </main>

      <aside class="sidebar">
        ${
          skills?.length
            ? `<div class="section" style="margin-top:0;"><h2>Skills</h2><div>${skills
                .map((skill) => `<span class="pill">${safe(skill)}</span>`)
                .join('')}</div></div>`
            : ''
        }
        ${
          certifications?.length
            ? `<div class="section"><h2>Certifications</h2>${renderList(
                certifications.map(
                  (c) =>
                    `${safe(c.name)}${c.issuer ? ` — ${safe(c.issuer)}` : ''}`
                )
              )}</div>`
            : ''
        }
      </aside>
    </div>
  </body>
  </html>`;
}

function standardTemplate(data: ResumeDataForPDF, accent = '#1d4ed8'): string {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${safe(personalInfo?.name || 'Resume')}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #0f172a; background: white; }
      .container { width: 8.5in; min-height: 11in; margin: 0 auto; padding: 26px; }
      .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px; }
      h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.2px; color: #0f172a; }
      .contact { display: flex; flex-wrap: wrap; gap: 10px; color: #334155; font-size: 12px; margin-top: 6px; }
      .summary { font-size: 13px; color: #475569; margin-top: 10px; }
      .section { margin-top: 16px; page-break-inside: avoid; }
      .section h2 { font-size: 13px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
      .item { margin-bottom: 12px; }
      .row { display: flex; justify-content: space-between; gap: 8px; }
      .title { font-size: 15px; font-weight: 700; }
      .subtitle { font-size: 13px; color: ${accent}; font-weight: 600; }
      .text { font-size: 12px; color: #475569; }
      ul { padding-left: 16px; color: #334155; font-size: 12px; }
      ul li { margin-bottom: 6px; }
      .badge { display: inline-block; padding: 5px 10px; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; color: ${accent}; background: #f8fafc; margin: 4px 4px 0 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${safe(personalInfo?.name || 'Your Name')}</h1>
        <div class="contact">
          ${personalInfo?.email ? `<span>${safe(personalInfo.email)}</span>` : ''}
          ${personalInfo?.phone ? `<span>${safe(personalInfo.phone)}</span>` : ''}
          ${personalInfo?.address ? `<span>${safe(personalInfo.address)}</span>` : ''}
          ${personalInfo?.linkedin ? `<span>${safe(personalInfo.linkedin)}</span>` : ''}
          ${personalInfo?.github ? `<span>${safe(personalInfo.github)}</span>` : ''}
        </div>
        ${personalInfo?.summary ? `<p class="summary">${safe(personalInfo.summary)}</p>` : ''}
      </div>

      ${
        experience?.length
          ? `<div class="section"><h2>Experience</h2>${experience
              .map(
                (exp) => `
        <div class="item">
          <div class="row">
            <div>
              <div class="title">${safe(exp.position)}</div>
              <div class="subtitle">${safe(exp.company)}</div>
            </div>
            <div class="text">${safe(exp.startDate)} — ${safe(exp.endDate)}</div>
          </div>
          <div class="text">${safe(exp.location)}</div>
          ${exp.description ? `<div class="text" style="margin:6px 0;">${safe(exp.description)}</div>` : ''}
          ${renderList(exp.bullets)}
        </div>
      `
              )
              .join('')}</div>`
          : ''
      }

      ${
        education?.length
          ? `<div class="section"><h2>Education</h2>${education
              .map(
                (edu) => `
        <div class="item">
          <div class="row">
            <div class="title">${safe(edu.degree)} in ${safe(edu.field)}</div>
            <div class="text">${safe(edu.startDate)} — ${safe(edu.endDate)}</div>
          </div>
          <div class="subtitle">${safe(edu.school)}</div>
          <div class="text">${safe(edu.location)}${edu.gpa ? ` • GPA: ${safe(edu.gpa)}` : ''}</div>
        </div>
      `
              )
              .join('')}</div>`
          : ''
      }

      ${
        skills?.length
          ? `<div class="section"><h2>Skills</h2><div>${skills
              .map((skill) => `<span class="badge">${safe(skill)}</span>`)
              .join('')}</div></div>`
          : ''
      }

      ${
        projects?.length
          ? `<div class="section"><h2>Projects</h2>${projects
              .map(
                (project) => `
        <div class="item">
          <div class="row">
            <div class="title">${safe(project.name)}</div>
            <div class="text">${safe(project.startDate)} — ${safe(project.endDate)}</div>
          </div>
          <div class="text" style="color:${accent};">${safe(project.technologies)}</div>
          <div class="text">${safe(project.description)}</div>
        </div>
      `
              )
              .join('')}</div>`
          : ''
      }

      ${
        certifications?.length
          ? `<div class="section"><h2>Certifications</h2>${renderList(
              certifications.map(
                (c) =>
                  `${safe(c.name)}${c.issuer ? ` — ${safe(c.issuer)}` : ''}`
              )
            )}</div>`
          : ''
      }
    </div>
  </body>
  </html>`;
}

export async function generatePDF(
  resumeData: ResumeDataForPDF
): Promise<Buffer> {
  let browser = null;
  let page = null;

  try {
    // Validate that we have at least minimal data
    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    // Secure Puppeteer launch arguments
    const launchArgs = [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ];

    // Only disable sandbox in production if explicitly configured
    if (!appConfig.security.puppeteer.sandbox) {
      launchArgs.push('--no-sandbox', '--disable-setuid-sandbox');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: launchArgs,
      timeout: appConfig.security.puppeteer.timeout,
      protocolTimeout: appConfig.security.puppeteer.protocolTimeout,
    });

    page = await browser.newPage();
    const templateId = resumeData.templateId || 'standard';
    let html: string;

    if (templateId === 'executive') {
      html = executiveTemplate(resumeData);
    } else if (templateId === 'tech') {
      html = techTemplate(resumeData);
    } else if (templateId === 'corporate') {
      html = standardTemplate(resumeData, '#1f2937');
    } else if (templateId === 'creative') {
      html = standardTemplate(resumeData, '#0f766e');
    } else if (templateId === 'academic') {
      html = standardTemplate(resumeData, '#0ea5e9');
    } else {
      html = standardTemplate(resumeData);
    }

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 10000 });

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
    logger.error('Error generating PDF', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    if (page) {
      await page
        .close()
        .catch((err) => logger.error('Failed to close page', { error: err }));
    }
    if (browser) {
      await browser
        .close()
        .catch((err) =>
          logger.error('Failed to close browser', { error: err })
        );
    }
  }
}

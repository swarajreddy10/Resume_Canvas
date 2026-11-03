/**
 * The five résumé templates are what users preview and export as PDF, so their markup is
 * pinned: a refactor must render the same document, and a design change shows up here as a
 * reviewed snapshot update (`bun test --update-snapshots`).
 */
import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import {
  TEMPLATE_IDS,
  TEMPLATE_SAMPLE_DATA,
} from '@/components/resume/templateLibrary';
import type { ResumeData } from '@/types/resume.unified';

// Non-ASCII text, only the required fields, an entry with no bullets and no location.
const SPARSE: ResumeData = {
  personalInfo: { name: 'Zoë Ñúñez-Øberg 李', email: 'zoe@example.com' },
  experience: [
    {
      company: 'Café Ünïcode',
      position: 'Ingénieure logicielle',
      location: '',
      startDate: '2024',
      endDate: 'Present',
      bullets: [],
    },
  ],
  education: [
    {
      school: 'Universität Zürich',
      degree: 'MSc',
      field: 'Informatik',
      location: '',
      startDate: '2020',
      endDate: '2022',
    },
  ],
  skills: [],
};

// React writes inline declarations in object-key order, which has no effect on the result
// when no property repeats; sorting them pins what is rendered, not how it is spelled.
// A declaration starts after a `;` followed by `property:`, so entities such as &#x27;
// inside a value are not split.
function normalizeStyles(html: string): string {
  return html.replace(
    /style="([^"]*)"/g,
    (_, css: string) =>
      `style="${css
        .split(/;(?=[a-z-]+:)/)
        .filter(Boolean)
        .sort()
        .join(';')}"`
  );
}

function render(template: (typeof TEMPLATE_IDS)[number], data: ResumeData) {
  return normalizeStyles(
    renderToStaticMarkup(<TemplateRenderer template={template} data={data} />)
  );
}

describe('resume templates', () => {
  for (const id of TEMPLATE_IDS) {
    test(`${id} renders its sample résumé`, () => {
      expect(render(id, TEMPLATE_SAMPLE_DATA[id])).toMatchSnapshot();
    });

    test(`${id} renders a sparse non-ASCII résumé`, () => {
      expect(render(id, SPARSE)).toMatchSnapshot();
    });
  }
});

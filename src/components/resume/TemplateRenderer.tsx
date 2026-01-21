import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import { TemplateType } from './templateLibrary';
import { ResumeData } from '@/types/resume.unified';

interface TemplateRendererProps {
  template: TemplateType;
  data: ResumeData;
  isMobile?: boolean;
}

export default function TemplateRenderer({
  template,
  data,
  isMobile = false,
}: TemplateRendererProps) {
  switch (template) {
    case 'executive':
      return <ExecutiveTemplate data={data} />;
    case 'tech':
      return <TechTemplate data={data} isMobile={isMobile} />;
    case 'corporate':
      return <CorporateTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'academic':
      return <AcademicTemplate data={data} />;
    default:
      return <TechTemplate data={data} isMobile={isMobile} />;
  }
}

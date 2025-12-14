import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import { TemplateType } from './TemplateSelector';
import { ResumeData } from '@/types/resume.unified';

interface TemplateRendererProps {
  template: TemplateType;
  data: ResumeData;
}

export default function TemplateRenderer({
  template,
  data,
}: TemplateRendererProps) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} />;
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
}

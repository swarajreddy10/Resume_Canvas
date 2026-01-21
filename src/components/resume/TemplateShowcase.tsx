'use client';

'use client';

import { ResumeData } from '@/types/resume.unified';
import { useLayoutEffect, useRef, useState } from 'react';
import TemplateRenderer from './TemplateRenderer';
import { TemplateType } from './templateLibrary';

type TemplateShowcaseMode = 'landing' | 'selector' | 'builder' | 'preview';

interface TemplateShowcaseProps {
  template: TemplateType;
  data: ResumeData;
  mode?: TemplateShowcaseMode;
  className?: string;
  frameClassName?: string;
  maxHeight?: string | number;
  showFade?: boolean;
  maxPreviewWidth?: number;
}

const A4_SIZE = {
  width: 794, // px (210mm at 96dpi)
  height: 1123, // px (297mm at 96dpi)
};

const MODE_TO_FRAME_CLASS: Record<TemplateShowcaseMode, string> = {
  landing:
    'relative rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_55px_rgba(15,23,42,0.12)] overflow-hidden',
  selector:
    'relative rounded-[28px] border border-slate-200 bg-white shadow-lg overflow-hidden',
  builder:
    'relative rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden',
  preview:
    'relative border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.18)] overflow-hidden',
};

export default function TemplateShowcase({
  template,
  data,
  mode = 'landing',
  className = '',
  frameClassName,
  maxHeight,
  showFade = true,
  maxPreviewWidth = 360,
}: TemplateShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.42);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const availableWidth = Math.min(container.clientWidth, maxPreviewWidth);
      const availableHeight = container.clientHeight || Infinity;
      const widthRatio = availableWidth / A4_SIZE.width;
      const heightRatio = availableHeight / A4_SIZE.height;
      // Increase scale limits for better readability, especially in preview mode
      const minScale =
        mode === 'preview'
          ? availableWidth < 640
            ? 0.3
            : 0.6
          : mode === 'selector'
            ? 0.32
            : 0.25;
      const maxScale =
        mode === 'preview'
          ? availableWidth < 640
            ? 0.6
            : 1.1
          : mode === 'selector'
            ? 0.5
            : 1;
      const computedScale = Math.min(
        maxScale,
        Math.max(minScale, Math.min(widthRatio, heightRatio))
      );
      setScale(computedScale);
      setIsMobile(availableWidth < 640);
    };

    measure();
    if (!containerRef.current) return undefined;

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        measure();
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }

    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxPreviewWidth, mode]);

  const frameClass = frameClassName ?? MODE_TO_FRAME_CLASS[mode];
  const paddingClasses = frameClassName
    ? ''
    : mode === 'preview' || mode === 'selector'
      ? ''
      : 'px-4 py-6 sm:px-6 sm:py-8';
  const finalMaxHeight =
    maxHeight ?? (mode === 'preview' || mode === 'builder' ? 'none' : '420px');
  const shouldShowFade = showFade && finalMaxHeight !== 'none';

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div
        className={`${frameClass} ${paddingClasses}`}
        style={{
          aspectRatio: mode === 'preview' ? 'auto' : '210 / 297',
          maxHeight: finalMaxHeight,
          minHeight: mode === 'preview' ? 'auto' : '280px',
          height:
            mode === 'preview'
              ? `${A4_SIZE.height * scale + (isMobile ? 100 : 40)}px`
              : 'auto',
        }}
      >
        <div
          className={`relative w-full h-full flex justify-center ${mode === 'preview' ? 'items-start' : 'items-center'}`}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              width: `${A4_SIZE.width}px`,
              height: `${A4_SIZE.height}px`,
              left: '50%',
              top: mode === 'preview' ? (isMobile ? '-30%' : '0%') : '50%',
              transform:
                mode === 'preview'
                  ? `translate(-50%, 0%) scale(${scale})`
                  : `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <TemplateRenderer
              template={template}
              data={data}
              isMobile={isMobile}
            />
          </div>
        </div>
        {shouldShowFade && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 via-white/20 mix-blend-lighten" />
        )}
      </div>
    </div>
  );
}

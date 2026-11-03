'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// The carousel renders five resume templates with sample data and Motion, none of which the
// first screen shows. It is a separate chunk, requested only when the section comes within
// 600px of the viewport. `next/dynamic` code-splits only when called from a Client
// Component, which is why this wrapper exists.
const TemplateCarousel = dynamic(
  () => import('@/components/resume/TemplateCarousel'),
  { ssr: false, loading: () => null }
);

// Height of the carousel once rendered (tabs, A4 stage, caption, dots), reserved so the
// sections below do not jump when it mounts.
const RESERVED_HEIGHT = 'min-h-[760px] sm:min-h-[700px]';

export function LazyTemplateCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={RESERVED_HEIGHT}>
      {near && <TemplateCarousel />}
    </div>
  );
}

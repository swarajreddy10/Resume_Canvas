'use client';

import { Pause } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { setHeroMotionPaused, useHeroMotionPaused } from './heroMotion';

/**
 * Pause control for the hero's auto-playing motion (the cycling word and the floating
 * badges), as WCAG 2.2 SC 2.2.2 requires for motion that lasts more than five seconds.
 * Hidden when the user already asked for reduced motion, since nothing moves then.
 */
export function HeroMotionToggle() {
  const paused = useHeroMotionPaused();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // The floating badges are server-rendered CSS animations; the section attribute pauses them.
    ref.current
      ?.closest('section')
      ?.toggleAttribute('data-motion-paused', paused);
  }, [paused]);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={paused}
      onClick={() => setHeroMotionPaused(!paused)}
      className="motion-reduce:hidden self-start inline-flex items-center gap-1.5 min-h-6 rounded-md px-1 -mx-1 text-xs font-medium text-rc-muted hover:text-[#11101d] aria-pressed:text-[#4f46e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5]"
    >
      <Pause aria-hidden="true" className="h-3.5 w-3.5" />
      Pause animations
    </button>
  );
}

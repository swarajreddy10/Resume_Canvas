'use client';

import { useEffect, useState } from 'react';
import { useHeroMotionPaused, usePrefersReducedMotion } from './heroMotion';

const INTERVAL_MS = 2800;

/**
 * The rotating word in the hero headline. The server renders the first word, visible; the
 * rotation starts after hydration, never under prefers-reduced-motion, and stops while the
 * hero's pause control is pressed.
 */
export function CyclingWord({ words }: { words: readonly string[] }) {
  const paused = useHeroMotionPaused();
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(() => setStep((s) => s + 1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  return (
    <span
      key={step}
      className={`text-canvas-gradient relative inline-block ${
        // The first word is part of the first paint, so it never starts transparent.
        step > 0 ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''
      }`}
    >
      {words[step % words.length]}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-full"
      />
    </span>
  );
}

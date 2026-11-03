import { useSyncExternalStore } from 'react';

// Shared "pause animations" state for the landing hero's two client islands (the cycling
// headline word and its pause control), so neither has to wrap the server-rendered hero.
let paused = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setHeroMotionPaused(value: boolean) {
  paused = value;
  listeners.forEach((listener) => listener());
}

export function useHeroMotionPaused() {
  return useSyncExternalStore(
    subscribe,
    () => paused,
    () => false
  );
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(listener: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

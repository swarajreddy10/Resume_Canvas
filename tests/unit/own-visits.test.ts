import { afterEach, describe, expect, test } from 'bun:test';
import { OWN_VISITS_KEY, skipOwnVisits } from '@/lib/analytics/ownVisits';

const event = { type: 'pageview', url: 'https://resumecanvas.vercel.app/' };
const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function useStorage(getItem: (key: string) => string | null) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: { getItem },
    configurable: true,
  });
}

afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'localStorage', original);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe('skipOwnVisits', () => {
  test('drops the event in a browser the owner has marked', () => {
    useStorage((key) => (key === OWN_VISITS_KEY ? '1' : null));
    expect(skipOwnVisits(event)).toBeNull();
  });

  test('sends the event from any other browser', () => {
    useStorage(() => null);
    expect(skipOwnVisits(event)).toBe(event);
  });

  test('sends the event when storage is blocked', () => {
    useStorage(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(skipOwnVisits(event)).toBe(event);
  });

  test('sends the event when there is no storage at all', () => {
    delete (globalThis as { localStorage?: unknown }).localStorage;
    expect(skipOwnVisits(event)).toBe(event);
  });
});

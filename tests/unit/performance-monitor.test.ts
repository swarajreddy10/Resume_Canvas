/**
 * PerformanceMonitor with a stubbed performance.now(), so durations are exact and no
 * test spins the CPU waiting for a wall-clock interval.
 */
import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import type { Mock } from 'bun:test';
import { performanceMonitor } from '@/lib/performance/monitor';

let now: Mock<() => number>;
let t: number;

function timed(endpoint: string, ms: number, status = 200, method = 'GET') {
  const timer = performanceMonitor.startTimer(endpoint, method);
  t += ms;
  return timer.end(status);
}

beforeEach(() => {
  t = 1_000;
  now = spyOn(performance, 'now').mockImplementation(() => t);
  performanceMonitor.clear();
});

afterEach(() => {
  now.mockRestore();
  performanceMonitor.clear();
});

describe('PerformanceMonitor', () => {
  test('records the measured duration with endpoint, method and status', () => {
    expect(timed('/api/resumes', 42.5, 201, 'POST')).toBe(42.5);

    expect(performanceMonitor.getMetrics()).toEqual([
      expect.objectContaining({
        endpoint: '/api/resumes',
        method: 'POST',
        duration: 42.5,
        status: 201,
      }),
    ]);
  });

  test('reports only requests slower than the threshold', () => {
    timed('/fast', 5);
    timed('/edge', 100);
    timed('/slow', 150);

    expect(
      performanceMonitor.getSlowRequests(100).map((m) => m.endpoint)
    ).toEqual(['/slow']);
  });

  test('averages response times overall and per endpoint', () => {
    timed('/a', 10);
    timed('/a', 30);
    timed('/b', 80);

    expect(performanceMonitor.getAverageResponseTime('/a')).toBe(20);
    expect(performanceMonitor.getAverageResponseTime()).toBe(40);
    expect(performanceMonitor.getAverageResponseTime('/none')).toBe(0);
  });

  test('keeps only the 100 most recent metrics', () => {
    for (let i = 0; i < 101; i++) timed(`/r${i}`, 1);

    const metrics = performanceMonitor.getMetrics();
    expect(metrics).toHaveLength(100);
    expect(metrics[0].endpoint).toBe('/r1');
    expect(metrics[99].endpoint).toBe('/r100');
  });

  test('getMetrics returns a copy', () => {
    timed('/a', 1);
    performanceMonitor.getMetrics().pop();

    expect(performanceMonitor.getMetrics()).toHaveLength(1);
  });
});

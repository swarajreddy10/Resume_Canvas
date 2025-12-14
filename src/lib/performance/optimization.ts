export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): () => void {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const duration = end - start;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);

      const measurements = this.metrics.get(label)!;
      if (measurements.length > 100) {
        measurements.shift();
      }
    };
  }

  getAverageTime(label: string): number {
    const measurements = this.metrics.get(label);
    if (!measurements || measurements.length === 0) return 0;

    return (
      measurements.reduce((sum, time) => sum + time, 0) / measurements.length
    );
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Auto-save with debouncing
export const debouncedAutoSave = debounce((...args: unknown[]) => {
  const saveFunction = args[0] as () => void;
  if (typeof saveFunction === 'function') {
    saveFunction();
  }
}, 2000);

// Performance tracking
export function trackPageLoad(pageName: string) {
  if (typeof window !== 'undefined') {
    const loadTime = performance.now();
    console.log(`${pageName} loaded in ${loadTime}ms`);
  }
}

// Memory usage monitoring
export function logMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (
      performance as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    });
  }
}

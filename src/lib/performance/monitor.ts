/**
 * Performance Monitoring Utility
 * Tracks API response times and performance metrics
 */

interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: number;
  status: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  startTimer(endpoint: string, method: string) {
    const startTime = performance.now();

    return {
      end: (status: number) => {
        const duration = performance.now() - startTime;
        this.addMetric({
          endpoint,
          method,
          duration,
          timestamp: Date.now(),
          status,
        });

        // Log slow requests
        if (duration > 100) {
          console.warn(
            `Slow API request: ${method} ${endpoint} took ${duration.toFixed(2)}ms`
          );
        }

        return duration;
      },
    };
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getAverageResponseTime(endpoint?: string): number {
    const filteredMetrics = endpoint
      ? this.metrics.filter((m) => m.endpoint === endpoint)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const total = filteredMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / filteredMetrics.length;
  }

  getSlowRequests(threshold = 100): PerformanceMetric[] {
    return this.metrics.filter((m) => m.duration > threshold);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Enhanced fetch wrapper with performance monitoring
export async function monitoredFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const timer = performanceMonitor.startTimer(url, options.method || 'GET');

  try {
    const response = await fetch(url, options);
    timer.end(response.status);
    return response;
  } catch (error) {
    timer.end(0);
    throw error;
  }
}

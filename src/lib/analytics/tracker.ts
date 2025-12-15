/**
 * Analytics Tracking Utility
 * Centralized event tracking
 */

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

interface AnalyticsEvent {
  name: string;
  properties?: AnalyticsProperties;
  timestamp?: number;
}

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    eventName: string,
    params?: AnalyticsProperties
  ) => void;
}

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private enabled = typeof window !== 'undefined';

  track(name: string, properties?: AnalyticsProperties) {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.queue.push(event);

    const win = window as WindowWithGtag;
    if (typeof window !== 'undefined' && win.gtag) {
      win.gtag('event', name, properties);
    }

    console.log('[Analytics]', name, properties);
  }

  page(path: string, properties?: AnalyticsProperties) {
    this.track('page_view', { path, ...properties });
  }

  identify(userId: string, traits?: AnalyticsProperties) {
    this.track('identify', { userId, ...traits });
  }
}

export const analytics = new AnalyticsTracker();

export const trackResumeCreated = (resumeId: string) =>
  analytics.track('resume_created', { resumeId });

export const trackResumeDownloaded = (resumeId: string) =>
  analytics.track('resume_downloaded', { resumeId });

export const trackAIGeneration = (feature: string) =>
  analytics.track('ai_generation', { feature });

export const trackApplicationCreated = (applicationId: string) =>
  analytics.track('application_created', { applicationId });

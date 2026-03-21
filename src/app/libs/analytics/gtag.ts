import { EventType } from './events';

export const GA_ID = 'G-PYHS0CDP9Z';

// page view
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }
};

// events
export const event = (action: EventType, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

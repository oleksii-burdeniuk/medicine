import { EventType } from './events';

export const GA_ID = 'G-PYHS0CDP9Z';

// page view
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('config', GA_ID, {
        page_path: url,
      });
    } catch (error) {
      console.error('Error sending pageview to Google Analytics:', error);
    }
  }
};

// events
export const event = (action: EventType, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', action, params);
    } catch (error) {
      console.error('Error sending event to Google Analytics:', error);
    }
  }
};

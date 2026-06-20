export const CONSENT_COOKIE = 'warecode_cookie_consent';
export const CONSENT_EVENT = 'warecode:consent-changed';
export const OPEN_CONSENT_EVENT = 'warecode:open-consent';

export type ConsentChoice = 'essential' | 'analytics';

export function readConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === 'essential' || value === 'analytics' ? value : null;
}

export function saveConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export function removeGoogleAnalyticsCookies() {
  document.cookie.split(';').forEach((part) => {
    const name = part.split('=')[0]?.trim();
    if (!name || (name !== '_ga' && !name.startsWith('_ga_'))) return;
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  });
}

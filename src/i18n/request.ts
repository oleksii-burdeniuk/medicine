// src/app/[locale]/next-intl.config.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const SUPPORTED_LOCALES = ['pl', 'uk', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function resolveLocale(locale: string | undefined): SupportedLocale {
  if (locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }
  return 'pl';
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveLocale(store.get('locale')?.value);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

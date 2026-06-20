import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import FloatingHomeButton from './components/FloatingHomeButton';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import PwaInstallBtn from './components/PwaInstallBtn/PwaInstallBtn';
import TestFlightInvite from './components/TestFlightInvite';
import CookieConsent from './components/CookieConsent';
import ConsentAnalytics from './components/Analytics/ConsentAnalytics';

export const metadata = {
  title: 'WareCode',
  description: 'WareCode — PWA сканер та генератор штрихкодів',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-512x512.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const locale = store.get('locale')?.value || 'pl';
  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <meta
          name='google-site-verification'
          content='kC9hDHTgvtKlxmFsywp4i7UaWyj2wGfK8TRG9Rs-eZ8'
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <Header />
          <PwaInstallBtn />
          <TestFlightInvite />
          {children}

          <FloatingHomeButton />
          <Footer />
          <ServiceWorkerRegister />
          <CookieConsent />
          <ConsentAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

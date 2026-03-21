import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import FloatingHomeButton from './components/FloatingHomeButton';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import Script from 'next/script';
import Analytics from './components/Analytics/Analytics';

export const metadata = {
  title: 'Barcode Scanner',
  description: 'PWA штрихкод сканер та генератор',
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
      <body>
        <NextIntlClientProvider>
          <Header />
          {children}

          <SpeedInsights />

          <FloatingHomeButton />
          <Footer />
          <ServiceWorkerRegister />
        </NextIntlClientProvider>

        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-PYHS0CDP9Z'
          strategy='afterInteractive'
        />
        <Script id='ga-script' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PYHS0CDP9Z', {
  send_page_view: false,
});
            
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}

import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import { Analytics } from '@vercel/analytics/next';
import FloatingHomeButton from './components/FloatingHomeButton';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';

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
          <Analytics />
          <FloatingHomeButton />
          <Footer />
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

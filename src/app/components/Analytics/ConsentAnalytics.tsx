'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Analytics from './Analytics';
import {
  CONSENT_EVENT,
  readConsent,
} from '../privacy/consent';

const GA_ID = 'G-PYHS0CDP9Z';

export default function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false);
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    const syncConsent = () => setEnabled(readConsent() === 'analytics');
    syncConsent();
    window.addEventListener(CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(CONSENT_EVENT, syncConsent);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy='afterInteractive'
        onLoad={() => setGaReady(true)}
        onReady={() => setGaReady(true)}
      />
      <Script id='ga-script' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
      </Script>
      {gaReady && <Analytics />}
      <SpeedInsights />
    </>
  );
}

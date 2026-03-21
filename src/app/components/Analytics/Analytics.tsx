'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '@/app/libs/analytics/gtag';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}

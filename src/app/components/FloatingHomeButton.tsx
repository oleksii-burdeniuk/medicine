'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './FloatingHomeButton.module.css';
import { ScanBarcode } from 'lucide-react';

export default function FloatingHomeButton() {
  const pathname = usePathname();
  const router = useRouter();

  const [hidden, setHidden] = useState(true);

  // Hide on "/" (home)
  const shouldHideCompletely = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToTop = window.scrollY < 30;
      setHidden(scrolledToTop);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (shouldHideCompletely) return null;

  return (
    <button
      className={`${styles.floatingBtn} ${
        hidden ? styles.hidden : styles.visible
      }`}
      onClick={() => router.push('/')}
      aria-label='Powrót do generatora'
    >
      <ScanBarcode size={22} />
    </button>
  );
}

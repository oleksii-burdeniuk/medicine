'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './FloatingHomeButton.module.css';
import { ScanBarcode } from 'lucide-react';

export default function FloatingHomeButton() {
  const pathname = usePathname();
  const router = useRouter();

  const shouldHideCompletely = pathname === '/';

  if (shouldHideCompletely) return null;

  return (
    <button
      className={`${styles.floatingBtn} ${styles.visible}`}
      onClick={() => router.push('/')}
      aria-label='Powrót do generatora'
    >
      <ScanBarcode size={22} />
    </button>
  );
}

'use client';

import styles from './LocaleSwitcher.module.css';
import { useEffect, useState } from 'react';

export default function LocaleSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<string>('pl');

  useEffect(() => {
    // Беремо поточну мову з cookie
    const match = document.cookie.match(/locale=([^;]+)/);
    if (match) setCurrentLocale(match[1]);
  }, []);

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    setCurrentLocale(newLocale);
    window.location.reload(); // або можна зробити router.push для SPA переходу
  };

  return (
    <div className={styles.container}>
      {['pl', 'uk', 'en'].map((locale) => (
        <button
          key={locale}
          className={`${styles.button} ${
            currentLocale === locale ? styles.active : ''
          }`}
          onClick={() => switchLocale(locale)}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { openSmartLunch } from './SmartLunchButton';
import { event } from '../libs/analytics/gtag';
import { EVENTS } from '../libs/analytics/events';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dayText = String(now.getDate());
  const monthText = useMemo(
    () =>
      now
        .toLocaleString(undefined, { month: 'short' })
        .replace('.', '')
        .toUpperCase(),
    [now]
  );

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    event(EVENTS.MENU_OPEN);
  };
  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) => pathname === href;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/' onClick={closeMenu}>
          <span className={styles.logoText}>{t('logo')}</span>
        </Link>
      </div>

      <Link href='/hours' onClick={closeMenu} className={styles.calendarLink}>
        <span className={styles.calendarDateBadge} aria-hidden='true'>
          <span className={styles.calendarMonth}>{monthText}</span>
          <span className={styles.calendarDay}>{dayText}</span>
        </span>
        <span>{t('hours')}</span>
      </Link>

      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label={t('menu')}
      >
        <span className={styles.menu}>{t('menu')}</span>
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link
              href='/'
              onClick={closeMenu}
              className={isActive('/') ? styles.active : ''}
            >
              {t('barcode')}
            </Link>
          </li>
          <li>
            <Link
              href='/colors'
              onClick={closeMenu}
              className={isActive('/colors') ? styles.active : ''}
            >
              {t('colors')}
            </Link>
          </li>
          <li>
            <Link
              href='/work-break-time'
              onClick={closeMenu}
              className={isActive('/work-break-time') ? styles.active : ''}
            >
              {t('workBreak')}
            </Link>
          </li>
          <li>
            <Link
              href='/share'
              onClick={closeMenu}
              className={isActive('/share') ? styles.active : ''}
            >
              {t('share')}
            </Link>
          </li>
          <li>
            <Link
              href='/contact'
              onClick={closeMenu}
              className={isActive('/contact') ? styles.active : ''}
            >
              {t('contact')}
            </Link>
          </li>
          <li>
            <Link
              href='/hours'
              onClick={closeMenu}
              className={isActive('/hours') ? styles.active : ''}
            >
              {t('hours')}
            </Link>
          </li>
          <li>
            <button onClick={openSmartLunch} className={styles.smartLunchBtn}>
              🍽 SmartLunch
            </button>
          </li>
        </ul>

        <LocaleSwitcher />

        <ul>
          <li>
            <Link
              href='/about'
              onClick={closeMenu}
              className={isActive('/about') ? styles.active : ''}
            >
              {t('about')}
            </Link>
          </li>
          <li>
            <Link
              href='/PWA'
              onClick={closeMenu}
              className={isActive('/PWA') ? styles.active : ''}
            >
              {t('pwa')}
            </Link>
          </li>
          <li style={{ textAlign: 'center', lineHeight: '1.5' }}>
            <Link
              href='https://chat.whatsapp.com/GbCHo13Y57x1eySed9Au01'
              target='_blank'
              rel='noopener noreferrer'
              onClick={closeMenu}
            >
              {t('publicGroup')}
            </Link>
          </li>
        </ul>
      </nav>

      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </header>
  );
}

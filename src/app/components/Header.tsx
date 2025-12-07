'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Header');

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) => pathname === href;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/' onClick={closeMenu}>
          <span className={styles.logoText}>{t('logo')}</span>
        </Link>
      </div>

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
              href='/pwa'
              onClick={closeMenu}
              className={isActive('/pwa') ? styles.active : ''}
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

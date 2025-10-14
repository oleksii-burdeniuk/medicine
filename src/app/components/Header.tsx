'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // 🟢 Sprawdź, czy link jest aktywny
  const isActive = (href: string) => pathname === `/${href}`;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={`/`} onClick={closeMenu}>
          <span className={styles.logoText}>Medicine</span>
        </Link>
      </div>

      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label='Menu'
      >
        <Menu size={24} />
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link
              href={`/`}
              onClick={closeMenu}
              className={isActive('/') ? styles.active : ''}
            >
              Kod kreskowy
            </Link>
          </li>
          <li>
            <Link
              href={`/work-break-time`}
              onClick={closeMenu}
              className={isActive('/work-break-time') ? styles.active : ''}
            >
              Praca i przerwy
            </Link>
          </li>
          <li>
            <Link
              href={`/about`}
              onClick={closeMenu}
              className={isActive('/about') ? styles.active : ''}
            >
              O aplikacji
            </Link>
          </li>
        </ul>
      </nav>

      {/* 🟣 Overlay zamyka menu tylko po kliknięciu poza menu */}
      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </header>
  );
}

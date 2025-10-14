'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/' onClick={closeMenu}>
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
            <Link href='./' onClick={closeMenu}>
              Штрих-код
            </Link>
          </li>
          <li>
            <Link href='/work-break-time' onClick={closeMenu}>
              Робота і перерва
            </Link>
          </li>
          <li>
            <Link href='/about' onClick={closeMenu}>
              Про цей додаток
            </Link>
          </li>
        </ul>
      </nav>

      {/* Overlay for mobile when menu open */}
      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </header>
  );
}

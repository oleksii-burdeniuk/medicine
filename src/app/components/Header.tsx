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
  console.log('pathname', pathname);
  // 🟢 Перевіряємо, чи шлях збігається
  const isActive = (href: string) => pathname === href;

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
        <span className={styles.menu}>Menu</span>
        {/* <Menu size={24} /> */}
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link
              href='/'
              onClick={closeMenu}
              className={isActive('/') ? styles.active : ''}
            >
              Kod kreskowy
            </Link>
          </li>
          <li>
            <Link
              href='/colors'
              onClick={closeMenu}
              className={isActive('/colors') ? styles.active : ''}
            >
              Kolory i Asortyment
            </Link>
          </li>
          <li>
            <Link
              href='/work-break-time'
              onClick={closeMenu}
              className={isActive('/work-break-time') ? styles.active : ''}
            >
              Praca i przerwy
            </Link>
          </li>
          <li>
            <Link
              href='/share'
              onClick={closeMenu}
              className={isActive('/share') ? styles.active : ''}
            >
              Udostępnij aplikację
            </Link>
          </li>

          {/* <li>
            <Link
              href='/push-notifications'
              onClick={closeMenu}
              className={isActive('/push-notifications') ? styles.active : ''}
            >
              Powiadomienia push
            </Link>
          </li> */}
        </ul>
        <ul>
          <li>
            <Link
              href='/about'
              onClick={closeMenu}
              className={isActive('/about') ? styles.active : ''}
            >
              O aplikacji
            </Link>
          </li>

          <li>
            <Link
              href='/PWA'
              onClick={closeMenu}
              className={isActive('/PWA') ? styles.active : ''}
            >
              Czym jest PWA?
            </Link>
          </li>
          <li style={{ textAlign: 'center', lineHeight: '1.5' }}>
            <Link
              href='https://chat.whatsapp.com/GbCHo13Y57x1eySed9Au01'
              target='_blank'
              rel='noopener noreferrer'
              onClick={closeMenu}
            >
              Grupa publiczna
            </Link>
          </li>
        </ul>
      </nav>

      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </header>
  );
}

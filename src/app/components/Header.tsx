'use client';

import { useState } from 'react';
import Link from 'next/link';
// 👈 ІМПОРТУЄМО usePathname
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // 👈 ОТРИМУЄМО ПОТОЧНИЙ ШЛЯХ
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // 1. Функція для перевірки активності
  const isActive = (href) => {
    // Особливий випадок для головної сторінки (/)
    if (href === '/') {
      // Домашня сторінка активна, якщо pathname === '/'
      // або якщо pathname === '/index.html' (для деяких PWA конфігурацій)
      return (
        pathname === '/' || pathname === '/index.html' || pathname === '/index'
      );
    }
    // Для всіх інших сторінок просто перевіряємо, чи шлях починається з href
    return pathname.startsWith(href);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* Використовуємо '/' для логотипу */}
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
            <Link
              href='/' // Змінив './' на '/' для Next.js
              onClick={closeMenu}
              // 2. Додаємо клас, якщо isActive
              className={isActive('/') ? styles.active : ''}
            >
              Штрих-код
            </Link>
          </li>
          <li>
            <Link
              href='/work-break-time'
              onClick={closeMenu}
              // 2. Додаємо клас, якщо isActive
              className={isActive('/work-break-time') ? styles.active : ''}
            >
              Робота і перерва
            </Link>
          </li>
          <li>
            <Link
              href='/about'
              onClick={closeMenu}
              // 2. Додаємо клас, якщо isActive
              className={isActive('/about') ? styles.active : ''}
            >
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

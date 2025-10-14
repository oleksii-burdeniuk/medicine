'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Зроблено з ❤️ для складу <strong>Medicine</strong>. Цей додаток створено
        повністю безкоштовно, щоб полегшити вашу роботу 🙌
      </p>

      <p className={styles.links}>
        <Link
          href='https://www.linkedin.com/in/oleksii-burdeniuk-9b1b6a22b/'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
        >
          Мій LinkedIn
        </Link>
        {' | '}
        <Link
          href='https://github.com/oleksii-burdeniuk'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
        >
          GitHub
        </Link>
      </p>

      <p className={styles.copy}>
        © {new Date().getFullYear()} Oleksii Burdeniuk
      </p>
    </footer>
  );
}

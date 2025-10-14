'use client';

import styles from './workBreakTime.module.css';

export default function WorkBreakTimePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🕒 Grafik pracy i przerwy</h1>

        <p className={styles.text}>
          Na magazynie pracują <strong>2 zmiany</strong>. Poniżej znajdziesz
          harmonogram pracy oraz godziny przerw, aby każdy mógł odpocząć i napić
          się kawy ☕️
        </p>

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>👷‍♀️ Pierwsza zmiana</h2>
          <p className={styles.schedule}>
            <strong>Godziny pracy:</strong> 06:00 — 14:00
          </p>
          <ul className={styles.list}>
            <li>☕ Przerwa 1: 08:20 — 08:35</li>
            <li>🍴 Przerwa 2: 11:20 — 11:40</li>
          </ul>
        </div>

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>👷‍♂️ Druga zmiana</h2>
          <p className={styles.schedule}>
            <strong>Godziny pracy:</strong> 14:00 — 22:00
          </p>
          <ul className={styles.list}>
            <li>☕ Przerwa 1: 14:20 — 14:35</li>
            <li>🍴 Przerwa 2: 17:20 — 17:40</li>
          </ul>
        </div>

        <p className={styles.footer}>
          Przestrzegaj czasu przerw 🕰️, aby magazyn działał sprawnie, a Ty nie
          był zmęczony 💪
        </p>
      </div>
    </div>
  );
}

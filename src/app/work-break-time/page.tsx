'use client';

import styles from './workBreakTime.module.css';

export default function WorkBreakTimePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🕒 Робочий графік та перерви</h1>

        <p className={styles.text}>
          На складі працює <strong>2 зміни</strong>. Нижче вказано розклад
          роботи та часи для перерв, щоб усі могли відпочити і підзарядитись ☕️
        </p>

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>👷‍♀️ Перша зміна</h2>
          <p className={styles.schedule}>
            <strong>Час роботи:</strong> 06:00 — 14:00
          </p>
          <ul className={styles.list}>
            <li>☕ Перерва 1: 08:20 — 08:35</li>
            <li>🍴 Перерва 2: 11:20 — 11:40</li>
          </ul>
        </div>

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>👷‍♂️ Друга зміна</h2>
          <p className={styles.schedule}>
            <strong>Час роботи:</strong> 12:00 — 20:00
          </p>
          <ul className={styles.list}>
            <li>☕ Перерва 1: 14:20 — 14:35</li>
            <li>🍴 Перерва 2: 17:20 — 17:40</li>
          </ul>
        </div>

        <p className={styles.footer}>
          Дотримуйся часу перерв 🕰️, щоб склад працював злагоджено, а ти — не
          втомлювався 💪
        </p>
      </div>
    </div>
  );
}

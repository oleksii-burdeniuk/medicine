'use client';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📦 Medicine Штрих-код</h1>

        <p className={styles.text}>
          <strong>Medicine</strong> — це зручний застосунок для генерації
          штрих-кодів. Він допомагає&ldquo;
          <strong>швидко створювати, зчитувати та зберігати штрихкоди</strong>
          для ефективної роботи.
        </p>

        <h2 className={styles.subtitle}>⚙️ Основні можливості:</h2>
        <ul className={styles.list}>
          <li>
            🧾 <strong>Генерація штрихкоду</strong> — введи будь-який текст або
            артикул, і застосунок автоматично створить&ldquo;
            <strong>штрихкод (CODE128)</strong>.
          </li>
          <li>
            📷 <strong>Сканування коду з фото</strong> — зроби фото сканера або
            коробки з кодом, і система&ldquo;
            <strong>автоматично розпізнає потрібний номер.</strong> фото має
            мітити номер по типу &ldquo;PK/25/04/23/0813&ldquo;
          </li>
          <li>
            💾 <strong>Збереження результатів</strong> — усі згенеровані або
            зчитані коди можна зберігати локально для швидкого доступу пізніше.
          </li>
          <li>
            🕒 <strong>Розклад перерв</strong> — в навігації ти знайдеш розклад
            роботи і перерв, щоб не забути відпочити під час зміни 😄
          </li>
        </ul>

        <h2 className={styles.subtitle}>📱 Як користуватись:</h2>
        <ol className={styles.steps}>
          <li>Перейди на головну сторінку застосунку.</li>
          <li>
            Введи артикул або натисни 📷, щоб завантажити фото де видно код
            штрих-коду по типу &ldquo;PK/25/04/23/0813&ldquo;.
          </li>
          <li>
            Зачекай, поки система зчитає код — він зʼявиться у полі вводу.
          </li>
          <li>Збережи результат, щоб мати його під рукою пізніше.</li>
        </ol>

        <p className={styles.footer}>
          Застосунок працює навіть <strong>офлайн</strong> і підтримує{' '}
          <strong>PWA</strong> — ти можеш додати його на головний екран телефону
          та користуватися як звичайним додатком.
        </p>
      </div>
    </div>
  );
}

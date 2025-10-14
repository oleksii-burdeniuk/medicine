'use client';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📦 Medicine Kod kreskowy</h1>

        <p className={styles.text}>
          <strong>Medicine</strong> — to wygodna aplikacja do generowania kodów
          kreskowych. Pomaga{' '}
          <strong>szybko tworzyć, skanować i zapisywać kody kreskowe</strong>{' '}
          dla efektywnej pracy na magazynie.
        </p>

        <h2 className={styles.subtitle}>⚙️ Główne funkcje:</h2>
        <ul className={styles.list}>
          <li>
            🧾 <strong>Generowanie kodu kreskowego</strong> — wpisz dowolny
            tekst lub numer artykułu, a aplikacja automatycznie utworzy{' '}
            <strong>kod kreskowy (CODE128)</strong>.
          </li>
          <li>
            📷 <strong>Skanowanie kodu ze zdjęcia</strong> — zrób zdjęcie
            skanera lub pudełka z kodem, a system{' '}
            <strong>automatycznie rozpozna potrzebny numer</strong>. Na zdjęciu
            powinien być widoczny numer w formacie „PK/25/04/23/0813”.
          </li>
          <li>
            💾 <strong>Zapisywanie wyników</strong> — wszystkie wygenerowane lub
            zeskanowane kody można zapisać lokalnie, aby mieć do nich szybki
            dostęp później.
          </li>
          <li>
            🕒 <strong>Harmonogram przerw</strong> — w menu nawigacyjnym
            znajdziesz grafik pracy i przerw, aby nie zapomnieć o odpoczynku 😄
          </li>
        </ul>

        <h2 className={styles.subtitle}>📱 Jak korzystać:</h2>
        <ol className={styles.steps}>
          <li>Przejdź na stronę główną aplikacji.</li>
          <li>
            Wpisz numer artykułu lub naciśnij 📷, aby przesłać zdjęcie z kodem
            kreskowym w formacie „PK/25/04/23/0813”.
          </li>
          <li>
            Poczekaj, aż system odczyta kod — pojawi się on w polu tekstowym.
          </li>
          <li>Zapisz wynik, aby mieć go zawsze pod ręką.</li>
        </ol>

        <p className={styles.footer}>
          Aplikacja działa również <strong>offline</strong> i obsługuje{' '}
          <strong>PWA</strong> — możesz dodać ją na ekran główny telefonu i
          korzystać jak ze zwykłej aplikacji.
        </p>
      </div>
    </div>
  );
}

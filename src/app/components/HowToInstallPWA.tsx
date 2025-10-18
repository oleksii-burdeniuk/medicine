'use client';

import React from 'react';
import styles from './HowToInstallPWA.module.css';
import { Smartphone, MonitorSmartphone, Download } from 'lucide-react';

export default function HowToInstallPWA() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Czym jest PWA?</h1>

        <p className={styles.text}>
          <strong>PWA (Progressive Web App)</strong> to aplikacja, którą możesz
          zainstalować bezpośrednio ze strony internetowej — bez potrzeby
          korzystania ze sklepu Google Play lub App Store. 🌍
        </p>

        <p className={styles.text}>
          Działa jak zwykła aplikacja: ma własną ikonę, działa offline i
          uruchamia się szybciej niż strona w przeglądarce.
        </p>

        <h2 className={styles.subtitle}>
          <Smartphone size={22} /> Jak zainstalować na Androidzie 📱
        </h2>
        <ol className={styles.list}>
          <li>
            Otwórz aplikację w Chrome lub w innej przeglądarce (np. Edge).
          </li>
          <li>
            Kliknij <strong>⋮</strong> (trzy kropki w prawym górnym rogu).
          </li>
          <li>
            Wybierz <strong>„Dodaj do ekranu głównego”</strong>.
          </li>
          <li>Potwierdź instalację — aplikacja pojawi się na ekranie!</li>
        </ol>

        <h2 className={styles.subtitle}>
          <MonitorSmartphone size={22} /> Jak zainstalować na iPhonie 🍏
        </h2>
        <ol className={styles.list}>
          <li>
            Otwórz aplikację w Safari (to ważne — tylko Safari wspiera PWA).
          </li>
          <li>
            Kliknij ikonę <strong>Udostępnij</strong>{' '}
            <Download
              size={16}
              style={{ display: 'inline', verticalAlign: 'middle' }}
            />{' '}
            w dolnym pasku.
          </li>
          <li>
            Przewiń w dół i wybierz{' '}
            <strong>„Dodaj do ekranu początkowego”</strong>.
          </li>
          <li>
            Nadaj nazwę i kliknij <strong>Dodaj</strong>.
          </li>
        </ol>

        <div className={styles.tipBox}>
          💡 <strong>Wskazówka:</strong> Po zainstalowaniu możesz otwierać
          aplikację jak każdą inną — bez przeglądarki i internetu!
        </div>
      </div>
    </div>
  );
}

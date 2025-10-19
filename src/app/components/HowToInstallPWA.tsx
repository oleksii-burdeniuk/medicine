'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  MonitorSmartphone,
  Download,
  Tablet,
  CheckCircle,
} from 'lucide-react';
import styles from './HowToInstallPWA.module.css';

// 💡 Definicja typu dla zdarzenia instalacji (dla uniknięcia 'any')
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export default function HowToInstallPWA() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Sprawdzenie dla iOS (używamy do ukrycia/pokazania przycisku)
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
    setIsIOS(!!iOS);

    // 2. Obsługa zdarzenia beforeinstallprompt (dla Chromium/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      // Pokazujemy przycisk instalacji tylko, jeśli nie jest to iOS
      if (!iOS) {
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setShowInstallButton(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // 3. Funkcja wywoływana po kliknięciu przycisku "Zainstaluj"
  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    // Wywołujemy natywny prompt instalacji
    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA zaakceptowane przez użytkownika.');
    } else {
      console.log('PWA odrzucone przez użytkownika.');
    }

    // Ukrywamy przycisk po próbie instalacji
    setShowInstallButton(false);
    setInstallPrompt(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {showInstallButton && (
          <button onClick={handleInstallClick} className={styles.installButton}>
            <Tablet size={20} style={{ verticalAlign: 'middle' }} /> Zainstaluj
            Aplikację!
          </button>
        )}

        <h1 className={styles.title}>Czym jest PWA?</h1>

        <p className={styles.text}>
          <strong>PWA (Progressive Web App)</strong> to aplikacja, którą możesz
          zainstalować bezpośrednio ze strony internetowej — bez potrzeby
          korzystania ze sklepu Google Play lub App Store.
        </p>

        <div className={styles.tipBox}>
          <CheckCircle
            size={18}
            style={{ verticalAlign: 'middle', marginRight: '5px' }}
          />
          PWA działa jak zwykła aplikacja: ma własną ikonę, **uruchamia się
          offline** i jest szybsza niż strona w przeglądarce.
        </div>

        {/* Instrukcje dla Android */}
        <h2 className={styles.subtitle}>
          <Smartphone size={22} /> Jak zainstalować na Androidzie 📱
        </h2>

        <ol className={styles.list}>
          <li>
            Otwórz aplikację w Chrome lub innej przeglądarce opartej na Chromium
            (np. Edge).
          </li>
          <li>Kliknij **⋮** (trzy kropki w prawym górnym rogu).</li>
          <li>
            Wybierz **&quot;Dodaj do ekranu głównego&quot;** (lub
            &quot;Zainstaluj aplikację&quot;).
          </li>
          <li>Potwierdź instalację — aplikacja pojawi się na ekranie!</li>
        </ol>

        {/* Instrukcje dla iPhone */}
        <h2 className={styles.subtitle}>
          <MonitorSmartphone size={22} /> Jak zainstalować na iPhonie 🍏
        </h2>

        <ol className={styles.list}>
          <li>
            Otwórz aplikację w **Safari** (to ważne — tylko Safari wspiera PWA).
          </li>
          <li>
            Kliknij ikonę **Udostępnij**{' '}
            <Download
              size={16}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                transform: 'rotate(180deg)',
              }}
            />{' '}
            w dolnym pasku (kwadrat ze strzałką w górę).
          </li>
          <li>
            Przewiń w dół i wybierz{' '}
            <strong>&quot;Dodaj do ekranu początkowego&quot;</strong> (Add to
            Home Screen).
          </li>
          <li>Nadaj nazwę i kliknij **Dodaj**.</li>
        </ol>
      </div>
    </div>
  );
}

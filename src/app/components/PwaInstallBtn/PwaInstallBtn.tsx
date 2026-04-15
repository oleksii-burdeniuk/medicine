'use client';

import React, { useState, useEffect } from 'react';
import { Tablet } from 'lucide-react';
import styles from './PwaInstallBtn.module.css';
import { useTranslations } from 'next-intl';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export default function PwaInstallBtn() {
  const t = useTranslations('HowToInstallPWA');

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!iOS) {
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setShowInstallButton(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    setShowInstallButton(false);
    setInstallPrompt(null);
  };

  return (
    <>
      {showInstallButton && (
        <div className={styles.container}>
          <button onClick={handleInstallClick} className={styles.installButton}>
            <Tablet size={20} style={{ verticalAlign: 'middle' }} />{' '}
            {t('installButton')}
          </button>
        </div>
      )}
    </>
  );
}

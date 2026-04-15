'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  MonitorSmartphone,
  Tablet,
  CheckCircle,
} from 'lucide-react';
import styles from './HowToInstallPWA.module.css';
import { useTranslations } from 'next-intl';
import PwaInstallBtn from './PwaInstallBtn/PwaInstallBtn';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export default function HowToInstallPWA() {
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
    <div className={styles.container}>
      <div className={styles.card}>
        <PwaInstallBtn />

        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.text}>{t('description')}</p>

        <div className={styles.tipBox}>
          <CheckCircle
            size={18}
            style={{ verticalAlign: 'middle', marginRight: '5px' }}
          />
          {t('tip')}
        </div>

        <h2 className={styles.subtitle}>
          <Smartphone size={22} /> {t('androidTitle')}
        </h2>
        <ol className={styles.list}>
          <li>{t('androidStep1')}</li>
          <li>{t('androidStep2')}</li>
          <li>{t('androidStep3')}</li>
          <li>{t('androidStep4')}</li>
        </ol>

        <h2 className={styles.subtitle}>
          <MonitorSmartphone size={22} /> {t('iosTitle')}
        </h2>
        <ol className={styles.list}>
          <li>{t('iosStep1')}</li>
          <li>{t('iosStep2')}</li>
          <li>{t('iosStep3')}</li>
          <li>{t('iosStep4')}</li>
        </ol>
      </div>
    </div>
  );
}

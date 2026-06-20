'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Globe2, Share2, Smartphone, TabletSmartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './shareApp.module.css';

type ShareTargetId = 'web' | 'ios' | 'android';

const SHARE_TARGETS: Record<ShareTargetId, string | null> = {
  web: 'https://medicine-sand.vercel.app',
  ios: 'https://testflight.apple.com/join/eUXXnWWW',
  android: null,
};

export default function ShareAppPage() {
  const t = useTranslations('ShareAppPage');
  const [selectedTarget, setSelectedTarget] =
    useState<ShareTargetId>('web');
  const [qrUrl, setQrUrl] = useState('');
  const selectedUrl =
    SHARE_TARGETS[selectedTarget] ?? SHARE_TARGETS.web ?? '';

  useEffect(() => {
    QRCode.toDataURL(selectedUrl, {
      width: 244,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrUrl)
      .catch((error) => console.error('QR generation error:', error));
  }, [selectedUrl]);

  const selectTarget = (target: ShareTargetId) => {
    if (!SHARE_TARGETS[target]) {
      alert(
        target === 'ios' ? t('iosUnavailable') : t('androidUnavailable'),
      );
      return;
    }

    setSelectedTarget(target);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert(t('shareUnsupported'));
      return;
    }

    try {
      await navigator.share({
        title: t('shareTitle'),
        text: t('shareText'),
        url: selectedUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      alert(t('shareFailed'));
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.intro}>
          <div className={styles.wordmark} aria-label='WareCode'>
            <span>Ware</span>Code
          </div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
        </header>

        <section className={styles.versions} aria-labelledby='version-title'>
          <h2 id='version-title' className={styles.sectionTitle}>
            {t('chooseVersion')}
          </h2>

          <TargetButton
            active={selectedTarget === 'web'}
            available
            label={t('webVersion')}
            comingSoon={t('comingSoon')}
            onClick={() => selectTarget('web')}
            icon={<Globe2 size={20} strokeWidth={2.3} />}
          />
          <TargetButton
            active={selectedTarget === 'ios'}
            available={SHARE_TARGETS.ios !== null}
            label={t('iosVersion')}
            comingSoon={t('comingSoon')}
            onClick={() => selectTarget('ios')}
            icon={<TabletSmartphone size={20} strokeWidth={2.3} />}
          />
          <TargetButton
            active={selectedTarget === 'android'}
            available={SHARE_TARGETS.android !== null}
            label={t('androidVersion')}
            comingSoon={t('comingSoon')}
            onClick={() => selectTarget('android')}
            icon={<Smartphone size={20} strokeWidth={2.3} />}
          />
        </section>

        <div className={styles.qrCard} aria-live='polite'>
          {qrUrl ? (
            <Image
              src={qrUrl}
              alt={`QR code: ${selectedUrl}`}
              width={244}
              height={244}
              priority
              className={styles.qrImage}
            />
          ) : (
            <p className={styles.qrLoading}>{t('qrLoading')}</p>
          )}
        </div>

        <a
          className={styles.selectedUrl}
          href={selectedUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          {selectedUrl}
        </a>

        <button className={styles.shareButton} onClick={handleShare}>
          <Share2 size={20} strokeWidth={2.4} />
          <span>{t('shareButton')}</span>
        </button>
      </div>
    </main>
  );
}

function TargetButton({
  active,
  available,
  label,
  comingSoon,
  onClick,
  icon,
}: {
  active: boolean;
  available: boolean;
  label: string;
  comingSoon: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type='button'
      className={`${styles.targetButton} ${active ? styles.targetActive : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
      <span className={styles.targetLabel}>{label}</span>
      {!available && <span className={styles.comingSoon}>{comingSoon}</span>}
    </button>
  );
}

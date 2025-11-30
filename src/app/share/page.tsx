'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Share2 } from 'lucide-react';
import styles from './shareApp.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function ShareAppPage() {
  const t = useTranslations('ShareAppPage');

  const [qrUrl, setQrUrl] = useState<string>('');
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, { width: 180, margin: 1 })
        .then(setQrUrl)
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [appUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle'),
          text: t('shareText'),
          url: appUrl,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      alert(t('shareUnsupported'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>

        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: t('description') }}
        />

        <div className={styles.qrWrapper}>
          {qrUrl ? (
            <Image
              src={qrUrl}
              alt='Medicine App'
              width={228}
              height={228}
              priority
              className={styles.qrImage}
            />
          ) : (
            <p>{t('qrLoading')}</p>
          )}
        </div>

        <button className={styles.shareButton} onClick={handleShare}>
          <Share2 size={18} />
          <span>{t('shareButton')}</span>
        </button>
      </div>
    </div>
  );
}

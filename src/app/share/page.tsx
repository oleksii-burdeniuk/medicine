'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Share2 } from 'lucide-react';
import styles from './shareApp.module.css';
import HowToInstallPWA from '../components/HowToInstallPWA';
import Image from 'next/image';

export default function ShareAppPage() {
  const [qrUrl, setQrUrl] = useState<string>('');
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // ✅ Generate QR code
  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, { width: 180, margin: 1 })
        .then(setQrUrl)
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [appUrl]);

  // ✅ Share button handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Medicine App',
          text: 'Sprawdź aplikację Medicine — łatwe generowanie i skanowanie kodów kreskowych!',
          url: appUrl,
        });
      } catch (err) {
        console.error('Błąd udostępniania:', err);
      }
    } else {
      alert('Twoja przeglądarka nie obsługuje funkcji udostępniania 😕');
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>📱 Udostępnij aplikację</h1>

          <p className={styles.text}>
            Udostępnij aplikację <strong>Medicine</strong> swoim
            współpracownikom! Zeskanuj kod QR lub użyj przycisku poniżej, aby
            przesłać link do aplikacji.
          </p>

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
              <p>Ładowanie kodu QR...</p>
            )}
          </div>

          <button className={styles.shareButton} onClick={handleShare}>
            <Share2 size={18} />
            <span>Udostępnij</span>
          </button>
        </div>
      </div>
    </>
  );
}

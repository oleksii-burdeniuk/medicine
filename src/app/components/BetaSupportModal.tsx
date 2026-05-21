'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './BetaSupportModal.module.css';

type BetaSupportModalProps = {
  triggerClassName?: string;
  triggerLabel?: string;
};

export default function BetaSupportModal({
  triggerClassName,
  triggerLabel,
}: BetaSupportModalProps) {
  const t = useTranslations('Footer');
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const jarUrl = 'https://send.monobank.ua/jar/6wEyKX16pk';
  const revolutUrl = 'https://revolut.me/burdeniuk';
  const cardNumber = '4874 1000 3823 7361';

  const copyText = async (value: string, successMessage: string) => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(value);
      setFeedback({ type: 'success', text: successMessage });
    } catch {
      setFeedback({ type: 'error', text: t('betaSupportCopyError') });
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel ?? t('betaSupportLink')}
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.top}>
              <div>
                <p className={styles.badge}>BETA SUPPORT</p>
                <h2 className={styles.title}>{t('betaSupportTitle')}</h2>
                <p className={styles.subtitle}>{t('betaSupportSubtitle')}</p>
              </div>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label={t('betaSupportClose')}
              >
                ×
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.heroWrap}>
                <Image
                  src='/images/support-modal-hero.png'
                  alt='Support beta projects hero'
                  width={1280}
                  height={720}
                  className={styles.heroImage}
                />
              </div>

              <div className={styles.card}>
                <div className={styles.ctaRow}>
                  <a
                    href={revolutUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`${styles.btnPrimary} ${styles.btnWide}`}
                  >
                    Revolut
                  </a>
                  <button
                    type='button'
                    onClick={() => copyText(revolutUrl, 'Revolut link copied')}
                    className={`${styles.btnSecondary} ${styles.btnWide}`}
                  >
                    Copy Revolut link
                  </button>
                </div>
                <p className={styles.monoLine}>{revolutUrl}</p>
              </div>
              <div className={styles.card}>
                <div className={styles.ctaRow}>
                  <a
                    href={jarUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`${styles.btnPrimary} ${styles.btnWide}`}
                  >
                    {t('betaSupportOpenJar')}
                  </a>
                  <button
                    type='button'
                    onClick={() => copyText(jarUrl, t('betaSupportLinkCopied'))}
                    className={`${styles.btnSecondary} ${styles.btnWide}`}
                  >
                    {t('betaSupportCopyLink')}
                  </button>
                </div>
                <p className={styles.monoLine}>{jarUrl}</p>
              </div>

              <div className={`${styles.card} ${styles.cardSoft}`}>
                <p className={styles.label}>{t('betaSupportCardLabel')}</p>
                <p className={styles.cardNumber}>{cardNumber}</p>
                <button
                  type='button'
                  onClick={() =>
                    copyText(cardNumber, t('betaSupportCardCopied'))
                  }
                  className={styles.btnNeutral}
                >
                  {t('betaSupportCopyCard')}
                </button>
              </div>

              <p className={styles.description}>
                {t('betaSupportDescription')}
              </p>

              <p className={styles.goal}>{t('betaSupportGoal')}</p>

              {feedback && (
                <p
                  className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}
                >
                  {feedback.text}
                </p>
              )}
            </div>

            <div className={styles.bottom}>
              <a
                href={jarUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.btnPrimary}
              >
                {t('betaSupportOpenJar')}
              </a>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className={styles.btnNeutral}
              >
                {t('betaSupportNotNow')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

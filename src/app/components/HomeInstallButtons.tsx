'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  Mail,
  Smartphone,
  TabletSmartphone,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './HomeInstallButtons.module.css';

const APP_STORE_URL = 'https://apps.apple.com/ua/app/warecode/id6781419932';
const ANDROID_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.warecode.app';
const ANDROID_BETA_EMAIL = 'burdeniuk.oleksiy@gmail.com';
const ANDROID_BETA_SUBJECT = 'WareCode Android beta';
const ANDROID_BETA_BODY =
  'Cześć! Chcę dołączyć do beta testów WareCode na Androidzie.';

export default function HomeInstallButtons() {
  const t = useTranslations('HomeInstallButtons');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const androidBetaHref = `mailto:${ANDROID_BETA_EMAIL}?subject=${encodeURIComponent(
    ANDROID_BETA_SUBJECT,
  )}&body=${encodeURIComponent(ANDROID_BETA_BODY)}`;

  return (
    <>
      {isPanelOpen ? (
        <section className={styles.panel} aria-labelledby='install-app-title'>
          <button
            type='button'
            className={styles.panelCloseButton}
            onClick={() => setIsPanelOpen(false)}
            aria-label={t('closeInstallPanel')}
          >
            <X size={18} />
          </button>

          <div className={styles.copy}>
            <p className={styles.eyebrow}>{t('eyebrow')}</p>
            <h2 id='install-app-title' className={styles.title}>
              {t('title')}
            </h2>
            <p className={styles.description}>{t('description')}</p>
          </div>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={APP_STORE_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <TabletSmartphone size={19} strokeWidth={2.4} />
              <span>{t('iosButton')}</span>
              <ExternalLink size={16} strokeWidth={2.4} />
            </a>

            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setIsAndroidModalOpen(true)}
            >
              <Smartphone size={19} strokeWidth={2.4} />
              <span>{t('androidButton')}</span>
            </button>
          </div>
        </section>
      ) : (
        <button
          type='button'
          className={styles.miniInstallButton}
          onClick={() => setIsPanelOpen(true)}
        >
          <Smartphone size={18} strokeWidth={2.4} />
          <span>{t('installSmall')}</span>
        </button>
      )}

      {isAndroidModalOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsAndroidModalOpen(false)}
        >
          <section
            className={styles.modal}
            role='dialog'
            aria-modal='true'
            aria-labelledby='android-beta-title'
            aria-describedby='android-beta-description'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              className={styles.closeButton}
              onClick={() => setIsAndroidModalOpen(false)}
              aria-label={t('close')}
            >
              <X size={22} />
            </button>

            <div className={styles.iconWrap}>
              <Image
                src='/icons/icon-192x192.png'
                alt=''
                width={76}
                height={76}
                className={styles.appIcon}
              />
            </div>

            <p className={styles.modalEyebrow}>Android beta</p>
            <h2 id='android-beta-title' className={styles.modalTitle}>
              {t('modalTitle')}
            </h2>
            <p id='android-beta-description' className={styles.modalDescription}>
              {t('modalDescription')}
            </p>

            <a
              className={styles.modalPrimaryButton}
              href={ANDROID_PLAY_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Smartphone size={18} strokeWidth={2.4} />
              <span>{t('downloadAndroid')}</span>
              <ExternalLink size={16} strokeWidth={2.4} />
            </a>

            <p className={styles.betaHint}>{t('alreadyAddedHint')}</p>

            <a className={styles.modalOutlineButton} href={androidBetaHref}>
              <Mail size={18} strokeWidth={2.4} />
              <span>{t('sendRequest')}</span>
            </a>
            <button
              type='button'
              className={styles.modalSecondaryButton}
              onClick={() => setIsAndroidModalOpen(false)}
            >
              {t('later')}
            </button>
          </section>
        </div>
      )}
    </>
  );
}

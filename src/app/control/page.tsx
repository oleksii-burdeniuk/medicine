'use client';

import { useMemo, useRef, useState } from 'react';
import { Camera, Save, Trash2, Users } from 'lucide-react';
import styles from './ControlPage.module.css';
import Modal from '../components/modalWindow/Modal';
import { useTranslations } from 'next-intl';
import { compressImage } from '../utils/compressImage';

type ControlItem = {
  login: string;
  uzytkownik: string;
  dzial: string | null;
  numerReferencyjny?: string;
  status?: string;
  nosnikNumer: string;
  wynikPozytywny?: boolean;
  daneWejsciowe?: Record<string, unknown> | null;
  dodaneKiedy: string;
  kontrahent?: string;
};

const STORAGE_KEY = 'controlSavedItems';

function useSavedControlItems() {
  const [savedItems, setSavedItems] = useState<ControlItem[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ControlItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const persist = (items: ControlItem[]) => {
    setSavedItems(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  return { savedItems, persist };
}

function mergeUniqueByLogin(items: ControlItem[]) {
  const byLogin = new Map<string, ControlItem>();
  for (const item of items) {
    byLogin.set(item.login, item);
  }
  return Array.from(byLogin.values()).sort((a, b) =>
    a.uzytkownik.localeCompare(b.uzytkownik),
  );
}

export default function ControlPage() {
  const t = useTranslations('ControlPage');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { savedItems, persist } = useSavedControlItems();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestItems, setLatestItems] = useState<ControlItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const savedByLogin = useMemo(
    () => new Set(savedItems.map((item) => item.login)),
    [savedItems],
  );

  const saveOne = (item: ControlItem) => {
    const merged = mergeUniqueByLogin([item, ...savedItems]);
    persist(merged);
  };

  const saveAllLatest = () => {
    const merged = mergeUniqueByLogin([...latestItems, ...savedItems]);
    persist(merged);
    setIsModalOpen(false);
  };

  const removeSaved = (login: string) => {
    persist(savedItems.filter((item) => item.login !== login));
  };

  const clearSaved = () => {
    if (!window.confirm(t('confirmClearSaved'))) return;
    persist([]);
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const compressedBlob = await compressImage(file, 1200, 1);
      const uploadedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
      });

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const res = await fetch('/api/control', {
        method: 'POST',
        body: formData,
      });
      console.log('Control API response status:', res.status);
      const payload = await res.json();
      console.log('Control API response:', payload);
      if (!res.ok) {
        throw new Error(payload?.error || 'Failed to process control image');
      }

      const items = (payload?.items || []) as ControlItem[];
      setLatestItems(items);
      setIsModalOpen(items.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('processingError'));
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>

        <div className={styles.uploadRow}>
          <button
            className={styles.photoButton}
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            title={loading ? t('processing') : t('takePhoto')}
          >
            <Camera size={18} />
          </button>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            // capture='environment'
            onChange={onFileSelected}
            style={{ display: 'none' }}
          />

          <button
            className={styles.latestButton}
            type='button'
            onClick={() => setIsModalOpen(true)}
            disabled={latestItems.length === 0}
            title={t('latestRecognized')}
          >
            <Users size={18} />
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.savedHeader}>
          <h2>{t('savedListTitle', { count: savedItems.length })}</h2>
          {savedItems.length > 0 && (
            <button
              className={styles.clearButton}
              type='button'
              onClick={clearSaved}
              title={t('clearSaved')}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <ul className={styles.list}>
          {savedItems.length === 0 ? (
            <p className={styles.empty}>{t('noSaved')}</p>
          ) : (
            savedItems.map((item) => (
              <li key={item.login} className={styles.listItem}>
                <div className={styles.itemContent}>
                  <strong>{item.uzytkownik}</strong>
                  <span>
                    {t('dzial')}: {item.dzial || '-'}
                  </span>
                  <span>
                    {t('nosnikNumer')}: <strong>{item.nosnikNumer}</strong>
                  </span>
                  <span>
                    {t('dodaneKiedy')}: {item.dodaneKiedy}
                  </span>
                  <span>
                    {t('kontrahent')}: {item.kontrahent || '-'}
                  </span>
                </div>
                <button
                  className={styles.deleteButton}
                  type='button'
                  onClick={() => removeSaved(item.login)}
                  title={t('deleteOne')}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3>{t('latestRecognized')}</h3>
            {latestItems.length > 0 && (
              <button className={styles.saveAllButton} onClick={saveAllLatest}>
                <Save size={16} />
                {t('saveAll')}
              </button>
            )}
          </div>

          <ul className={styles.list}>
            {latestItems.length === 0 ? (
              <p className={styles.empty}>{t('noLatest')}</p>
            ) : (
              latestItems.map((item) => (
                <li key={item.login} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <strong>{item.uzytkownik}</strong>
                    <span>
                      {t('dzial')}: {item.dzial || '-'}
                    </span>
                    <span>
                      {t('nosnikNumer')}: <strong>{item.nosnikNumer}</strong>
                    </span>
                    <span>
                      {t('dodaneKiedy')}: {item.dodaneKiedy}
                    </span>
                    <span>
                      {t('kontrahent')}: {item.kontrahent || '-'}
                    </span>
                  </div>
                  <button
                    className={styles.saveOneButton}
                    onClick={() => saveOne(item)}
                    disabled={savedByLogin.has(item.login)}
                    title={t('saveOne')}
                  >
                    <Save size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import styles from './WorkHoursModal.module.css';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  date: string;
  data?: { start: string; end: string };
  isPrevDateData: boolean;
  onClose: () => void;
  onSave: (start: string, end: string) => void;
  onDelete: () => void;
  onCopyTime: () => void;
}

export default function WorkHoursModal({
  date,
  data,
  onClose,
  onSave,
  onDelete,
  onCopyTime,
  isPrevDateData,
}: Props) {
  const t = useTranslations('modal');

  const [start, setStart] = useState(data?.start || '');
  const [end, setEnd] = useState(data?.end || '');

  // 🔥 синхронізація даних дня – основна проблема була тут
  useEffect(() => {
    setStart(data?.start || '');
    setEnd(data?.end || '');
  }, [data, date]);

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    return `${day}.${m}.${y}`;
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>📅 {formatDate(date)}</h2>

        <label className={styles.label}>{t('start')}</label>
        <input
          type='time'
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={styles.input}
        />

        <label className={styles.label}>{t('end')}</label>
        <input
          type='time'
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={styles.input}
        />

        <div className={styles.buttons}>
          {!!isPrevDateData && !data ? (
            <button
              className={styles.saveBtn}
              onClick={() => {
                onCopyTime();
                onClose();
              }}
            >
              💾 {t('copyYesterday')}
            </button>
          ) : (
            <div />
          )}

          <button
            className={styles.saveBtn}
            onClick={() => {
              if (!start || !end) return;
              onSave(start, end);
            }}
          >
            💾 {t('save')}
          </button>

          {data && (
            <button className={styles.deleteBtn} onClick={onDelete}>
              🗑 {t('delete')}
            </button>
          )}

          <button className={styles.cancelBtn} onClick={onClose}>
            ✖ {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}

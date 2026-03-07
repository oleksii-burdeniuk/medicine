'use client';

import styles from './WorkHoursModal.module.css';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface WorkInterval {
  start: string;
  end: string;
}

interface Props {
  date: string;
  intervals: WorkInterval[];
  hasLastSavedData: boolean;
  onClose: () => void;
  onSave: (intervals: WorkInterval[]) => void;
  onDelete: () => void;
  onPasteLastSaved: () => void;
}

export default function WorkHoursModal({
  date,
  intervals,
  onClose,
  onSave,
  onDelete,
  onPasteLastSaved,
  hasLastSavedData,
}: Props) {
  const t = useTranslations('modal');
  const [rows, setRows] = useState<WorkInterval[]>(intervals);

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    return `${day}.${m}.${y}`;
  };

  useEffect(() => {
    setRows(intervals);
  }, [intervals, date]);

  const updateRow = (
    index: number,
    field: keyof WorkInterval,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addInterval = () => {
    setRows((prev) => [...prev, { start: '', end: '' }]);
  };

  const removeInterval = (index: number) => {
    setRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const save = () => {
    const normalized = rows.filter((row) => row.start || row.end);

    if (normalized.length === 0) {
      onSave([]);
      return;
    }

    const hasInvalid = normalized.some((row) => !row.start || !row.end);
    if (hasInvalid) {
      alert(t('validationError'));
      return;
    }

    onSave(normalized);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>📅 {formatDate(date)}</h2>

        {rows.map((row, index) => (
          <div key={index} className={styles.intervalCard}>
            <label className={styles.label}>
              {t('start')} #{index + 1}
            </label>
            <input
              type='time'
              value={row.start}
              onChange={(e) => updateRow(index, 'start', e.target.value)}
              className={styles.input}
            />

            <label className={styles.label}>{t('end')}</label>
            <input
              type='time'
              value={row.end}
              onChange={(e) => updateRow(index, 'end', e.target.value)}
              className={styles.input}
            />

            {rows.length > 1 && (
              <button
                type='button'
                className={styles.removeIntervalBtn}
                onClick={() => removeInterval(index)}
              >
                {t('removeInterval')}
              </button>
            )}
          </div>
        ))}

        <div className={styles.buttons}>
          <button className={styles.secondaryBtn} onClick={addInterval}>
            ➕ {t('addInterval')}
          </button>

          {hasLastSavedData && (
            <button
              className={styles.secondaryBtn}
              onClick={() => {
                onPasteLastSaved();
                onClose();
              }}
            >
              📥 {t('pasteLastSaved')}
            </button>
          )}

          <button className={styles.saveBtn} onClick={save}>
            💾 {t('save')}
          </button>

          {intervals.length > 0 && (
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

'use client';

import styles from './WorkHoursModal.module.css';
import { useState } from 'react';

interface Props {
  date: string;
  data?: { start: string; end: string };
  onClose: () => void;
  onSave: (start: string, end: string) => void;
  onDelete: () => void;
}

export default function WorkHoursModal({
  date,
  data,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [start, setStart] = useState(data?.start || '');
  const [end, setEnd] = useState(data?.end || '');

  const formatDate = (d: string) => {
    const [year, month, day] = d.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>📅 {formatDate(date)}</h2>

        <label className={styles.label}>Godzina rozpoczęcia</label>
        <input
          type='time'
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={styles.input}
        />

        <label className={styles.label}>Godzina zakończenia</label>
        <input
          type='time'
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={styles.input}
        />

        <div className={styles.buttons}>
          <button
            className={styles.saveBtn}
            onClick={() => {
              if (!start || !end) return;
              onSave(start, end);
            }}
          >
            💾 Zapisz
          </button>

          {data && (
            <button className={styles.deleteBtn} onClick={onDelete}>
              🗑 Usuń wpis
            </button>
          )}

          <button className={styles.cancelBtn} onClick={onClose}>
            ✖ Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

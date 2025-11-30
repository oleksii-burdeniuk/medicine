'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './SavedCodes.module.css';
import { useTranslations } from 'next-intl';

interface SavedCodesProps {
  savedCodes: string[];
  onSelect: (code: string) => void;
  onDelete: (code: string) => void;
}

export default function SavedCodes({
  savedCodes,
  onSelect,
  onDelete,
}: SavedCodesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslations('SavedCodes');

  const filteredCodes = savedCodes.filter((code) =>
    code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.savedList}>
      <h2 id='listTitle'>{t('title', { count: savedCodes.length })}</h2>
      <input
        type='text'
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {filteredCodes.length > 0 ? (
        <ul className={styles.list}>
          {filteredCodes.map((code) => (
            <li key={code} className={styles.listItem}>
              <span onClick={() => onSelect(code)} className={styles.codeText}>
                {code}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(code)}
                title={t('deleteButton')}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResults}>{t('noResults')}</p>
      )}
    </div>
  );
}

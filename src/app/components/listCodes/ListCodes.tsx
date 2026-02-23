'use client';

import { Save } from 'lucide-react';
import styles from './ListCodes.module.css';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ListCodesProps {
  listCodes: string[];
  onSelect: (code: string) => void;

  onSaveAll: (codes: string[]) => void;
}

export default function ListCodes({
  listCodes,
  onSelect,
  onSaveAll,
}: ListCodesProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const t = useTranslations('ListCodes');

  const filteredCodes = listCodes.filter((code) =>
    code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.savedList}>
      {/* 🔥 Save all button */}

      {listCodes.length > 0 && (
        <button
          className={styles.saveAllButton}
          onClick={() => onSaveAll(filteredCodes)}
        >
          {t('saveAll')}
        </button>
      )}
      <input
        type='text'
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {filteredCodes.length > 0 ? (
        <ul className={styles.list}>
          {filteredCodes.map((code, index) => (
            <li key={code + index} className={styles.listItem}>
              <span className={styles.codeText}>{code}</span>

              <div className={styles.actions}>
                {/* Save single */}
                <button
                  className={styles.saveButton}
                  onClick={() => onSelect(code)}
                  title={t('saveButton')}
                >
                  <Save size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResults}>{t('noResults')}</p>
      )}
    </div>
  );
}

'use client';

import { Check, Save } from 'lucide-react';
import styles from './ListCodes.module.css';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ListCodesProps {
  listCodes: string[];
  savedCodes: string[];
  selectedCode: string;
  onSelect: (code: string) => void;
  onSave: (code: string) => void;
  onSaveAll: (codes: string[]) => void;
}

export default function ListCodes({
  listCodes,
  savedCodes,
  selectedCode,
  onSelect,
  onSaveAll,
  onSave,
}: ListCodesProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const t = useTranslations('ListCodes');
  const savedSet = new Set(savedCodes);

  const filteredCodes = listCodes.filter((code) =>
    code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.savedList}>
      {/* 🔥 Save all button */}

      {listCodes.length > 0 && (
        <button
          className={styles.saveAllButton}
          onClick={() => onSaveAll(filteredCodes.filter((code) => !savedSet.has(code)))}
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
            <li
              key={code + index}
              className={`${styles.listItem} ${
                selectedCode === code ? styles.selectedItem : ''
              } ${savedSet.has(code) ? styles.savedItem : ''}`}
              onClick={() => onSelect(code)}
            >
              <span className={styles.codeText}>{code}</span>

              <div className={styles.actions}>
                {savedSet.has(code) && (
                  <span className={styles.savedBadge}>
                    <Check size={12} />
                    Saved
                  </span>
                )}
                {/* Save single */}
                <button
                  className={`${styles.saveButton} ${
                    savedSet.has(code) ? styles.saveButtonSaved : ''
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!savedSet.has(code)) onSave(code);
                  }}
                  title={t('saveButton')}
                  disabled={savedSet.has(code)}
                >
                  {savedSet.has(code) ? <Check size={16} /> : <Save size={16} />}
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

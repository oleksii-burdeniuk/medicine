'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './SavedCodes.module.css';

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

  const filteredCodes = savedCodes.filter((code) =>
    code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.savedList}>
      <h2 id='listTitle'>Zapisane kody: {savedCodes.length}</h2>
      <input
        type='text'
        placeholder='Szukaj kodu...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {filteredCodes.length > 0 ? (
        <ul className={styles.list}>
          {filteredCodes.map((code, i) => (
            <li key={code} className={styles.listItem}>
              <span onClick={() => onSelect(code)} className={styles.codeText}>
                {code}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(code)}
                title='Usuń'
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResults}>Brak wyników</p>
      )}
    </div>
  );
}

'use client';

import styles from './SavedUsers.module.css';
import { Trash2, User, Key } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SavedUser {
  login: string;
  password: string;
}

interface Props {
  savedUsers: SavedUser[];
  onDelete: (login: string) => void;
  onSelect: (value: string) => void;
  onClearAll: () => void;
}

const SavedUsers = ({ savedUsers, onDelete, onSelect, onClearAll }: Props) => {
  const t = useTranslations('SavedUsers');

  return (
    <div className={styles.savedUsers}>
      {savedUsers.length > 0 && (
        <button
          className={styles.clearAllButton}
          type='button'
          title={t('clearAll')}
          onClick={() => {
            if (window.confirm(t('confirmClearAll'))) {
              onClearAll();
            }
          }}
        >
          <Trash2 size={16} />
        </button>
      )}
      <h2>{t('title')}</h2>

      <ul className={styles.list}>
        {savedUsers.length === 0 ? (
          <p className={styles.noResults}>{t('noUsers')}</p>
        ) : (
          savedUsers.map((user) => (
            <li key={user.login} className={styles.listItem}>
              <div className={styles.userData}>
                {/* Клікнувши сюди, генеруємо баркод для логіна */}
                <div
                  className={styles.clickableRow}
                  onClick={() => onSelect(user.login)}
                >
                  <User size={14} className={styles.icon} />
                  <span className={styles.valText}>{user.login}</span>
                </div>

                {/* Клікнувши сюди, генеруємо баркод для пароля */}
                <div
                  className={styles.clickableRow}
                  onClick={() => onSelect(user.password)}
                >
                  <Key size={14} className={styles.icon} />
                  <span className={styles.valText}>{user.password}</span>
                </div>
              </div>

              <button
                className={styles.deleteButton}
                onClick={() => onDelete(user.login)}
                type='button'
                title={t('deleteAccount')}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SavedUsers;

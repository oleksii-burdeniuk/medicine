'use client';

import styles from './SavedUsers.module.css';
import { Trash2, User, Key } from 'lucide-react';

interface SavedUser {
  login: string;
  password: string;
}

interface Props {
  savedUsers: SavedUser[];
  onDelete: (login: string) => void;
  onSelect: (value: string) => void;
}

const SavedUsers = ({ savedUsers, onDelete, onSelect }: Props) => {
  return (
    <div className={styles.savedUsers}>
      <h2>Saved Users</h2>

      <ul className={styles.list}>
        {savedUsers.length === 0 ? (
          <p className={styles.noResults}>No users found</p>
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
                title='Delete account'
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

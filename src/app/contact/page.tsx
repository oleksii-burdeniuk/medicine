'use client';

import styles from './Contacts.module.css';
import { Phone } from 'lucide-react';

export default function ContactPage() {
  const contacts = [
    { role: 'DZIAŁ REALIZACJI', name: null, phone: '519751663' },
    { role: 'Kierownik', name: 'MARCIN GUZIK', phone: '885853715' },
    { role: 'Brygadzista', name: 'CECYLIA SZCZERBA', phone: '730598738' },
    { role: 'Brygadzista', name: 'JULIA MULARZ', phone: '791633400' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Telefony kontaktowe</h1>

        <ul className={styles.list}>
          {contacts.map((c, idx) => (
            <li key={idx} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.role}>{c.role}</span>
                {c.name && <span className={styles.name}>{c.name}</span>}
                <a href={`tel:${c.phone}`} className={styles.phone}>
                  <Phone size={18} /> {c.phone}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './HoursPage.module.css';
import WorkHoursModal from './WorkHoursModal';

export default function HoursPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState<
    Record<string, { start: string; end: string }>
  >({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load saved hours on mount
  useEffect(() => {
    const stored = localStorage.getItem('workHours');
    if (stored) {
      try {
        setHours(JSON.parse(stored));
      } catch {
        console.error('Invalid JSON in localStorage');
      }
    }
  }, []);

  // Save hours whenever they change
  useEffect(() => {
    localStorage.setItem('workHours', JSON.stringify(hours));
  }, [hours]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const dateKey = (day: number) =>
    `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;

  // --- Count total monthly hours ---
  const totalHours = Object.entries(hours)
    .filter(([key]) =>
      key.startsWith(
        `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-`
      )
    )
    .reduce((sum, [, { start, end }]) => {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);

      const diff = eh * 60 + em - (sh * 60 + sm);
      return diff > 0 ? sum + diff / 60 : sum;
    }, 0)
    .toFixed(1);
  const workedDays = Object.entries(hours).filter(([key]) =>
    key.startsWith(
      `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-`
    )
  ).length;

  // --- Average hours per day ---
  const averageHours =
    workedDays > 0 ? (Number(totalHours) / workedDays).toFixed(1) : '0';

  return (
    <div className={`${styles.container} ${styles.darkText}`}>
      <h1 className={styles.title}>🕒 Moje godziny pracy</h1>

      <div className={styles.calendar}>
        {/* Header */}
        <div className={styles.header}>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1
                )
              )
            }
          >
            ◀
          </button>

          <span>
            {currentMonth.toLocaleString('pl-PL', {
              month: 'long',
              year: 'numeric',
            })}
          </span>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
              )
            }
          >
            ▶
          </button>
        </div>

        {/* Weekdays */}
        <div className={styles.weekdays}>
          {['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className={styles.daysGrid}>
          {Array(firstDay === 0 ? 6 : firstDay - 1)
            .fill(null)
            .map((_, i) => (
              <div key={i} className={styles.empty}></div>
            ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = dateKey(day);
            const hasHours = !!hours[key];

            return (
              <div
                key={day}
                className={`${styles.day} ${hasHours ? styles.hasHours : ''}`}
                onClick={() => setSelectedDate(key)}
              >
                <span>{day}</span>

                {hasHours && (
                  <small>
                    {hours[key].start} – {hours[key].end}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly summary */}
      <div className={styles.summaryContainer}>
        <h2>📊 Podsumowanie miesiąca</h2>

        <p>
          🟦 Łącznie przepracowane: <b>{totalHours} h</b>
        </p>

        <p>
          🟩 Ilość dni pracujących: <b>{workedDays}</b>
        </p>

        <p>
          🟨 Średnia ilość godzin dziennie: <b>{averageHours} h</b>
        </p>
      </div>

      {/* Modal */}
      {selectedDate && (
        <WorkHoursModal
          date={selectedDate}
          data={hours[selectedDate]}
          onClose={() => setSelectedDate(null)}
          onSave={(start, end) => {
            setHours((prev) => ({
              ...prev,
              [selectedDate]: { start, end },
            }));
            setSelectedDate(null);
          }}
          onDelete={() => {
            setHours((prev) => {
              const newHours = { ...prev };
              delete newHours[selectedDate];
              return newHours;
            });
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './HoursPage.module.css';
import WorkHoursModal from './WorkHoursModal';
import jsPDF from 'jspdf';

export default function HoursPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState<
    Record<string, { start: string; end: string }>
  >({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rate, setRate] = useState<number | string>(0);

  const changeRate = (newRate: number) => {
    if (newRate) {
      setRate(newRate);
    } else {
      setRate('');
    }
  };

  useEffect(() => {
    const storedRate = localStorage.getItem('hourlyRate');
    if (storedRate) {
      setRate(Number(storedRate));
    }
  }, []);

  useEffect(() => {
    if (rate !== '') {
      localStorage.setItem('hourlyRate', rate.toString());
    }
  }, [rate]);

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
  const salary = (Number(totalHours) * +rate).toFixed(2);

  const generatePDF = () => {
    const doc = new jsPDF();

    const monthName = currentMonth.toLocaleString('pl-PL', {
      month: 'long',
      year: 'numeric',
    });

    doc.setFontSize(18);
    doc.text(`Raport godzin pracy – ${monthName}`, 10, 15);

    doc.setFontSize(12);
    let y = 30;

    doc.text('Dni pracy:', 10, y);

    Object.entries(hours)
      .filter(([key]) =>
        key.startsWith(
          `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-`
        )
      )
      .forEach(([date, { start, end }]) => {
        y += 7;
        doc.text(`• ${date}: ${start} – ${end}`, 10, y);
      });

    y += 15;

    doc.setFontSize(14);
    doc.text('Summary:', 10, y);

    y += 8;
    doc.setFontSize(12);

    doc.text(`Total hours: ${totalHours}`, 10, y);
    y += 6;
    doc.text(`Working days: ${workedDays}`, 10, y);
    y += 6;
    doc.text(`Average hours per day: ${averageHours}`, 10, y);
    y += 6;
    doc.save(`hours_${monthName}.pdf`);
  };

  const isPrevDateDataAvailable = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const prevDayKey = `${year}-${month}-${day - 1}`;
    return hours[prevDayKey];
  };

  const copyTime = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);

    const prevDayKey = `${year}-${month}-${day - 1}`;

    if (hours[prevDayKey]) {
      const { start, end } = hours[prevDayKey];

      setHours((prev) => ({
        ...prev,
        [selectedDate]: { start, end },
      }));
    }
  };

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
        <p>
          💵 Stawka godzinowa:
          <input
            type='number'
            value={rate}
            onChange={(e) => changeRate(+e.target.value)}
            style={{
              width: '80px',
              marginLeft: '10px',
              padding: '5px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />{' '}
          zł
        </p>

        <p>
          💰 Wynagrodzenie za miesiąc:
          <b> {salary} zł </b>
        </p>

        <button
          onClick={generatePDF}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          📄 Eksport do PDF
        </button>
      </div>

      {/* Modal */}
      {selectedDate && (
        <WorkHoursModal
          date={selectedDate}
          data={hours[selectedDate]}
          onClose={() => setSelectedDate(null)}
          isPrevDateData={!!isPrevDateDataAvailable()}
          onCopyTime={copyTime}
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

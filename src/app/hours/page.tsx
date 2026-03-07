'use client';

import { useState, useEffect } from 'react';
import styles from './HoursPage.module.css';
import WorkHoursModal from './WorkHoursModal';
import jsPDF from 'jspdf';
import { useTranslations } from 'next-intl';

interface WorkInterval {
  start: string;
  end: string;
}

interface WorkDay {
  intervals: WorkInterval[];
}

type HoursMap = Record<string, WorkDay>;

const EMPTY_INTERVAL: WorkInterval = { start: '', end: '' };

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
};

const intervalMinutes = (interval: WorkInterval) => {
  const start = parseTimeToMinutes(interval.start);
  const end = parseTimeToMinutes(interval.end);
  if (start === null || end === null) return 0;

  let diff = end - start;
  if (diff < 0) diff += 24 * 60;
  if (diff === 0) return 0;
  return diff;
};

const dayMinutes = (day?: WorkDay) =>
  day?.intervals.reduce((sum, interval) => sum + intervalMinutes(interval), 0) ??
  0;

function normalizeHours(raw: unknown): HoursMap {
  if (!raw || typeof raw !== 'object') return {};

  const normalized: HoursMap = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!value || typeof value !== 'object') continue;

    const day = value as {
      intervals?: unknown;
      start?: unknown;
      end?: unknown;
    };

    if (Array.isArray(day.intervals)) {
      const intervals = day.intervals
        .filter(
          (item): item is WorkInterval =>
            !!item &&
            typeof item === 'object' &&
            typeof (item as { start?: unknown }).start === 'string' &&
            typeof (item as { end?: unknown }).end === 'string'
        )
        .map((item) => ({ start: item.start, end: item.end }));

      normalized[date] = { intervals };
      continue;
    }

    if (typeof day.start === 'string' && typeof day.end === 'string') {
      normalized[date] = { intervals: [{ start: day.start, end: day.end }] };
    }
  }

  return normalized;
}

export default function HoursPage() {
  const t = useTranslations('HoursPage');

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState<HoursMap>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rate, setRate] = useState<string>('');

  useEffect(() => {
    const storedRate = localStorage.getItem('hourlyRate');
    if (storedRate) setRate(storedRate);
  }, []);

  useEffect(() => {
    if (rate !== '') {
      localStorage.setItem('hourlyRate', rate);
    } else {
      localStorage.removeItem('hourlyRate');
    }
  }, [rate]);

  useEffect(() => {
    const stored = localStorage.getItem('workHours');
    if (stored) {
      try {
        setHours(normalizeHours(JSON.parse(stored)));
      } catch {
        console.error('Invalid JSON in localStorage');
      }
    }
  }, []);

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
    `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const monthPrefix = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, '0')}-`;

  const monthEntries = Object.entries(hours)
    .filter(([key]) => key.startsWith(monthPrefix))
    .sort(([a], [b]) => a.localeCompare(b));

  const totalMinutes = monthEntries.reduce(
    (sum, [, day]) => sum + dayMinutes(day),
    0
  );
  const totalHours = totalMinutes / 60;
  const workedDays = monthEntries.filter(([, day]) => dayMinutes(day) > 0).length;
  const averageHours = workedDays > 0 ? totalHours / workedDays : 0;
  const numericRate = Number(rate) || 0;
  const salary = totalHours * numericRate;

  const findLastSavedIntervals = (excludeDate?: string) => {
    const keys = Object.keys(hours)
      .filter((key) => key !== excludeDate && dayMinutes(hours[key]) > 0)
      .sort((a, b) => b.localeCompare(a));

    const lastKey = keys[0];
    if (!lastKey) return null;

    return hours[lastKey].intervals.map((interval) => ({ ...interval }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const monthName = currentMonth.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    doc.setFontSize(18);
    doc.text(`Work hours report - ${monthName}`, 10, 15);

    doc.setFontSize(12);
    let y = 30;
    const pageBottom = 282;
    const ensureSpace = (needed = 8) => {
      if (y + needed > pageBottom) {
        doc.addPage();
        y = 20;
      }
    };

    doc.text('Work days:', 10, y);
    if (monthEntries.length === 0) {
      y += 7;
      doc.text('No data for the selected month.', 10, y);
    } else {
      monthEntries.forEach(([date, day]) => {
        if (day.intervals.length === 0) return;
        day.intervals.forEach((interval, index) => {
          ensureSpace();
          y += 7;
          const suffix =
            day.intervals.length > 1 ? ` (${index + 1}/${day.intervals.length})` : '';
          doc.text(`• ${date}: ${interval.start} - ${interval.end}${suffix}`, 10, y);
        });
      });
    }

    y += 15;
    ensureSpace(30);

    doc.setFontSize(14);
    doc.text('Summary:', 10, y);

    y += 8;
    doc.setFontSize(12);

    doc.text(`Total hours: ${totalHours.toFixed(1)} h`, 10, y);
    y += 6;
    doc.text(`Working days: ${workedDays}`, 10, y);
    y += 6;
    doc.text(`Average hours per day: ${averageHours.toFixed(1)} h`, 10, y);
    y += 6;
    doc.text(`Hourly rate: ${numericRate} ${t('currency')}`, 10, y);
    y += 6;
    doc.text(`Monthly salary: ${salary.toFixed(2)} ${t('currency')}`, 10, y);
    y += 6;

    doc.save(`hours_${monthName}.pdf`);
  };

  const pasteLastSaved = () => {
    if (!selectedDate) return;
    const lastSaved = findLastSavedIntervals(selectedDate);
    if (!lastSaved) return;

    setHours((prev) => ({
      ...prev,
      [selectedDate]: { intervals: lastSaved },
    }));
  };

  const hasLastSavedData = !!findLastSavedIntervals(selectedDate ?? undefined);

  const weekdays = [
    t('weekdayMon'),
    t('weekdayTue'),
    t('weekdayWed'),
    t('weekdayThu'),
    t('weekdayFri'),
    t('weekdaySat'),
    t('weekdaySun'),
  ];
  const todayKey = toDateKey(new Date());

  return (
    <div className={`${styles.container} ${styles.darkText}`}>
      <h1 className={styles.title}>{t('title')}</h1>

      <div className={styles.calendar}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.monthNavBtn}
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
          <span className={styles.monthTitle}>
            {currentMonth.toLocaleString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            className={styles.monthNavBtn}
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
          {weekdays.map((d: string) => (
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
            const intervals = hours[key]?.intervals ?? [];
            const hasHours = dayMinutes(hours[key]) > 0;
            return (
              <div
                key={day}
                className={`
    ${styles.day}
    ${hasHours ? styles.hasHours : ''}
    ${key === todayKey ? styles.today : ''}
  `}
                onClick={() => setSelectedDate(key)}
              >
                <span>{day}</span>
                {hasHours && (
                  <small>
                    {intervals.length === 1
                      ? `${intervals[0].start} - ${intervals[0].end}`
                      : `${intervals.length} ${t('entriesCount')}`}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly summary */}
      <div className={styles.summaryContainer}>
        <h2 className={styles.summaryTitle}>{t('monthSummary')}</h2>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t('totalHours')}</span>
            <strong className={styles.metricValue}>{totalHours.toFixed(1)} h</strong>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t('workedDays')}</span>
            <strong className={styles.metricValue}>{workedDays}</strong>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t('averageHours')}</span>
            <strong className={styles.metricValue}>{averageHours.toFixed(1)} h</strong>
          </div>
        </div>

        <div className={styles.rateRow}>
          <label htmlFor='hourlyRateInput' className={styles.rateLabel}>
            {t('hourlyRate')}
          </label>
          <div className={styles.rateInputWrap}>
            <input
              id='hourlyRateInput'
              type='number'
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={styles.rateInput}
            />
            <span className={styles.rateCurrency}>{t('currency')}</span>
          </div>
        </div>

        <p className={styles.salaryLine}>
          {t('monthlySalary')}:{' '}
          <strong>
            {salary.toFixed(2)} {t('currency')}
          </strong>
        </p>

        <button className={styles.exportBtn} onClick={generatePDF}>
          {t('exportPDF')}
        </button>
      </div>

      {selectedDate && (
        <WorkHoursModal
          date={selectedDate}
          intervals={hours[selectedDate]?.intervals ?? [EMPTY_INTERVAL]}
          onClose={() => setSelectedDate(null)}
          hasLastSavedData={hasLastSavedData}
          onPasteLastSaved={pasteLastSaved}
          onSave={(intervals) => {
            setHours((prev) => {
              const next = { ...prev };
              if (intervals.length === 0) {
                delete next[selectedDate];
              } else {
                next[selectedDate] = { intervals };
              }
              return next;
            });
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

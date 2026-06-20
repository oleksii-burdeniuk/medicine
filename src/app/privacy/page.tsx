'use client';

import { useLocale } from 'next-intl';
import { OPEN_CONSENT_EVENT } from '../components/privacy/consent';
import styles from './privacy.module.css';

const content = {
  pl: {
    title: 'Polityka prywatności i plików cookie',
    updated: 'Ostatnia aktualizacja: 20 czerwca 2026 r.',
    intro:
      'Niniejsza polityka wyjaśnia, jakie dane są przetwarzane podczas korzystania z WareCode, w jakim celu oraz jakie prawa przysługują użytkownikowi.',
    controllerTitle: '1. Administrator danych',
    controller:
      'Administratorem danych jest Oleksii Burdeniuk. W sprawach prywatności możesz skontaktować się pod adresem: alejandroburdenyk@gmail.com.',
    dataTitle: '2. Jakie dane przetwarzamy',
    dataItems: [
      'Dane techniczne niezbędne do dostarczenia i zabezpieczenia serwisu, takie jak adres IP, typ przeglądarki, informacje o urządzeniu, czas i adres żądania. Mogą być przetwarzane w logach hostingowych Vercel.',
      'Wybrany język oraz decyzję dotyczącą cookies, zapisane na urządzeniu.',
      'Kody, loginy, hasła, godziny pracy i ustawienia zapisane lokalnie w przeglądarce. WareCode nie przesyła ich na serwer, chyba że użytkownik sam uruchomi funkcję wymagającą transmisji. Nie zapisuj danych, których nie masz prawa przetwarzać.',
      'Obrazy przesłane dobrowolnie do rozpoznawania tekstu. Obraz jest przekazywany do Google Cloud Vision w celu wykonania OCR; aplikacja nie zapisuje go celowo po zakończeniu żądania.',
      'Dane subskrypcji push, w tym unikalny adres endpoint i klucze urządzenia, wyłącznie po dobrowolnym włączeniu powiadomień.',
      'Dane statystyczne Google Analytics i Vercel Speed Insights wyłącznie po zaakceptowaniu analitycznych plików cookie.',
    ],
    purposesTitle: '3. Cele i podstawy prawne',
    purposes:
      'Dane techniczne są przetwarzane w celu bezpiecznego udostępnienia serwisu i zapobiegania nadużyciom, na podstawie prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO). Dane potrzebne do funkcji wybranej przez użytkownika są przetwarzane w celu wykonania jego żądania (art. 6 ust. 1 lit. b RODO). Analityka i powiadomienia push działają na podstawie zgody (art. 6 ust. 1 lit. a RODO), którą można wycofać w dowolnym momencie.',
    recipientsTitle: '4. Odbiorcy i transfery danych',
    recipients:
      'W zależności od używanej funkcji odbiorcami danych mogą być: Vercel (hosting i wydajność), Google Cloud Vision (OCR) oraz Google Analytics (analityka po wyrażeniu zgody). Dostawcy ci mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym na podstawie odpowiednich mechanizmów prawnych i zabezpieczeń. WareCode nie sprzedaje danych osobowych.',
    retentionTitle: '5. Okres przechowywania',
    retention:
      'Dane lokalne pozostają na urządzeniu do czasu ich usunięcia przez użytkownika lub wyczyszczenia danych przeglądarki. Cookie językowe jest przechowywane do 12 miesięcy, a decyzja cookie do 6 miesięcy. Dane techniczne, OCR i analityczne są przechowywane zgodnie z konfiguracją i zasadami odpowiedniego dostawcy, nie dłużej niż jest to potrzebne do wskazanego celu.',
    cookiesTitle: '6. Cookies i pamięć urządzenia',
    cookieRows: [
      ['locale', 'Niezbędny', 'Zapamiętuje język aplikacji', '12 miesięcy'],
      ['warecode_cookie_consent', 'Niezbędny', 'Zapamiętuje decyzję dotyczącą cookies', '6 miesięcy'],
      ['_ga, _ga_*', 'Analityczny', 'Google Analytics — statystyki korzystania z aplikacji', 'Tylko po zgodzie; według ustawień Google Analytics'],
      ['localStorage', 'Funkcjonalny', 'Lokalne kody, loginy, hasła, godziny, ustawienia i zamknięte komunikaty', 'Do usunięcia przez użytkownika'],
      ['Service Worker Cache', 'Niezbędny', 'Tryb offline i szybsze uruchamianie PWA', 'Do aktualizacji lub usunięcia danych witryny'],
    ],
    tableHeaders: ['Nazwa', 'Kategoria', 'Cel', 'Czas'],
    manage: 'Zmień ustawienia cookies',
    rightsTitle: '7. Twoje prawa',
    rights:
      'Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, wniesienia sprzeciwu oraz wycofania zgody bez wpływu na zgodność wcześniejszego przetwarzania. Możesz także złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.',
    uodo: 'Strona Urzędu Ochrony Danych Osobowych',
    externalTitle: '8. Linki zewnętrzne i zmiany',
    external:
      'Aplikacja zawiera linki do zewnętrznych usług, m.in. App Store, Google Play, TestFlight, WhatsApp i mediów społecznościowych. Po otwarciu linku obowiązuje polityka prywatności danego dostawcy. Polityka może być aktualizowana wraz ze zmianami funkcji lub prawa; aktualna data jest podana na początku dokumentu.',
  },
  uk: {
    title: 'Політика конфіденційності та cookies',
    updated: 'Останнє оновлення: 20 червня 2026 р.',
    intro: 'Ця політика пояснює, які дані обробляються під час користування WareCode, з якою метою та які права ви маєте.',
    controllerTitle: '1. Контролер даних',
    controller: 'Контролером даних є Oleksii Burdeniuk. З питань конфіденційності: alejandroburdenyk@gmail.com.',
    dataTitle: '2. Які дані ми обробляємо',
    dataItems: [
      'Технічні дані для роботи й захисту сервісу: IP-адреса, браузер, пристрій, час і адреса запиту. Вони можуть оброблятися в логах Vercel.',
      'Обрана мова та рішення щодо cookies, збережені на пристрої.',
      'Коди, логіни, паролі, робочі години та налаштування зберігаються локально в браузері і не надсилаються на сервер без вашої дії. Не зберігайте дані, які ви не маєте права обробляти.',
      'Зображення, добровільно надіслані для OCR, передаються Google Cloud Vision. Застосунок не зберігає їх навмисно після запиту.',
      'Дані push-підписки лише після вашого добровільного ввімкнення сповіщень.',
      'Статистика Google Analytics і Vercel Speed Insights лише після згоди на аналітичні cookies.',
    ],
    purposesTitle: '3. Мета та правові підстави',
    purposes: 'Технічні дані обробляються для безпечної роботи сервісу на підставі законного інтересу (Art. 6(1)(f) GDPR). Дані для обраної функції — для виконання вашого запиту (Art. 6(1)(b)). Аналітика і push-сповіщення — на підставі згоди (Art. 6(1)(a)), яку можна відкликати.',
    recipientsTitle: '4. Одержувачі та передача даних',
    recipients: 'Залежно від функції дані можуть отримувати Vercel (хостинг), Google Cloud Vision (OCR) і Google Analytics (лише за згодою). Вони можуть обробляти дані поза ЄЕЗ з належними правовими гарантіями. WareCode не продає персональні дані.',
    retentionTitle: '5. Строк зберігання',
    retention: 'Локальні дані лишаються на пристрої до їх видалення. Cookie мови діє до 12 місяців, вибір cookies — 6 місяців. Техні, OCR та аналітичні дані зберігаються згідно з налаштуваннями відповідного постачальника.',
    cookiesTitle: '6. Cookies і пам’ять пристрою',
    cookieRows: [
      ['locale', 'Необхідний', 'Запам’ятовує мову', '12 місяців'],
      ['warecode_cookie_consent', 'Необхідний', 'Запам’ятовує вибір cookies', '6 місяців'],
      ['_ga, _ga_*', 'Аналітичний', 'Google Analytics', 'Лише за згодою; згідно з налаштуваннями Google'],
      ['localStorage', 'Функціональний', 'Коди, логіни, паролі, години, налаштування', 'До видалення'],
      ['Service Worker Cache', 'Необхідний', 'Офлайн-режим PWA', 'До оновлення або очищення'],
    ],
    tableHeaders: ['Назва', 'Категорія', 'Мета', 'Строк'],
    manage: 'Змінити налаштування cookies',
    rightsTitle: '7. Ваші права',
    rights: 'Ви маєте право на доступ, виправлення, видалення, обмеження, перенесення, заперечення та відкликання згоди. Ви також можете подати скаргу до польського Urząd Ochrony Danych Osobowych.',
    uodo: 'Сайт Urząd Ochrony Danych Osobowych',
    externalTitle: '8. Зовнішні посилання та зміни',
    external: 'Застосунок містить посилання на App Store, Google Play, TestFlight, WhatsApp і соцмережі. Після переходу діє політика відповідного постачальника. Політика може оновлюватися; дата наведена на початку.',
  },
  en: {
    title: 'Privacy and Cookie Policy', updated: 'Last updated: June 20, 2026',
    intro: 'This policy explains what data WareCode processes, why it is processed, and the rights available to you.',
    controllerTitle: '1. Data controller', controller: 'The data controller is Oleksii Burdeniuk. Privacy contact: alejandroburdenyk@gmail.com.',
    dataTitle: '2. Data we process',
    dataItems: ['Technical data needed to deliver and secure the service, including IP address, browser, device, request time and URL. Vercel may process this in hosting logs.', 'Your language and cookie choice stored on the device.', 'Codes, logins, passwords, work hours and settings stored locally in your browser. They are not sent to our server unless you deliberately use a feature requiring transmission. Do not save data you are not authorised to process.', 'Images voluntarily submitted for OCR are sent to Google Cloud Vision. The app does not intentionally retain them after the request.', 'Push subscription endpoint and device keys only after you enable notifications.', 'Google Analytics and Vercel Speed Insights data only after analytics consent.'],
    purposesTitle: '3. Purposes and legal bases', purposes: 'Technical data is processed to securely provide the service and prevent abuse under legitimate interests (GDPR Art. 6(1)(f)). Data required for a feature you request is processed to perform that request (Art. 6(1)(b)). Analytics and push notifications rely on consent (Art. 6(1)(a)), which you may withdraw at any time.',
    recipientsTitle: '4. Recipients and transfers', recipients: 'Depending on the feature, recipients may include Vercel (hosting), Google Cloud Vision (OCR), and Google Analytics (only with consent). They may process data outside the EEA using applicable legal safeguards. WareCode does not sell personal data.',
    retentionTitle: '5. Retention', retention: 'Local data remains on your device until you remove it. The language cookie lasts up to 12 months and the consent cookie up to 6 months. Technical, OCR and analytics data is retained under the relevant provider configuration and policy only as long as needed for the stated purpose.',
    cookiesTitle: '6. Cookies and device storage',
    cookieRows: [['locale', 'Essential', 'Remembers app language', '12 months'], ['warecode_cookie_consent', 'Essential', 'Remembers cookie choice', '6 months'], ['_ga, _ga_*', 'Analytics', 'Google Analytics usage statistics', 'Only with consent; per Google Analytics settings'], ['localStorage', 'Functional', 'Local codes, logins, passwords, hours, settings and dismissed notices', 'Until removed by the user'], ['Service Worker Cache', 'Essential', 'PWA offline mode', 'Until update or site-data removal']],
    tableHeaders: ['Name', 'Category', 'Purpose', 'Duration'], manage: 'Change cookie settings',
    rightsTitle: '7. Your rights', rights: 'You may request access, correction, deletion, restriction, portability, object to processing, and withdraw consent without affecting earlier lawful processing. You may also complain to the Polish data protection authority, Urząd Ochrony Danych Osobowych.',
    uodo: 'Polish Data Protection Authority website',
    externalTitle: '8. External links and changes', external: 'The app links to services including App Store, Google Play, TestFlight, WhatsApp and social networks. Their privacy policies apply after you follow a link. This policy may be updated as features or law change; the current date appears above.',
  },
} as const;

export default function PrivacyPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] ?? content.pl;

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <h1>{t.title}</h1>
        <p className={styles.updated}>{t.updated}</p>
        <p className={styles.lead}>{t.intro}</p>

        <Section title={t.controllerTitle}><p>{t.controller}</p></Section>
        <Section title={t.dataTitle}>
          <ul>{t.dataItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </Section>
        <Section title={t.purposesTitle}><p>{t.purposes}</p></Section>
        <Section title={t.recipientsTitle}><p>{t.recipients}</p></Section>
        <Section title={t.retentionTitle}><p>{t.retention}</p></Section>
        <Section title={t.cookiesTitle}>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr>{t.tableHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              <tbody>{t.cookieRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <button className={styles.manageButton} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>{t.manage}</button>
        </Section>
        <Section title={t.rightsTitle}>
          <p>{t.rights}</p>
          <a href='https://uodo.gov.pl/pl/83/155' target='_blank' rel='noopener noreferrer'>{t.uodo}</a>
        </Section>
        <Section title={t.externalTitle}><p>{t.external}</p></Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className={styles.section}><h2>{title}</h2>{children}</section>;
}

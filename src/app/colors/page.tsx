'use client';

import styles from './ColorsPage.module.css';
import { useTranslations } from 'next-intl';

const COLORS = [
  {
    number: 'MLA, MLB...',
    name: 'Kwiaty, wzory',
    color: 'linear-gradient(45deg, pink, yellow, lightblue)',
  },
  { number: '99', name: 'Czarny', color: '#000000' },
  { number: '00', name: 'Biały', color: '#ffffff' },
  { number: '01', name: 'Kremowy', color: '#fffdd0' },
  { number: '02', name: 'Jasny beżowy', color: '#f5deb3' },
  { number: '03', name: 'Róż', color: '#ffb6c1' },
  { number: '07', name: 'Jasny zielony', color: '#90ee90' },
  { number: '09', name: 'Jasny szary', color: '#d3d3d3' },
  { number: '23', name: 'Pomarańczowy', color: '#ffa500' },
  { number: '42', name: 'Różowy', color: '#ff69b4' },
  { number: '49', name: 'Fiolet', color: '#800080' },
  { number: '50/55', name: 'Niebieski', color: '#1e90ff' },
  { number: '59', name: 'Granatowy', color: '#000080' },
  { number: '67', name: 'Turkus', color: '#40e0d0' },
  { number: '69', name: 'Ciemny turkus', color: '#008b8b' },
  { number: '70', name: 'Jasny zielony', color: '#98fb98' },
  { number: '77', name: 'Zielony', color: '#008000' },
  { number: '79', name: 'Ciemny zielony', color: '#006400' },
  { number: '80', name: 'Beż', color: '#f5f5dc' },
  { number: '82/88', name: 'Brązowy', color: '#8b4513' },
  { number: '87', name: 'Wojskowy', color: '#4b5320' },
  { number: '89', name: 'Ciemny brąz', color: '#5c4033' },
  { number: '90', name: 'Szary', color: '#808080' },
  { number: '93', name: 'Bordowy', color: '#800000' },
  { number: '94', name: 'Stalowy fiolet', color: '#6a5acd' },
  { number: '95', name: 'Stalowy niebieski', color: '#4682b4' },
  { number: '96', name: 'Stalowa zieleń', color: '#2e8b57' },
  { number: '97', name: 'Zgniła zieleń', color: '#556b2f' },
];

const ASSORTMENT = [
  { type: 'Damski', code: 'TSD, KKD' },
  { type: 'Męski', code: 'TSM, KKM' },
  { type: 'Inne', code: 'ROU, PCU' },
];

export default function ColorsPage() {
  const t = useTranslations('ColorsPage');
  const tColors = useTranslations('Colors');
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.section}>
          <h2>{t('assortmentTitle')}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('type')}</th>
                <th>{t('code')}</th>
              </tr>
            </thead>
            <tbody>
              {ASSORTMENT.map((a) => (
                <tr key={a.type}>
                  <td>{a.type}</td>
                  <td>{a.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>{t('colorsTitle')}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('number')}</th>
                <th>{t('color')}</th>
                <th>{t('preview')}</th>
              </tr>
            </thead>
            <tbody>
              {COLORS.map((c) => (
                <tr key={c.number}>
                  <td>{c.number}</td>
                  <td>
                    {c.number === 'MLA, MLB...'
                      ? tColors('MLA_MLB')
                      : tColors(c.number)}
                  </td>

                  <td>
                    <div
                      className={styles.colorCircle}
                      style={{
                        background: c.color,
                        border:
                          c.color === '#ffffff' ? '1px solid #ccc' : 'none',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.infoBox}>
          <p>{t('infoBox')}</p>
        </div>
      </div>
    </div>
  );
}

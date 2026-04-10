import { Info, Barcode, MapPin, Package, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './EmptyStatus.module.css';

export default function EmptyStatus() {
  const t = useTranslations('EmptyStatus');

  const formats = [
    {
      icon: <MapPin size={18} />,
      key: 'location',
      example: 'А112-Y-A',
    },
    {
      icon: <Package size={18} />,
      key: 'carrier',
      example: 'P-02037, M0291, PO/26/02/11/0454',
    },
    {
      icon: <Barcode size={18} />,
      key: 'article',
      example: 'RS26-MKM720-SAND-S',
    },
    { icon: <RefreshCcw size={18} />, key: 'ean', example: '5901234567890' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Info className={styles.infoIcon} size={32} />
        <h3>{t('title')}</h3>
        <p>{t('description')}</p>
      </div>

      <div className={styles.formatsGrid}>
        <span className={styles.gridTitle}>{t('supportedFormats')}:</span>
        {formats.map((item) => (
          <div key={item.key} className={styles.formatItem}>
            <div className={styles.iconWrapper}>{item.icon}</div>
            <div className={styles.formatText}>
              <span className={styles.formatLabel}>
                {t(`formats.${item.key}`)}
              </span>
              <code className={styles.example}>{item.example}</code>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.footerText}>{t('footer')}</p>
    </div>
  );
}

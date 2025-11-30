'use client';

import { Image as ImageIcon, Save } from 'lucide-react';
import styles from './BarcodeInput.module.css';
import { useTranslations } from 'next-intl';

interface BarcodeInputProps {
  text: string;
  setText: (value: string) => void;
  onInputFocus: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function BarcodeInput({
  text,
  setText,
  onInputFocus,
  handleFileChange,
  handleSave,
  fileInputRef,
}: BarcodeInputProps) {
  const t = useTranslations('BarcodeInput');

  return (
    <div className={styles.inputWrapper}>
      <input
        name='input'
        type='text'
        placeholder={t('placeholder')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.input}
        onFocus={onInputFocus}
      />

      <button
        type='button'
        className={styles.iconButton}
        title={t('uploadButton')}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </button>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        type='button'
        className={styles.saveButton}
        title={t('saveButton')}
        onClick={() => handleSave(text)}
      >
        <Save size={18} />
      </button>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import styles from './page.module.css';
import SavedCodes from './components/SavedCodes';
import { compressImage } from './utils/compressImage';
import { recognizePlaceNumber } from './utils/recognizePlaceNumber';
import generateBarcode from './utils/generateBarcode';
import BarcodeInput from './components/BarcodeInput';
import { useTranslations } from 'next-intl';

export default function BarcodePage() {
  const [text, setText] = useState('');
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [decoding, setDecoding] = useState(false);
  const t = useTranslations('HomePage');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const noFoundMessage = t('noFoundMessage');

  // --- Generowanie kodu kreskowego ---
  useEffect(() => {
    generateBarcode(svgRef.current, text);
  }, [text]);

  // --- Ładowanie / zapisywanie w localStorage ---
  useEffect(() => {
    const stored = localStorage.getItem('savedCodes');
    if (stored) setSavedCodes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  const goToColors = () => {
    window.location.href = '/colors';
  };

  // --- Obsługa pliku i rozpoznawanie kodu ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDecoding(true);
    try {
      // 1️⃣ Kompresja
      const compressed = await compressImage(file);
      const compressedFile = new File([compressed], file.name, {
        type: 'image/jpeg',
      });

      // 2️⃣ Próba odczytu kodu kreskowego
      const imageUrl = URL.createObjectURL(compressedFile);
      const image = new Image();
      image.src = imageUrl;

      const codeReader = new BrowserMultiFormatReader();

      const result = await new Promise<string | null>((resolve) => {
        image.onload = async () => {
          try {
            const decoded = await codeReader.decodeFromImageElement(image);
            resolve(decoded.getText());
          } catch {
            resolve(null);
          }
        };
        image.onerror = () => resolve(null);
      });

      URL.revokeObjectURL(imageUrl);

      if (result) {
        setText(result);
      } else {
        // 3️⃣ Jeśli nie znaleziono kodu kreskowego → OCR
        const formData = new FormData();
        formData.append('file', compressedFile);

        const res = await fetch('/api/ocr', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        const recognizedText = recognizePlaceNumber(data.text);
        setText(recognizedText);
        handleSave(recognizedText);
      }
    } catch (err) {
      console.error('Błąd przetwarzania:', err);
      alert('Nie udało się przetworzyć obrazu');
    }

    setDecoding(false);
  };

  // --- Zapisywanie / usuwanie kodów ---
  const handleSave = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === noFoundMessage) return;
    if (trimmed && !savedCodes.includes(trimmed)) {
      setSavedCodes((prev) => [trimmed, ...prev]);
    }
  };

  const handleDelete = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleSelect = (code: string) => setText(code);
  const onInputFocus = () => {
    if (text === noFoundMessage) {
      setText('');
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('title')}</h1>

          <BarcodeInput
            text={text}
            setText={setText}
            onInputFocus={onInputFocus}
            handleFileChange={handleFileChange}
            handleSave={handleSave}
            fileInputRef={fileInputRef}
          />

          {decoding && <p className={styles.loading}>{t('decodingMessage')}</p>}

          <div className={styles.barcodeWrapper}>
            <svg ref={svgRef}></svg>
          </div>

          <SavedCodes
            savedCodes={savedCodes}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <button
        className={styles.colorBtn}
        onClick={goToColors}
        aria-label={t('colorsButtonAria')}
      >
        <svg
          className={styles.paletteIcon}
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='12' cy='6' r='4' fill='#ff595e' />
          <circle cx='6' cy='14' r='4' fill='#8ac926' />
          <circle cx='18' cy='14' r='4' fill='#1982c4' />
          <circle cx='12' cy='18' r='4' fill='#ffca3a' />
        </svg>
      </button>
    </div>
  );
}

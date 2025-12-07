'use client';

import { useEffect, useRef, useState } from 'react';
import BarcodeInput from '../BarcodeInput';
import SavedCodes from '../SavedCodes';
import { useTranslations } from 'next-intl';
import generateBarcode from '@/app/utils/generateBarcode';
import { compressImage } from '@/app/utils/compressImage';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { recognizePlaceNumber } from '@/app/utils/recognizePlaceNumber';
import styles from './BarCodeContent.module.css';

const BarCodeContent = () => {
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

  const handleDelete = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleSelect = (code: string) => setText(code);
  const onInputFocus = () => {
    if (text === noFoundMessage) {
      setText('');
    }
  };
  // --- Zapisywanie / usuwanie kodów ---
  const handleSave = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === noFoundMessage) return;
    if (trimmed && !savedCodes.includes(trimmed)) {
      setSavedCodes((prev) => [trimmed, ...prev]);
    }
  };

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

  return (
    <>
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
    </>
  );
};

export default BarCodeContent;

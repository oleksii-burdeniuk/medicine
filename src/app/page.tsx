'use client';

import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Image as ImageIcon, Trash2, Save } from 'lucide-react';
import styles from './page.module.css';

export default function BarcodePage() {
  const [text, setText] = useState('');
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [decoding, setDecoding] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Генерація штрихкоду ---
  const generateBarcode = () => {
    if (svgRef.current && text) {
      try {
        JsBarcode(svgRef.current, text, {
          format: 'CODE128',
          lineColor: '#000',
          width: 2,
          height: 80,
          displayValue: true,
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    } else if (svgRef.current) {
      svgRef.current.innerHTML = '';
    }
  };

  useEffect(() => {
    generateBarcode();
  }, [text]);

  // --- Завантаження збережених кодів ---
  useEffect(() => {
    const stored = localStorage.getItem('savedCodes');
    if (stored) {
      try {
        setSavedCodes(JSON.parse(stored));
      } catch {
        console.warn('Помилка при читанні збережених кодів');
      }
    }
  }, []);

  // --- Збереження кодів у localStorage ---
  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  // текст патер

  const recognizePlaceNumber = (text: string) => {
    const regex = /\b[A-Z]{2}\/\d{2}\/\d{2}\/\d{2}\/\d{4}\b/;
    const foundMatch = text.match(regex);
    if (foundMatch) {
      const extractedCode = foundMatch[0];
      console.log('Вилучений код:', extractedCode);
      return extractedCode;
      // Вивід: PK/25/04/23/0313
    } else {
      console.log('Код за вказаним патерном не знайдено.');
      return 'Щось пішло не так';
    }
  };

  // --- Визначити текст на фото ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDecoding(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    const barCodeText = recognizePlaceNumber(data.text);
    setText(barCodeText || 'Нічого не знайдено 😕');
    setDecoding(false);
  };

  // --- Обробка вибору зображення ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDecoding(true);
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;

    image.onload = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        const result = await codeReader.decodeFromImageElement(image);
        const decodedText = result.getText();
        setText(decodedText);
        setDecoding(false);
      } catch (err) {
        handleUpload(e);
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    };

    image.onerror = () => {
      alert('Не вдалося завантажити зображення.');
      setDecoding(false);
      URL.revokeObjectURL(imageUrl);
    };
  };

  // --- Зберегти код ---
  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed && !savedCodes.includes(trimmed)) {
      setSavedCodes((prev) => [trimmed, ...prev]);
    }
  };

  // --- Видалити код ---
  const handleDelete = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  // --- Вибрати код зі списку ---
  const handleSelect = (code: string) => {
    setText(code);
  };

  return (
    <div>
      {/* --- Розклад перерв --- */}
      <div className={styles.breakContainer}>
        <span>Перерва 1: (8:20 - 08:35)</span>
        <span>Перерва 2: (11:20 - 11:40)</span>
      </div>

      {/* --- Основний контейнер --- */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Генератор / Сканер Штрихкодів</h1>

          <div className={styles.inputWrapper}>
            <input
              name='input'
              type='text'
              placeholder='Введи або зчитай код'
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.input}
            />

            <button
              type='button'
              className={styles.iconButton}
              title='Завантажити зображення'
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
              title='Зберегти код'
              onClick={handleSave}
            >
              <Save size={18} />
            </button>
          </div>

          {decoding && (
            <p className={styles.loading}>🔍 Зчитування коду, зачекай...</p>
          )}

          {/* --- Відображення штрихкоду --- */}
          <div className={styles.barcodeWrapper}>
            <svg ref={svgRef}></svg>
          </div>

          {/* --- Список збережених кодів --- */}
          {savedCodes.length > 0 && (
            <div className={styles.savedList}>
              <h2>Збережені коди</h2>
              <ul className={styles.list}>
                {savedCodes.map((code, index) => (
                  <li key={code} className={styles.listItem}>
                    <span
                      onClick={() => handleSelect(code)}
                      className={styles.codeText}
                    >
                      {index + 1}: {code}
                    </span>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(code)}
                      title='Видалити'
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

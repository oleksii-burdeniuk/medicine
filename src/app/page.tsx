'use client';

import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Image as ImageIcon, Trash2, Save } from 'lucide-react';
import styles from './page.module.css';

export default function BarcodePage() {
  const [text, setText] = useState('');
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Generate barcode from text ---
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

  // --- Load saved codes from localStorage on mount ---
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

  // --- Save codes to localStorage whenever they change ---
  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  // --- Handle file upload and decode image ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeFromImageUrl(imageUrl);
      const decodedText = result.getText();
      setText(decodedText);
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      console.error('Помилка сканування з зображення:', err);
      alert('Не вдалося зчитати штрихкод або QR-код з зображення.');
    }
  };

  // --- Add current code to list ---
  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed && !savedCodes.includes(trimmed)) {
      setSavedCodes((prev) => [...prev, trimmed]);
    }
  };

  // --- Delete code from list ---
  const handleDelete = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  // --- Select code from list ---
  const handleSelect = (code: string) => {
    setText(code);
  };

  return (
    <div>
      <div className={styles.breakContainer}>
        <h3>Перерва:</h3>
        <span>8:20 - 08:35</span>
        <span>11:20 - 1:40</span>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Згенеруй Штрихкод</h1>

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

          <div className={styles.barcodeWrapper}>
            <svg ref={svgRef}></svg>
          </div>

          {/* --- List of saved codes --- */}
          {savedCodes.length > 0 && (
            <div className={styles.savedList}>
              <h2>Збережені коди</h2>
              <ul className={styles.list}>
                {savedCodes.map((code) => (
                  <li key={code} className={styles.listItem}>
                    <span
                      onClick={() => handleSelect(code)}
                      className={styles.codeText}
                    >
                      {code}
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

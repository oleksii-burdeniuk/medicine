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

  // --- Kompresja obrazu ---
  const compressImage = (
    file: File,
    maxSize = 600,
    quality = 0.5
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Brak kontekstu canvas');

          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          const width = img.width * scale;
          const height = img.height * scale;

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject('Kompresja nie powiodła się');
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Generowanie kodu kreskowego ---
  const generateBarcode = () => {
    if ((svgRef.current && text) || '1234567890') {
      try {
        JsBarcode(svgRef.current, text || '1234567890', {
          format: 'CODE128',
          lineColor: '#000',
          width: 2,
          height: 80,
          displayValue: true,
        });
      } catch (err) {
        console.error('Błąd generowania kodu kreskowego:', err);
      }
    } else if (svgRef.current) {
      svgRef.current.innerHTML = '';
    }
  };

  useEffect(() => {
    generateBarcode();
  }, [text]);

  // --- Ładowanie / zapisywanie w localStorage ---
  useEffect(() => {
    const stored = localStorage.getItem('savedCodes');
    if (stored) setSavedCodes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  // --- Wyszukiwanie numeru miejsca (PK/25/04/23/0813) ---
  const recognizePlaceNumber = (text: string) => {
    const regex = /\b[A-Z]{2}\/\d{2}\/\d{2}\/\d{2}\/\d{4}\b/;
    const found = text.match(regex);
    return found ? found[0] : 'Nic nie znaleziono 😕';
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
        setText(recognizePlaceNumber(data.text));
      }
    } catch (err) {
      console.error('Błąd przetwarzania:', err);
      alert('Nie udało się przetworzyć obrazu');
    }

    setDecoding(false);
  };

  // --- Zapisywanie / usuwanie kodów ---
  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed && !savedCodes.includes(trimmed)) {
      setSavedCodes((prev) => [trimmed, ...prev]);
    }
  };

  const handleDelete = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleSelect = (code: string) => setText(code);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Generator kodów kreskowych</h1>

          <div className={styles.inputWrapper}>
            <input
              name='input'
              type='text'
              placeholder='Wpisz lub zeskanuj kod'
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.input}
            />

            <button
              type='button'
              className={styles.iconButton}
              title='Załaduj obraz'
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
              title='Zapisz kod'
              onClick={handleSave}
            >
              <Save size={18} />
            </button>
          </div>

          {decoding && (
            <p className={styles.loading}>
              🔍 Odczytywanie kodu, proszę czekać...
            </p>
          )}

          <div className={styles.barcodeWrapper}>
            <svg ref={svgRef}></svg>
          </div>

          {savedCodes.length > 0 && (
            <div className={styles.savedList}>
              <h2>Zapisane kody</h2>
              <ul className={styles.list}>
                {savedCodes.map((code, i) => (
                  <li key={code} className={styles.listItem}>
                    <span
                      onClick={() => handleSelect(code)}
                      className={styles.codeText}
                    >
                      {i + 1}: {code}
                    </span>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(code)}
                      title='Usuń'
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

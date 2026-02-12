'use client';

import { useEffect, useRef, useState } from 'react';
import BarcodeInput from '../BarcodeInput';
import SavedCodes from '../SavedCodes';
import SavedUsers from '../SavedUsers';
import { useTranslations } from 'next-intl';
import generateBarcode from '@/app/utils/generateBarcode';
import { compressImage } from '@/app/utils/compressImage';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { recognizePlaceNumber } from '@/app/utils/recognizePlaceNumber';
import styles from './BarCodeContent.module.css';
import { QrCode, User } from 'lucide-react';

interface SavedUser {
  login: string;
  password: string;
}
// Виправив типи для відповідності вашим умовам у рендері
type ViewMode = 'savedCodes' | 'savedUsers';

const BarCodeContent = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState(''); // Стейт для пароля
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('savedCodes');
  const [decoding, setDecoding] = useState(false);

  const t = useTranslations('HomePage');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const noFoundMessage = t('noFoundMessage');

  useEffect(() => {
    generateBarcode(svgRef.current, text);
  }, [text]);

  // Завантаження даних
  useEffect(() => {
    const storedCodes = localStorage.getItem('savedCodes');
    const storedUsers = localStorage.getItem('savedUsers');
    if (storedCodes) setSavedCodes(JSON.parse(storedCodes));
    if (storedUsers) setSavedUsers(JSON.parse(storedUsers));
  }, []);

  // Збереження даних
  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  useEffect(() => {
    localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
  }, [savedUsers]);

  // --- ЛОГІКА ЗБЕРЕЖЕННЯ ---
  const handleSave = (inputText: string) => {
    const trimmed = inputText.trim();
    if (!trimmed || trimmed === noFoundMessage) return;

    if (viewMode === 'savedCodes') {
      if (!savedCodes.includes(trimmed)) {
        setSavedCodes((prev) => [trimmed, ...prev]);
      }
    } else {
      // Режим збереження користувача
      if (password.trim() === '') {
        alert('Please enter a password');
        return;
      }
      if (!savedUsers.find((u) => u.login === trimmed)) {
        setSavedUsers((prev) => [
          { login: trimmed, password: password.trim() },
          ...prev,
        ]);
        setPassword(''); // Очищуємо пароль після збереження
      }
    }
  };

  const handleDeleteCode = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleDeleteUser = (login: string) => {
    setSavedUsers((prev) => prev.filter((u) => u.login !== login));
  };

  const handleSelectUser = (value: string) => {
    setText(value);
  };

  // --- ФОТО / OCR ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDecoding(true);
    try {
      const compressed = await compressImage(file);
      const compressedFile = new File([compressed], file.name, {
        type: 'image/jpeg',
      });
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
        const formData = new FormData();
        formData.append('file', compressedFile);
        const res = await fetch('/api/ocr', { method: 'POST', body: formData });
        const data = await res.json();
        const recognizedText = recognizePlaceNumber(data.text);
        setText(recognizedText);
        // Автоматично не зберігаємо, щоб юзер міг ввести пароль якщо треба
      }
    } catch (err) {
      console.error(err);
    }
    setDecoding(false);
  };

  return (
    <div className={styles.container}>
      {/* ТУМБЛЕР ПЕРЕКЛЮЧЕННЯ */}
      <div className={styles.toggleWrapper}>
        <button
          className={viewMode === 'savedCodes' ? styles.activeTab : styles.tab}
          onClick={() => setViewMode('savedCodes')}
          title='Codes'
        >
          <QrCode size={18} />
        </button>
        <button
          className={viewMode === 'savedUsers' ? styles.activeTab : styles.tab}
          onClick={() => setViewMode('savedUsers')}
          title='Users'
        >
          <User size={18} />
        </button>
      </div>

      <BarcodeInput
        text={text}
        setText={setText}
        onInputFocus={() => text === noFoundMessage && setText('')}
        handleFileChange={handleFileChange}
        handleSave={handleSave}
        fileInputRef={fileInputRef}
      />

      {/* ПОЛЕ ПАРОЛЯ (показуємо лише в режимі Users) */}
      {viewMode === 'savedUsers' && (
        <input
          type='text'
          placeholder='Password...'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.passwordInput}
        />
      )}

      {decoding && <p className={styles.loading}>{t('decodingMessage')}</p>}

      <div className={styles.barcodeWrapper}>
        <svg ref={svgRef}></svg>
      </div>

      {/* ВІДОБРАЖЕННЯ СПИСКІВ */}
      {viewMode === 'savedUsers' ? (
        <SavedUsers
          savedUsers={savedUsers}
          onSelect={handleSelectUser}
          onDelete={handleDeleteUser}
        />
      ) : (
        <SavedCodes
          savedCodes={savedCodes}
          onSelect={(code) => setText(code)}
          onDelete={handleDeleteCode}
        />
      )}
    </div>
  );
};

export default BarCodeContent;

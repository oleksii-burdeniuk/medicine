'use client';

import { useEffect, useRef, useState } from 'react';
import BarcodeInput from '../BarcodeInput';
import SavedCodes from '../SavedCodes';
import SavedUsers from '../SavedUsers';
import { useTranslations } from 'next-intl';
import generateBarcode from '@/app/utils/generateBarcode';
import styles from './BarCodeContent.module.css';
import { List, QrCode, User } from 'lucide-react';
import Modal from '../modalWindow/Modal';
import ListCodes from '../listCodes/ListCodes';
import { processUploadedImage } from './processUploadedImage';
import { useScannerStorage, type ViewMode } from './useScannerStorage';
import { event } from '@/app/libs/analytics/gtag';
import { EVENTS } from '@/app/libs/analytics/events';

const BarCodeContent = () => {
  const [text, setText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('savedCodes');
  const [decoding, setDecoding] = useState(false);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [listCodes, setListCodes] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const t = useTranslations('HomePage');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const noFoundMessage = t('noFoundMessage');
  const {
    password,
    setPassword,
    savedCodes,
    savedUsers,
    saveEntry,
    deleteCode,
    clearCodes,
    deleteUser,
    clearUsers,
    setSavedCodes,
  } = useScannerStorage(noFoundMessage);

  useEffect(() => {
    generateBarcode(svgRef.current, text);
  }, [text]);

  const handleSave = (inputText: string) => {
    saveEntry(inputText, viewMode);
    event(EVENTS.SAVE_CLICK);
  };

  const handleDeleteCode = (code: string) => {
    deleteCode(code);
    event(EVENTS.DELETE_CLICK);
  };

  const handleDeleteUser = (login: string) => {
    deleteUser(login);
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
      const { recognizedText, uniqueCodes, source } =
        await processUploadedImage(file);

      // Check if nothing was found
      const noFoundMessage = 'Nic nie znaleziono 😕';
      if (recognizedText === noFoundMessage && uniqueCodes.length === 0) {
        // Show toast notification for 2 seconds
        setToastMessage(t('noFoundMessage'));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        return;
      }

      // Always show all found codes in the list if there are multiple
      if (uniqueCodes.length > 0) {
        setListCodes(uniqueCodes);
        // setActiveModal(true); // Auto-open modal when codes are found
      }

      // Шукаємо патерн: P, цифри, потім групи зі слешем та цифрами
const codePattern = /P[A-Z]\/\d{2}\/\d{2}\/\d{2}\/\d{4}/;
const match = recognizedText.match(codePattern);

if (match) {
  // Якщо знайшли код (наприклад, P0/26/03/02/0592), ставимо тільки його
  setText(match[0]);
} else {
  // Якщо специфічного коду немає, ставимо весь розпізнаний текст
  setText(recognizedText);
}

      // Auto-save if it's from OCR and we're in savedCodes mode
      if (source === 'ocr' && viewMode === 'savedCodes' && recognizedText) {
        saveEntry(recognizedText, 'savedCodes');
      }
    } catch (error) {
      console.error('File processing error:', error);
    } finally {
      setDecoding(false);
      e.target.value = '';
    }
  };

  const openListModal = () => {
    event(EVENTS.LIST_CLICK);
    if (listCodes.length > 0) {
      setActiveModal(true);
      event(EVENTS.LIST_CLICK);
    }
  };

  const closeListModal = () => {
    setActiveModal(false);
  };

  const saveAllCodes = (codes: string[]) => {
    setSavedCodes((prev) => {
      const merged = [...codes, ...prev];
      return Array.from(new Set(merged));
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.toggleWrapper}>
        <button
          className={viewMode === 'savedCodes' ? styles.activeTab : styles.tab}
          onClick={() => {
            setViewMode('savedCodes');
            event(EVENTS.SCANNER_CLICK);
          }}
          title='Codes'
        >
          <QrCode size={18} />
        </button>
        <button
          className={activeModal ? styles.activeTab : styles.tab}
          onClick={openListModal}
          title='listButton'
        >
          <List size={18} color={listCodes.length > 0 ? '#007bff' : '#ccc'} />
<listCodes.length+1}</span>
        </button>
        <button
          className={viewMode === 'savedUsers' ? styles.activeTab : styles.tab}
          onClick={() => {
            setViewMode('savedUsers');
            event(EVENTS.USER_CLICK);
          }}
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

      <Modal isOpen={activeModal} onClose={closeListModal}>
        <ListCodes
          listCodes={listCodes}
          savedCodes={savedCodes}
          selectedCode={text}
          onSelect={(code) =>setText(code) }
          onSave={handleSave}
          onSaveAll={saveAllCodes}
        />
      </Modal>

      {viewMode === 'savedUsers' ? (
        <SavedUsers
          savedUsers={savedUsers}
          onSelect={handleSelectUser}
          onDelete={handleDeleteUser}
          onClearAll={clearUsers}
        />
      ) : (
        <SavedCodes
          savedCodes={savedCodes}
          selectedCode={text}
          onSelect={(code) => setText(code)}
          onDelete={handleDeleteCode}
          onClearAll={clearCodes}
        />
      )}

      {/* Toast notification */}
      {showToast && <div className={styles.toast}>{toastMessage}</div>}
    </div>
  );
};

export default BarCodeContent;

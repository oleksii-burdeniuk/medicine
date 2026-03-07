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

const BarCodeContent = () => {
  const [text, setText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('savedCodes');
  const [decoding, setDecoding] = useState(false);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [listCodes, setListCodes] = useState<string[]>([]);

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
    deleteUser,
    setSavedCodes,
  } = useScannerStorage(noFoundMessage);

  useEffect(() => {
    generateBarcode(svgRef.current, text);
  }, [text]);

  const handleSave = (inputText: string) => {
    saveEntry(inputText, viewMode);
  };

  const handleDeleteCode = (code: string) => {
    deleteCode(code);
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

      if (uniqueCodes.length > 1) {
        setListCodes(uniqueCodes);
      }

      setText(recognizedText);

      if (source === 'ocr' && viewMode === 'savedCodes') {
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
    if (listCodes.length > 0) {
      setActiveModal(true);
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
          onClick={() => setViewMode('savedCodes')}
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
          onSelect={(code) => setText(code)}
          onSave={handleSave}
          onSaveAll={saveAllCodes}
        />
      </Modal>

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

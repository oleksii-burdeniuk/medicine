'use client';

import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera } from 'lucide-react';
import styles from './page.module.css';

export default function BarcodePage() {
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // --- Generate barcode ---
  useEffect(() => {
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
  }, [text]);

  // --- Start scanner ---
  const startScan = async () => {
    try {
      setScanning(true);

      // Create a single persistent reader
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Try to use the back camera on mobile
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes('back')
      );

      const deviceId = backCamera?.deviceId || devices[0]?.deviceId;
      if (!deviceId) {
        alert('No camera found on this device.');
        setScanning(false);
        return;
      }

      // Start scanning once
      const result = await codeReader.decodeOnceFromVideoDevice(
        deviceId,
        videoRef.current!
      );

      const value = result.getText();
      setText(value);
      stopScan(); // stop camera after successful scan
    } catch (err) {
      if (err) {
        alert(`Помилка сканування:'невідома помилка'}`);
      }
      stopScan();
    }
  };

  // --- Stop scanner and camera stream ---
  const stopScan = () => {
    setScanning(false);
    if (codeReaderRef.current) {
      codeReaderRef.current = null;
    }

    // extra safety: stop all video tracks
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current!.srcObject = null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Штрихкод Генератор / Сканер</h1>

        <div className={styles.inputWrapper}>
          <input
            name='input'
            type='text'
            placeholder='Введи або відскануй код'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.input}
          />
          <button
            type='button'
            className={styles.iconButton}
            onClick={startScan}
            title='Сканувати штрихкод'
          >
            <Camera size={20} />
          </button>
        </div>

        {scanning && (
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              muted
              playsInline
            />
            <button onClick={stopScan} className={styles.stopButton}>
              Зупинити
            </button>
          </div>
        )}

        <div className={styles.barcodeWrapper}>
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}

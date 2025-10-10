'use client';

import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import styles from './page.module.css';

export default function BarcodePage() {
  const [text, setText] = useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Barcode Generator</h1>
        <input
          type='text'
          placeholder='Enter text for barcode'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
        />
        <div className={styles.barcodeWrapper}>
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}

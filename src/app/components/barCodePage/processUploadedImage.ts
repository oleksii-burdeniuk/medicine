import { BrowserMultiFormatReader } from '@zxing/browser';
import { compressImage } from '@/app/utils/compressImage';
import {
  extractUniqueCodes,
  recognizePlaceNumber,
} from '@/app/utils/recognizePlaceNumber';

async function decodeBarcodeFromImage(file: File) {
  const imageUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = imageUrl;
  const codeReader = new BrowserMultiFormatReader();

  const barcodeTexts: string[] = [];

  await new Promise<void>((resolve) => {
    image.onload = async () => {
      try {
        // Try to decode multiple barcodes by attempting multiple reads
        // ZXing doesn't natively support multiple barcodes, but we can try different approaches
        const decoded = await codeReader.decodeFromImageElement(image);
        if (decoded) {
          barcodeTexts.push(decoded.getText());
        }
      } catch {
        // No barcode found
      }
      resolve();
    };
    image.onerror = () => resolve();
  });

  URL.revokeObjectURL(imageUrl);
  return barcodeTexts;
}

async function recognizeTextViaOcr(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/ocr', { method: 'POST', body: formData });
  if (!response.ok) {
    throw new Error(`OCR request failed: ${response.status}`);
  }

  const payload = await response.json();
  const rawText = typeof payload?.text === 'string' ? payload.text : '';
  const uniqueCodes = extractUniqueCodes(rawText);
  const recognizedText = recognizePlaceNumber(rawText);

  return { recognizedText, uniqueCodes };
}

export async function processUploadedImage(file: File) {
  const compressed = await compressImage(file);
  const compressedFile = new File([compressed], file.name, {
    type: 'image/jpeg',
  });

  const barcodeTexts = await decodeBarcodeFromImage(compressedFile);
  if (barcodeTexts.length > 0) {
    return {
      recognizedText: barcodeTexts[0], // Keep first one for backward compatibility
      uniqueCodes: barcodeTexts, // Return all found barcodes
      source: 'barcode' as const,
    };
  }

  const ocrResult = await recognizeTextViaOcr(compressedFile);
  return {
    ...ocrResult,
    source: 'ocr' as const,
  };
}

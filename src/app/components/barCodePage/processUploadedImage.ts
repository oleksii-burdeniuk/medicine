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

  const barcodeText = await new Promise<string | null>((resolve) => {
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
  return barcodeText;
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

  const barcodeText = await decodeBarcodeFromImage(compressedFile);
  if (barcodeText) {
    return {
      recognizedText: barcodeText,
      uniqueCodes: [] as string[],
      source: 'barcode' as const,
    };
  }

  const ocrResult = await recognizeTextViaOcr(compressedFile);
  return {
    ...ocrResult,
    source: 'ocr' as const,
  };
}

// --- Kompresja obrazu ---
export const compressImage = (
  file: File,
  maxSize = 1200,
  quality = 0.6,
  forControl = false,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Brak kontekstu canvas');

        // Для control мінімальне стиснення для кращого OCR
        const effectiveMaxSize = forControl
          ? Math.max(img.width, img.height)
          : maxSize;
        const effectiveQuality = forControl ? 0.9 : quality;

        const scale = Math.min(
          effectiveMaxSize / img.width,
          effectiveMaxSize / img.height,
          1,
        );
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
          effectiveQuality,
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

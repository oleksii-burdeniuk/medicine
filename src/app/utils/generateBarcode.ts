// utils/generateBarcode.ts
import JsBarcode from 'jsbarcode';

const generateBarcode = (svgElement: SVGSVGElement | null, text: string) => {
  if (!svgElement) return;

  const code = text.trim() || '1234567890';

  try {
    JsBarcode(svgElement, code, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 80,
      displayValue: true,
    });
  } catch (err) {
    console.error('Error generating barcode:', err);
    svgElement.innerHTML = '';
  }
};
export default generateBarcode;

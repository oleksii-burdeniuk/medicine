import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
// const credentials = JSON.parse(fs.readFileSync('google-key.json', 'utf8'));
const credentials = process.env.GOOGLE_CREDENTIALS_JSON;

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    if (!file)
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    // Читаємо файл у буфер
    console.log('// Читаємо файл у буфер');
    const bytes = Buffer.from(await file.arrayBuffer());

    const client = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(credentials),
    });

    const [result] = await client.textDetection({ image: { content: bytes } });
    const detections = result.textAnnotations || [];

    const recognizedText = detections[0]?.description || 'No text detected';

    return NextResponse.json({ text: recognizedText });
  } catch (err) {
    console.error('OCR error:', err);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

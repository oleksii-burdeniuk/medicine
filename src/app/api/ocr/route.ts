import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

let visionClient: InstanceType<typeof vision.ImageAnnotatorClient> | null = null;
function getVisionClient() {
  if (visionClient) return visionClient;

  const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!credentialsJsonString) {
    throw new Error('GOOGLE_CREDENTIALS_JSON is not configured');
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJsonString) as Record<string, unknown>;
  } catch {
    throw new Error('GOOGLE_CREDENTIALS_JSON is not valid JSON');
  }

  visionClient = new vision.ImageAnnotatorClient({ credentials });
  return visionClient;
}

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Max size is 5MB.' },
        { status: 413 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const client = getVisionClient();
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

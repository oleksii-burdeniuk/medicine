import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    // Використовуємо v1alpha для доступу до нових фішок Gemini 3
    const url = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const prompt = `
      Analyze this WMS screen image and extract all rows from the table.
      Return ONLY a JSON array of objects with these keys:
      login (uppercase), uzytkownik, dzial (string or null), numerReferencyjny, status, nosnikNumer, wynikPozytywny (boolean based on checkbox), daneWejsciowe (object like {"IleRazyDziennie": X}), dodaneKiedy, kontrahent.
      
      Important:
      - Recognize checkboxes in 'Wynik Pozytywny' column (checked = true).
      - Extract the 'Ile razy dziennie' value from the 'Dane wejściowe' column.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Image,
                },
                // Нова фішка Gemini 3: висока роздільна здатність для дрібного тексту
                mediaResolution: { level: 'media_resolution_high' },
              },
            ],
          },
        ],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'minimal' },
          responseMimeType: 'application/json',
          temperature: 1.0, // Рекомендовано для Gemini 3
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Gemini 3 error: ${errorText}` },
        { status: response.status },
      );
    }

    const payload = await response.json();
    const outputText =
      payload.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ||
      '[]';

    const items = JSON.parse(outputText);
    return NextResponse.json({ items });
  } catch (err) {
    console.error('Parsing error:', err);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 },
    );
  }
}

// Константи виносимо окремо
const PATTERNS = {
  // PO/26/02/11/0454
  SLASH: /\b[A-Z]{1,3}\/\d{2}\/\d{2}\/\d{2}\/\d{3,4}\b/g,
  // C127-Y-1 або A01-102-B1
  DASH: /\b[A-Z]\d{2,4}(?:-[A-Z0-9]+)+\b/g,
  // RS26TSM860-79X-S
  RS_RW: /\b(?:RS|RW)\d{2}[A-Z]{3}\d{3}-\d{2}[A-Z]-\w{1,3}\b/g,
  // EAN-13
  EAN: /\b\d{13}\b/g,
  // Формат 303-ABC 123 (який ти перевертаєш)
  FLIPPED: /\b\d{3}-[A-Za-z0-9]+\s+[A-Za-z0-9]+\b/g,
  // Специфічний PK/25/04...
  PK: /\b[A-Z]{2}\/\d{2}\/\d{2}\/\d{2}\/\d{4}\b/g,
};

// 2. Оновлена функція з усіма форматами
export function extractUniqueCodes(text: string) {
  // Носії (P-02037, M0291)
  const carrierPattern = /\b[PM]-?\d{4,6}\b/g;

  // Артикули RS/RW (твій новий гнучкий паттерн)
  const rsRwPattern = /\b(?:RS|RW)[A-Z0-9]*(?:-[A-Z0-9]+)+\b/g;

  // Локації зі слешами (PO/26/02...)
  const slashPattern = /\b[A-Z]{1,3}\/\d{2}\/\d{2}\/\d{2}\/\d{3,4}\b/g;

  // Артикули типу C127-Y-1
  const articulPattern = /\b[A-Z]\d+[A-Z0-9]*(?:-[A-Z0-9]+)+\b/g;

  // Збираємо збіги
  const matches = [
    ...(text.match(slashPattern) ?? []),
    ...(text.match(carrierPattern) ?? []),
    ...(text.match(rsRwPattern) ?? []),

    ...(text.match(articulPattern) ?? []),
    ...(text.match(/\b\d{13}\b/g) ?? []), // EAN
  ];

  return Array.from(new Set(matches));
}

export const recognizePlaceNumber = (text: string) => {
  const codes = extractUniqueCodes(text);
  return codes.length > 0 ? codes[0] : 'Nic nie znaleziono 😕';
};

// --- Wyszukiwanie numeru miejsca (PK/25/04/23/0813) ---
const noFoundMessage = 'Nic nie znaleziono 😕';
export const recognizePlaceNumber = (text: string) => {
  const regex = /\b[A-Z]{2}\/\d{2}\/\d{2}\/\d{2}\/\d{4}\b/;
  const regex2 = /\b\d{8,13}\b/;
  const regex3 = /^[A-Za-z]\/\d{6}\/\d{4}$/m;
  const regex4 = /^\d{3}-[A-Za-z0-9]+\s+[A-Za-z0-9]+$/;
  const regex5 = /\b[A-Z]\d{2}-\d{3}-[A-Z]\d\b/;
  const found = text.match(regex);
  const found2 = text.match(regex2);
  const found3 = text.match(regex3);
  const found4 = text.match(regex4);
  const found5 = text.match(regex5);

  if (found4) {
    const raw = found4[0].trim();
    const parts = raw.split(/\s+/);
    if (parts.length === 2) {
      const [first, second] = parts;
      const finalCode = `${second}-${first}`;
      return finalCode;
    }
  }

  return found
    ? found[0]
    : found2
    ? found2[0]
    : found3
    ? found3[0]
    : found5
    ? found5[0]
    : noFoundMessage;
};

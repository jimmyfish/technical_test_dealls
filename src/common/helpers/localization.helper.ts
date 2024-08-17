export async function uniformPhoneNumber(text: string): Promise<string> {
  if (!text) return text;
  let finalText: string;
  const countryCode: string = '+62'.substring(1);

  text = text.replace(/ /g, '');
  finalText = text;

  if (text.substring(0, 2) === countryCode) finalText = text.substring(2);
  if (text.substring(0, 3) === `+${countryCode}`) finalText = text.substring(3);
  if (text.substring(0, 1) === '0') finalText = text.substring(1);

  return `+62${finalText}`;
}

/** WhatsApp hand-off helpers. Shared by the static build and the browser script. */

export const WA_NUMBER = '919899290016';
export const SIGN_OFF = 'Sent from primeyatra.co.in';

/** Remove control characters, collapse whitespace and clip length. */
export function clean(text: string, max = 400): string {
  return text
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** wa.me link with prefilled text. */
export function waUrl(text: string, number: string = WA_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Simple one-paragraph message used by the static "Enquire on WhatsApp" buttons. */
export function ctaMessage(topic: string): string {
  return `Hello Prime Enterprises, ${topic}\n\n${SIGN_OFF}`;
}

export type MessageLine = [label: string, value: string];

/** Structured enquiry message used by every form. Empty values are skipped. */
export function buildMessage(subject: string, lines: MessageLine[]): string {
  const body = lines
    .filter(([, value]) => value.trim() !== '')
    .map(([label, value]) => `${label}: ${clean(value, 500)}`)
    .join('\n');
  return [`Hello Prime Enterprises,`, `I would like to enquire about: ${subject}`, body && `\n${body}`, `\n${SIGN_OFF}`]
    .filter((part) => part !== '' && part !== false)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

export function telUrl(e164: string): string {
  return `tel:${e164}`;
}

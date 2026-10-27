/** Form validation. Pure functions, shared by the browser script and the unit tests. */

export type Result = { ok: true; value: string } | { ok: false; error: string };

const ok = (value: string): Result => ({ ok: true, value });
const fail = (error: string): Result => ({ ok: false, error });

export function validateName(raw: string, required = true): Result {
  const v = raw.trim().replace(/\s+/g, ' ');
  if (!v) return required ? fail('Please enter your name.') : ok('');
  if (!/^[\p{L}][\p{L}\p{M} .'’-]{1,59}$/u.test(v)) return fail('Please enter a valid name (letters only, 2 to 60 characters).');
  return ok(v);
}

/** Accepts Indian mobiles (with or without +91 / 0) and international numbers written with a leading +. */
export function validatePhone(raw: string, required = true): Result {
  const v = raw.trim();
  if (!v) return required ? fail('Please enter your mobile number.') : ok('');
  if (/[^\d\s+().-]/.test(v)) return fail('Phone numbers can only contain digits, spaces and +.');
  const compact = v.replace(/[\s().-]/g, '');
  if (compact.startsWith('+') && !compact.startsWith('+91')) {
    return /^\+\d{8,15}$/.test(compact) ? ok(compact) : fail('Enter the full international number, e.g. +971501234567.');
  }
  let n = compact.replace(/^\+91/, '');
  if (n.length === 12 && n.startsWith('91')) n = n.slice(2);
  if (n.length === 11 && n.startsWith('0')) n = n.slice(1);
  return /^[6-9]\d{9}$/.test(n) ? ok(`+91 ${n}`) : fail('Enter a valid 10-digit Indian mobile number.');
}

export function validateEmail(raw: string, required = false): Result {
  const v = raw.trim();
  if (!v) return required ? fail('Please enter your email.') : ok('');
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 120 ? ok(v) : fail('Please enter a valid email address.');
}

export function validateInt(raw: string, min: number, max: number, what: string, required = true): Result {
  const v = raw.trim();
  if (!v) return required ? fail(`Please enter ${what}.`) : ok('');
  if (!/^\d+$/.test(v)) return fail(`${cap(what)} must be a whole number.`);
  const n = Number(v);
  if (n < min || n > max) return fail(`${cap(what)} must be between ${min} and ${max}.`);
  return ok(String(n));
}

export function validateAmount(raw: string, required = true): Result {
  const v = raw.trim().replace(/,/g, '');
  if (!v) return required ? fail('Please enter an approximate amount.') : ok('');
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return fail('Enter the amount as a number, e.g. 1500.');
  const n = Number(v);
  if (n <= 0) return fail('Amount must be greater than zero.');
  if (n > 1_000_000_000) return fail('Amount looks too large. Please check it.');
  return ok(String(n));
}

export function validateText(raw: string, max: number, required = false, what = 'this field'): Result {
  const v = raw.trim();
  if (!v) return required ? fail(`Please fill in ${what}.`) : ok('');
  if (v.length > max) return fail(`Please keep ${what} within ${max} characters.`);
  return ok(v);
}

export function validateSelect(raw: string, required = true, what = 'an option'): Result {
  const v = raw.trim();
  return v || !required ? ok(v) : fail(`Please choose ${what}.`);
}

/** True for a real calendar date written as YYYY-MM-DD. */
export function isRealDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** Local calendar date as YYYY-MM-DD (not UTC, so it matches what the visitor sees). */
export function todayISO(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** A date that must be today or later and within maxDays from today. */
export function validateFutureDate(raw: string, today: string, maxDays = 730, required = true, what = 'a date'): Result {
  const v = raw.trim();
  if (!v) return required ? fail(`Please choose ${what}.`) : ok('');
  if (!isRealDate(v)) return fail('Please enter a valid date.');
  if (v < today) return fail('That date has already passed. Please pick today or a later date.');
  if (v > addDaysISO(today, maxDays)) return fail(`Please pick a date within the next ${maxDays >= 700 ? 'two years' : `${maxDays} days`}.`);
  return ok(v);
}

/** Return date must not be before departure. Returns an error message, or '' when fine. */
export function validateDateOrder(depart: string, ret: string): string {
  if (!depart || !ret) return '';
  return ret < depart ? 'Return date cannot be before the departure date.' : '';
}

/** "2026-12-12" -> "12 Dec 2026" */
export function formatDateHuman(iso: string): string {
  if (!isRealDate(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

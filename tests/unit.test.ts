import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateInt,
  validateAmount,
  validateFutureDate,
  validateDateOrder,
  isRealDate,
  addDaysISO,
  todayISO,
  formatDateHuman,
} from '../src/lib/validate';
import { buildMessage, waUrl, ctaMessage, clean, WA_NUMBER } from '../src/lib/whatsapp';
import { esc, jsonLd } from '../src/lib/html';
import { destinations } from '../src/data/destinations';
import { SCENE_SLUGS } from '../src/art';
import { site } from '../src/config';

test('phone: accepts Indian mobiles in common formats', () => {
  for (const v of ['9899290016', '+91 98992 90016', '098992 90016', '919899290016', '98992-90016']) {
    const r = validatePhone(v);
    assert.ok(r.ok, v);
    assert.equal((r as { value: string }).value, '+91 9899290016');
  }
});

test('phone: rejects bad numbers', () => {
  for (const v of ['', '12345', '5899290016', 'abcdefghij', '98992900160000']) assert.equal(validatePhone(v).ok, false, v);
});

test('phone: accepts international with +', () => {
  assert.ok(validatePhone('+971 50 123 4567').ok);
  assert.equal(validatePhone('+1').ok, false);
});

test('name and email', () => {
  assert.ok(validateName('Vishal Sharma').ok);
  assert.ok(validateName("D'Souza").ok);
  assert.ok(validateName('Ravi & Neha').ok);
  assert.equal(validateName('<script>').ok, false);
  assert.equal(validateName('').ok, false);
  assert.equal(validateName('1234').ok, false);
  assert.ok(validateName('', false).ok);
  assert.ok(validateEmail('').ok);
  assert.ok(validateEmail('a@b.co').ok);
  assert.equal(validateEmail('a@b').ok, false);
});

test('numbers and amounts', () => {
  assert.ok(validateInt('2', 1, 50, 'travellers').ok);
  assert.equal(validateInt('0', 1, 50, 'travellers').ok, false);
  assert.equal(validateInt('51', 1, 50, 'travellers').ok, false);
  assert.equal(validateInt('1.5', 1, 50, 'travellers').ok, false);
  assert.ok(validateAmount('1,500').ok);
  assert.equal(validateAmount('0').ok, false);
  assert.equal(validateAmount('abc').ok, false);
});

test('dates: real, past, future, order', () => {
  const today = '2026-10-27';
  assert.ok(isRealDate('2026-02-28'));
  assert.equal(isRealDate('2026-02-30'), false);
  assert.equal(isRealDate('26-02-01'), false);
  assert.ok(validateFutureDate('2026-10-27', today).ok);
  assert.ok(validateFutureDate('2026-12-12', today).ok);
  assert.equal(validateFutureDate('2026-10-26', today).ok, false);
  assert.equal(validateFutureDate('2030-01-01', today).ok, false);
  assert.equal(validateFutureDate('', today).ok, false);
  assert.ok(validateFutureDate('', today, 730, false).ok);
  assert.match(validateDateOrder('2026-12-12', '2026-12-10'), /before/);
  assert.equal(validateDateOrder('2026-12-12', '2026-12-12'), '');
  assert.equal(addDaysISO('2026-12-30', 3), '2027-01-02');
  assert.equal(formatDateHuman('2026-12-05'), '5 Dec 2026');
  assert.match(todayISO(new Date(2026, 0, 5)), /^2026-01-05$/);
});

test('whatsapp: number, link and message building', () => {
  assert.equal(WA_NUMBER, '919899290016');
  assert.equal(site.phone.wa, WA_NUMBER);
  const msg = buildMessage('Trip to Goa', [
    ['Destination', 'Goa'],
    ['Travellers', '2'],
    ['Notes', ''],
  ]);
  assert.match(msg, /enquire about: Trip to Goa/);
  assert.match(msg, /Destination: Goa/);
  assert.doesNotMatch(msg, /Notes:/);
  assert.match(msg, /Sent from primeyatra\.co\.in/);
  const url = waUrl(msg);
  assert.ok(url.startsWith('https://wa.me/919899290016?text='));
  assert.equal(decodeURIComponent(url.split('text=')[1]), msg);
  assert.match(ctaMessage('hello'), /^Hello Prime Enterprises, hello/);
});

test('whatsapp: user text is cleaned and clipped', () => {
  assert.equal(clean('a\n\n  b\t c'), 'a b c');
  assert.equal(clean('x'.repeat(1000), 10).length, 10);
  const msg = buildMessage('X', [['Message', 'line1\nline2 & more <b>']]);
  assert.match(msg, /Message: line1 line2 & more <b>/);
});

test('html helpers escape', () => {
  assert.equal(esc('<a href="x">&\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
  assert.doesNotMatch(jsonLd({ a: '</script><script>alert(1)' }), /<\/script><script>/);
});

test('content: every destination has artwork, a unique slug and no prices', () => {
  const slugs = new Set<string>();
  for (const d of destinations) {
    assert.ok(!slugs.has(d.slug), `duplicate slug ${d.slug}`);
    slugs.add(d.slug);
    assert.ok(SCENE_SLUGS.includes(d.slug), `no artwork for ${d.slug}`);
    assert.ok(d.metaDescription.length <= 175, `${d.slug} meta too long (${d.metaDescription.length})`);
    const text = JSON.stringify(d);
    assert.doesNotMatch(text, /₹|\bRs\.?\s?\d|\bINR\b|\$\s?\d/, `${d.slug} contains a price`);
  }
  assert.equal(destinations.filter((d) => d.kind === 'domestic').length, 7);
  assert.equal(destinations.filter((d) => d.kind === 'international').length, 7);
});

import { esc, cx } from './lib/html';
import { icon, whatsappIcon } from './lib/icons';
import { WA_NUMBER } from './lib/whatsapp';
import { domestic, international } from './data/destinations';

export type Kind = 'name' | 'phone' | 'email' | 'date' | 'date-return' | 'int' | 'amount' | 'text' | 'textarea' | 'select' | 'checkboxes';
export type OptionGroup = { group: string; options: string[] };

export type Field = {
  name: string;
  label: string;
  kind: Kind;
  required?: boolean;
  options?: Array<string | OptionGroup>;
  placeholder?: string;
  hint?: string;
  value?: string;
  min?: number;
  max?: number;
  maxLen?: number;
  minLen?: number;
  what?: string; // used in error messages, e.g. "the number of travellers"
  maxDays?: number;
  autocomplete?: string;
  span?: string; // extra Tailwind col-span classes
};

export type FormSpec = {
  id: string; // unique per page instance
  subject: string; // "I would like to enquire about: <subject>"
  fields: Field[];
  submit: string;
  grid?: string; // Tailwind grid classes
  tone?: 'light' | 'dark';
  note?: string;
};

export const BUDGETS = ['Under ₹25,000', '₹25,000 to ₹50,000', '₹50,000 to ₹1,00,000', '₹1,00,000 to ₹2,50,000', 'Above ₹2,50,000', 'Not sure yet'];

const TOPICS = [
  'Domestic tour package',
  'International tour package',
  'Customised holiday or honeymoon',
  'Forex or currency exchange',
  'International money transfer',
  'Visa assistance',
  'Something else',
];

/** Destination dropdown shared by the enquiry widget. */
export function destinationOptions(): OptionGroup[] {
  return [
    { group: 'Popular in India', options: domestic.map((d) => d.name) },
    { group: 'International', options: international.map((d) => d.name) },
    { group: 'Other', options: ['Not sure yet, please suggest'] },
  ];
}

function control(f: Field, id: string, describedBy: string): string {
  const common = `id="${id}" name="${esc(f.name)}" data-kind="${f.kind}" data-label="${esc(f.label)}" ${f.required ? 'data-required="1" aria-required="true"' : ''} ${f.what ? `data-what="${esc(f.what)}"` : ''} ${f.minLen ? `data-minlen="${f.minLen}"` : ''} aria-describedby="${describedBy}" class="input"`;
  switch (f.kind) {
    case 'select': {
      const opts = (f.options ?? [])
        .map((o) =>
          typeof o === 'string'
            ? `<option value="${esc(o)}"${f.value === o ? ' selected' : ''}>${esc(o)}</option>`
            : `<optgroup label="${esc(o.group)}">${o.options.map((x) => `<option value="${esc(x)}"${f.value === x ? ' selected' : ''}>${esc(x)}</option>`).join('')}</optgroup>`,
        )
        .join('');
      return `<select ${common}><option value="">${esc(f.placeholder ?? 'Select')}</option>${opts}</select>`;
    }
    case 'textarea':
      return `<textarea ${common} rows="3" maxlength="${f.maxLen ?? 600}" placeholder="${esc(f.placeholder ?? '')}">${esc(f.value ?? '')}</textarea>`;
    case 'date':
    case 'date-return':
      return `<input ${common} type="date" ${f.kind === 'date' ? `data-max-days="${f.maxDays ?? 730}"` : `data-after="departure" data-max-days="${f.maxDays ?? 760}"`} />`;
    case 'int':
      return `<input ${common} type="number" inputmode="numeric" min="${f.min ?? 1}" max="${f.max ?? 50}" step="1" value="${esc(f.value ?? '')}" placeholder="${esc(f.placeholder ?? '')}" />`;
    case 'phone':
      return `<input ${common} type="tel" inputmode="tel" autocomplete="${f.autocomplete ?? 'tel'}" maxlength="20" placeholder="${esc(f.placeholder ?? '98765 43210')}" />`;
    case 'email':
      return `<input ${common} type="email" inputmode="email" autocomplete="email" maxlength="120" placeholder="${esc(f.placeholder ?? 'you@example.com')}" />`;
    case 'amount':
      return `<input ${common} type="text" inputmode="decimal" maxlength="14" placeholder="${esc(f.placeholder ?? '')}" />`;
    case 'name':
      return `<input ${common} type="text" autocomplete="${f.autocomplete ?? 'name'}" maxlength="60" placeholder="${esc(f.placeholder ?? 'Your name')}" />`;
    default:
      return `<input ${common} type="text" maxlength="${f.maxLen ?? 80}" autocomplete="${f.autocomplete ?? 'off'}" placeholder="${esc(f.placeholder ?? '')}" />`;
  }
}

function renderField(f: Field, formId: string): string {
  const id = `${formId}-${f.name}`;
  const err = `err-${id}`;
  const hint = `hint-${id}`;
  const describedBy = `${f.hint ? hint + ' ' : ''}${err}`;
  const optional = f.required ? '' : ' <span class="font-normal opacity-70">(optional)</span>';

  if (f.kind === 'checkboxes') {
    const boxes = (f.options as string[])
      .map(
        (o, i) =>
          `<label class="chip-check"><input type="checkbox" name="${esc(f.name)}" value="${esc(o)}" id="${id}-${i}" /><span>${esc(o)}</span></label>`,
      )
      .join('');
    return `<fieldset class="field ${f.span ?? ''}" data-kind="checkboxes" data-name="${esc(f.name)}" data-label="${esc(f.label)}"><legend class="label">${esc(f.label)}${optional}</legend><div class="mt-1.5 flex flex-wrap gap-2">${boxes}</div></fieldset>`;
  }

  return `<div class="field ${f.span ?? ''}"><label class="label" for="${id}">${esc(f.label)}${optional}</label>${control(f, id, describedBy)}${
    f.hint ? `<p class="hint" id="${hint}">${esc(f.hint)}</p>` : ''
  }<p class="field-error" id="${err}" role="alert" hidden></p></div>`;
}

/** Renders one WhatsApp hand-off form. The browser script (client/app.ts) reads the data-* attributes. */
export function renderForm(spec: FormSpec): string {
  const dark = spec.tone === 'dark';
  return `<form class="wa-form ${dark ? 'wa-form-dark' : ''}" id="form-${spec.id}" data-wa-form data-subject="${esc(spec.subject)}" data-wa-number="${WA_NUMBER}" novalidate>
  <div class="grid gap-3.5 ${spec.grid ?? 'sm:grid-cols-2'}">
    ${spec.fields.map((f) => renderField(f, spec.id)).join('\n    ')}
  </div>
  <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
    <button type="submit" class="btn btn-wa w-full sm:w-auto">${whatsappIcon('h-5 w-5')}<span>${esc(spec.submit)}</span></button>
    <p class="text-xs leading-relaxed ${dark ? 'text-navy-100' : 'text-navy-600'}">${icon('info', 'mr-1 inline h-3.5 w-3.5 align-[-2px]')}${esc(
      spec.note ?? 'This opens WhatsApp with your details filled in. Nothing is booked until we confirm with you.',
    )}</p>
  </div>
  <div class="form-status" role="status" aria-live="polite" hidden></div>
  <noscript><p class="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">JavaScript is turned off, so this form cannot prepare your WhatsApp message. Please use the WhatsApp or call buttons on this page instead.</p></noscript>
</form>`;
}

// ───────────────────────── Form definitions ─────────────────────────

export function tripWidget(uid: string, preselect?: string): string {
  return renderForm({
    id: uid,
    subject: preselect ? `Trip to ${preselect}` : 'Trip enquiry',
    submit: 'Plan my trip on WhatsApp',
    grid: 'sm:grid-cols-2 lg:grid-cols-4',
    fields: [
      { name: 'destination', label: 'Destination', kind: 'select', required: true, options: destinationOptions(), placeholder: 'Where to?', value: preselect },
      { name: 'departure', label: 'Departure date', kind: 'date', required: true },
      { name: 'return', label: 'Return date', kind: 'date-return' },
      { name: 'travellers', label: 'Travellers', kind: 'int', required: true, value: '2', min: 1, max: 50, what: 'the number of travellers', hint: 'Adults and children together' },
      { name: 'budget', label: 'Approx. total budget', kind: 'select', options: BUDGETS, placeholder: 'Choose a range' },
      { name: 'from', label: 'Travelling from', kind: 'text', placeholder: 'City', maxLen: 40, autocomplete: 'address-level2' },
      { name: 'name', label: 'Your name', kind: 'name' },
      { name: 'notes', label: 'Anything else', kind: 'text', placeholder: 'Hotel type, must-see places', maxLen: 120 },
    ],
  });
}

export function callbackForm(uid: string, topic?: string, tone: 'light' | 'dark' = 'light'): string {
  return renderForm({
    id: uid,
    subject: 'Callback request',
    submit: 'Request a callback on WhatsApp',
    tone,
    note: 'This opens WhatsApp with your request. We will call back after you send it, subject to our availability.',
    fields: [
      { name: 'name', label: 'Your name', kind: 'name', required: true },
      { name: 'phone', label: 'Mobile number', kind: 'phone', required: true, hint: 'Indian number, or international with + and country code' },
      { name: 'date', label: 'Preferred callback date', kind: 'date', required: true, maxDays: 60 },
      { name: 'slot', label: 'Preferred time', kind: 'select', required: true, options: ['Morning', 'Afternoon', 'Evening'], placeholder: 'Choose a time of day' },
      { name: 'topic', label: 'What is it about?', kind: 'select', required: true, options: TOPICS, placeholder: 'Select a topic', value: topic },
      { name: 'notes', label: 'Anything we should know', kind: 'text', placeholder: 'e.g. travelling in December', maxLen: 120 },
    ],
  });
}

export function contactForm(uid: string): string {
  return renderForm({
    id: uid,
    subject: 'Message from the contact form',
    submit: 'Send message on WhatsApp',
    fields: [
      { name: 'name', label: 'Your name', kind: 'name', required: true },
      { name: 'phone', label: 'Mobile number', kind: 'phone', required: true },
      { name: 'email', label: 'Email', kind: 'email' },
      { name: 'topic', label: 'Topic', kind: 'select', required: true, options: TOPICS, placeholder: 'Select a topic' },
      { name: 'message', label: 'Your message', kind: 'textarea', required: true, minLen: 10, span: 'sm:col-span-2', maxLen: 600, placeholder: 'Tell us what you need' },
    ],
  });
}

export function customHolidayForm(uid: string): string {
  return renderForm({
    id: uid,
    subject: 'Customised holiday or honeymoon',
    submit: 'Send my trip brief on WhatsApp',
    fields: [
      { name: 'type', label: 'Type of trip', kind: 'select', required: true, placeholder: 'Choose one', options: ['Honeymoon', 'Anniversary', 'Family holiday', 'Friends or group trip', 'Senior citizens trip', 'Solo trip', 'Something else'] },
      { name: 'places', label: 'Places you like', kind: 'text', placeholder: 'e.g. Maldives, or open to ideas', maxLen: 80 },
      { name: 'departure', label: 'Approx. travel date', kind: 'date', required: true },
      { name: 'nights', label: 'Number of nights', kind: 'int', min: 1, max: 60, what: 'the number of nights', placeholder: 'e.g. 6' },
      { name: 'travellers', label: 'Travellers', kind: 'int', required: true, value: '2', min: 1, max: 50, what: 'the number of travellers' },
      { name: 'budget', label: 'Approx. total budget', kind: 'select', options: BUDGETS, placeholder: 'Choose a range' },
      {
        name: 'interests',
        label: 'What matters most',
        kind: 'checkboxes',
        span: 'sm:col-span-2',
        options: ['Beaches', 'Mountains and snow', 'Culture and heritage', 'Adventure', 'Wildlife', 'Spa and wellness', 'Food experiences', 'Shopping', 'Romantic stays', 'Kid-friendly'],
      },
      { name: 'name', label: 'Your name', kind: 'name', required: true },
      { name: 'notes', label: 'Anything else', kind: 'text', placeholder: 'Special occasion, dietary needs', maxLen: 140 },
    ],
  });
}

export const CURRENCIES = ['US dollar (USD)', 'Euro (EUR)', 'British pound (GBP)', 'UAE dirham (AED)', 'Singapore dollar (SGD)', 'Thai baht (THB)', 'Swiss franc (CHF)', 'Other'];

export function forexForm(uid: string): string {
  return renderForm({
    id: uid,
    subject: 'Foreign currency exchange',
    submit: 'Ask for today\'s rate on WhatsApp',
    fields: [
      { name: 'action', label: 'I want to', kind: 'select', required: true, options: ['Buy foreign currency', 'Sell or exchange foreign currency'], placeholder: 'Choose one' },
      { name: 'currency', label: 'Currency', kind: 'select', required: true, options: CURRENCIES, placeholder: 'Choose currency' },
      { name: 'amount', label: 'Approx. amount in that currency', kind: 'amount', required: true, placeholder: 'e.g. 1500' },
      { name: 'purpose', label: 'Purpose', kind: 'select', options: ['Leisure travel', 'Business travel', 'Education', 'Medical', 'Something else'], placeholder: 'Choose purpose' },
      { name: 'date', label: 'Travel date', kind: 'date' },
      { name: 'name', label: 'Your name', kind: 'name' },
    ],
  });
}

export function transferForm(uid: string): string {
  return renderForm({
    id: uid,
    subject: 'International money transfer (Western Union)',
    submit: 'Get transfer help on WhatsApp',
    fields: [
      { name: 'direction', label: 'I want to', kind: 'select', required: true, options: ['Send money abroad', 'Receive money in India', 'Not sure yet'], placeholder: 'Choose one' },
      { name: 'country', label: 'Country (sending to or from)', kind: 'text', required: true, placeholder: 'e.g. United Kingdom', maxLen: 40 },
      { name: 'amount', label: 'Approx. amount', kind: 'text', required: true, placeholder: 'e.g. ₹50,000 or USD 500', maxLen: 30 },
      { name: 'purpose', label: 'Purpose', kind: 'select', options: ['Family support', 'Education fees or living costs', 'Travel or medical', 'Gift', 'Business', 'Something else'], placeholder: 'Choose purpose' },
      { name: 'urgency', label: 'How soon', kind: 'select', options: ['Today', 'Within this week', 'Flexible'], placeholder: 'Choose timing' },
      { name: 'name', label: 'Your name', kind: 'name' },
    ],
  });
}

export const VISA_COUNTRIES = ['UAE (Dubai, Abu Dhabi)', 'Thailand', 'Indonesia (Bali)', 'Singapore', 'Maldives', 'Vietnam', 'Schengen (Europe)', 'United Kingdom', 'Another country'];

export function visaForm(uid: string, country?: string): string {
  return renderForm({
    id: uid,
    subject: 'Visa assistance',
    submit: 'Check visa requirements on WhatsApp',
    fields: [
      { name: 'country', label: 'Destination country', kind: 'select', required: true, options: VISA_COUNTRIES, placeholder: 'Choose country', value: country },
      { name: 'type', label: 'Visa type', kind: 'select', required: true, options: ['Tourist', 'Business', 'Transit', 'Something else'], placeholder: 'Choose type' },
      { name: 'travellers', label: 'Number of applicants', kind: 'int', required: true, value: '1', min: 1, max: 30, what: 'the number of applicants' },
      { name: 'date', label: 'Planned travel date', kind: 'date', required: true },
      { name: 'refusal', label: 'Any earlier visa refusal?', kind: 'select', options: ['No', 'Yes, I will explain', 'Prefer to discuss'], placeholder: 'Choose one' },
      { name: 'name', label: 'Your name', kind: 'name' },
    ],
  });
}

export { cx };

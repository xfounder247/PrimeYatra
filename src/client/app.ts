/**
 * Browser script. Progressive enhancement only: every page works as plain HTML
 * (links, WhatsApp and call buttons) without it. It adds:
 *  - dropdown / mobile menu behaviour
 *  - destination filters
 *  - date pickers with sensible min/max
 *  - form validation and the WhatsApp hand-off (no booking is ever "confirmed" here)
 */
import {
  validateName,
  validatePhone,
  validateEmail,
  validateInt,
  validateAmount,
  validateText,
  validateSelect,
  validateFutureDate,
  validateDateOrder,
  todayISO,
  addDaysISO,
  formatDateHuman,
  type Result,
} from '../lib/validate';
import { buildMessage, waUrl, type MessageLine } from '../lib/whatsapp';

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

// ───────────── Navigation ─────────────

function initNav(): void {
  const dropdowns = $$('[data-dropdown]');
  const setOpen = (dd: HTMLElement, open: boolean) => {
    const btn = dd.querySelector('button');
    if (open) dd.setAttribute('data-open', '');
    else dd.removeAttribute('data-open');
    btn?.setAttribute('aria-expanded', String(open));
  };
  const closeAll = (except?: HTMLElement) => dropdowns.forEach((d) => d !== except && setOpen(d, false));

  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('button');
    btn?.addEventListener('click', () => {
      const open = dd.hasAttribute('data-open');
      closeAll(dd);
      setOpen(dd, !open);
      if (open) btn.blur(); // otherwise :focus-within would keep the menu open
    });
    dd.addEventListener('mouseenter', () => btn?.setAttribute('aria-expanded', 'true'));
    dd.addEventListener('mouseleave', () => btn?.setAttribute('aria-expanded', String(dd.hasAttribute('data-open'))));
    dd.addEventListener('focusin', () => btn?.setAttribute('aria-expanded', 'true'));
    dd.addEventListener('focusout', (e) => {
      if (!dd.contains((e as FocusEvent).relatedTarget as Node | null)) btn?.setAttribute('aria-expanded', String(dd.hasAttribute('data-open')));
    });
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-dropdown]')) closeAll();
    const mobile = document.getElementById('mobile-nav') as HTMLDetailsElement | null;
    if (mobile?.open && !(e.target as Element).closest('#mobile-nav, #site-header button')) mobile.open = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAll();
    const mobile = document.getElementById('mobile-nav') as HTMLDetailsElement | null;
    if (mobile?.open) {
      mobile.open = false;
      mobile.querySelector('summary')?.focus();
    }
    const active = document.activeElement as HTMLElement | null;
    if (active?.closest('[data-dropdown]')) active.blur();
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => {
    const mobile = document.getElementById('mobile-nav') as HTMLDetailsElement | null;
    if (m.matches && mobile) mobile.open = false;
  });
}

// ───────────── Destination filters ─────────────

function initFilters(): void {
  $$('[data-filter-group]').forEach((group) => {
    const buttons = $$<HTMLButtonElement>('[data-filter]', group);
    const scope = group.closest('section') ?? document;
    const items = $$('[data-filter-item]', scope);
    const status = $$('[data-filter-status]', scope)[0];
    buttons.forEach((btn) =>
      btn.addEventListener('click', () => {
        const key = btn.dataset.filter ?? 'all';
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        let shown = 0;
        items.forEach((it) => {
          const match = key === 'all' || (it.dataset.themes ?? '').split(' ').includes(key);
          it.hidden = !match;
          if (match) shown++;
        });
        if (status) status.textContent = `Showing ${shown} destination${shown === 1 ? '' : 's'}`;
      }),
    );
  });
}

// ───────────── Forms ─────────────

function labelOf(el: Control): string {
  return el.dataset.label ?? el.name;
}

function validateControl(el: Control, form: HTMLFormElement): Result {
  const kind = el.dataset.kind ?? 'text';
  const required = el.dataset.required === '1';
  const v = el.value;
  const label = labelOf(el).toLowerCase();
  const today = todayISO();
  switch (kind) {
    case 'name':
      return validateName(v, required);
    case 'phone':
      return validatePhone(v, required);
    case 'email':
      return validateEmail(v, required);
    case 'int': {
      const min = Number(el.getAttribute('min') ?? 1);
      const max = Number(el.getAttribute('max') ?? 50);
      return validateInt(v, min, max, el.dataset.what ?? label, required);
    }
    case 'amount':
      return validateAmount(v, required);
    case 'select':
      return validateSelect(v, required, label);
    case 'date':
      return validateFutureDate(v, today, Number(el.dataset.maxDays ?? 730), required, 'a date');
    case 'date-return': {
      const r = validateFutureDate(v, today, Number(el.dataset.maxDays ?? 760), required, 'a return date');
      if (!r.ok || !r.value) return r;
      const dep = form.elements.namedItem(el.dataset.after ?? 'departure') as HTMLInputElement | null;
      const order = validateDateOrder(dep?.value ?? '', r.value);
      return order ? { ok: false, error: order } : r;
    }
    default: {
      const max = Number(el.getAttribute('maxlength') ?? 200);
      const r = validateText(v, max, required, label);
      const minLen = Number(el.dataset.minlen ?? 0);
      if (r.ok && r.value && minLen && r.value.length < minLen) return { ok: false, error: `Please add a little more detail (at least ${minLen} characters).` };
      return r;
    }
  }
}

function showError(el: Control, msg: string): void {
  const err = document.getElementById(`err-${el.id}`);
  if (msg) {
    el.setAttribute('aria-invalid', 'true');
    if (err) {
      err.textContent = msg;
      err.hidden = false;
    }
  } else {
    el.removeAttribute('aria-invalid');
    if (err) {
      err.textContent = '';
      err.hidden = true;
    }
  }
}

function controls(form: HTMLFormElement): Control[] {
  return $$<Control>('input[data-kind], select[data-kind], textarea[data-kind]', form);
}

function initDates(form: HTMLFormElement): void {
  const today = todayISO();
  const dep = form.elements.namedItem('departure') as HTMLInputElement | null;
  controls(form)
    .filter((c) => c.dataset.kind === 'date' || c.dataset.kind === 'date-return')
    .forEach((c) => {
      const el = c as HTMLInputElement;
      el.min = today;
      el.max = addDaysISO(today, Number(el.dataset.maxDays ?? 730));
    });
  const ret = form.elements.namedItem('return') as HTMLInputElement | null;
  dep?.addEventListener('change', () => {
    if (ret && dep.value) {
      ret.min = dep.value > today ? dep.value : today;
      if (ret.value) showError(ret, validateControl(ret, form).ok ? '' : (validateControl(ret, form) as { error: string }).error);
    }
  });
}

function collectLines(form: HTMLFormElement): MessageLine[] {
  const lines: MessageLine[] = [];
  const seen = new Set<string>();
  $$<HTMLElement>('[data-kind]', form).forEach((node) => {
    if (node.dataset.kind === 'checkboxes') {
      const name = node.dataset.name ?? '';
      if (seen.has(name)) return;
      seen.add(name);
      const picked = $$<HTMLInputElement>('input[type="checkbox"]:checked', node).map((i) => i.value);
      if (picked.length) lines.push([node.dataset.label ?? name, picked.join(', ')]);
      return;
    }
    if (node.tagName === 'FIELDSET' || node.tagName === 'LEGEND') return;
    const el = node as Control;
    if (!el.name) return;
    const r = validateControl(el, form);
    let value = r.ok ? r.value : el.value.trim();
    if (!value) return;
    if (el.dataset.kind === 'date' || el.dataset.kind === 'date-return') value = formatDateHuman(value);
    lines.push([labelOf(el), value]);
  });
  return lines;
}

function setStatus(form: HTMLFormElement, html: string, isError = false): void {
  const box = form.querySelector<HTMLElement>('.form-status');
  if (!box) return;
  box.innerHTML = html;
  box.classList.toggle('is-error', isError);
  box.hidden = false;
}

function initForm(form: HTMLFormElement): void {
  initDates(form);

  const validateOne = (el: Control) => {
    const r = validateControl(el, form);
    showError(el, r.ok ? '' : r.error);
    return r.ok;
  };

  controls(form).forEach((el) => {
    el.addEventListener('blur', () => {
      if (el.value.trim() !== '' || el.dataset.required === '1') {
        // Only judge a required-but-empty field after the visitor has tried to submit.
        if (el.value.trim() === '' && !form.dataset.submitted) return;
        validateOne(el);
      }
    });
    const live = () => {
      if (el.getAttribute('aria-invalid') === 'true') validateOne(el);
    };
    el.addEventListener('input', live);
    el.addEventListener('change', live);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.dataset.submitted = '1';
    let firstBad: Control | null = null;
    for (const el of controls(form)) {
      if (!validateOne(el) && !firstBad) firstBad = el;
    }
    if (firstBad) {
      setStatus(form, 'Please fix the highlighted fields and try again.', true);
      firstBad.focus();
      return;
    }
    const message = buildMessage(form.dataset.subject ?? 'Enquiry', collectLines(form));
    const url = waUrl(message, form.dataset.waNumber);
    window.open(url, '_blank', 'noopener');
    setStatus(
      form,
      `<strong>Your message is ready.</strong> WhatsApp should open with your details filled in. Please press <strong>Send</strong> there to reach us. Nothing is booked or confirmed until we reply and you agree. <a class="font-semibold underline underline-offset-4" href="${url}" target="_blank" rel="noopener noreferrer">If WhatsApp did not open, tap here</a>.`,
    );
  });
}

function init(): void {
  initNav();
  initFilters();
  $$<HTMLFormElement>('form[data-wa-form]').forEach(initForm);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

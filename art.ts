/**
 * Original, generated destination artwork (SVG). No third-party imagery is used.
 * Each scene is deterministic, so builds are reproducible. Real photographs placed in
 * public/images/destinations/<slug>.jpg automatically replace these (see build.ts).
 */

export const ART_W = 800;
export const ART_H = 520;
const W = ART_W;
const H = ART_H;

type R = () => number;
type Stop = [number, string];

const f = (n: number) => Math.round(n * 10) / 10;
const pt = (p: [number, number]) => `${f(p[0])},${f(p[1])}`;

function rng(seed: string): R {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const grad = (id: string, stops: Stop[], vertical = true) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

const sky = (stops: Stop[], to = H) => `<defs>${grad('sky', stops)}</defs><rect width="${W}" height="${to}" fill="url(#sky)"/>`;

const sun = (cx: number, cy: number, r: number, color: string, glow = 'rgba(255,255,255,.35)') =>
  `<defs><radialGradient id="glow"><stop offset="0" stop-color="${glow}"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs>` +
  `<circle cx="${cx}" cy="${cy}" r="${r * 3.2}" fill="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;

/** Jagged mountain ridge, optional snow caps. */
function ridge(r: R, base: number, minH: number, maxH: number, n: number, fill: string, snow?: string) {
  const step = W / n;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = i * step + (i > 0 && i < n ? (r() - 0.5) * step * 0.5 : 0);
    const peak = i % 2 === 1;
    pts.push([x, base - (peak ? minH + (maxH - minH) * r() : minH * 0.2 * r())]);
  }
  let out = `<path d="M0,${H} L${pts.map(pt).join(' L')} L${W},${H} Z" fill="${fill}"/>`;
  if (snow) {
    for (let i = 1; i < n; i += 2) {
      const [px, py] = pts[i];
      const [lx, ly] = pts[i - 1];
      const [rx, ry] = pts[i + 1];
      const t = 0.3;
      const a: [number, number] = [px + (lx - px) * t, py + (ly - py) * t];
      const b: [number, number] = [px + (rx - px) * t, py + (ry - py) * t];
      const dx = b[0] - a[0];
      const poly: [number, number][] = [[px, py], b, [a[0] + dx * 0.75, b[1] + 10], [a[0] + dx * 0.5, a[1] + 1], [a[0] + dx * 0.25, a[1] + 10], a];
      out += `<polygon points="${poly.map(pt).join(' ')}" fill="${snow}"/>`;
    }
  }
  return out;
}

/** Smooth rolling hills. */
function hills(r: R, base: number, amp: number, fill: string, f1 = 0.009, f2 = 0.021) {
  const p1 = r() * 6;
  const p2 = r() * 6;
  const y = (x: number) => base + amp * (Math.sin(x * f1 + p1) * 0.62 + Math.sin(x * f2 + p2) * 0.38);
  let d = `M0,${H} L0,${f(y(0))}`;
  for (let x = 10; x <= W; x += 10) d += ` L${x},${f(y(x))}`;
  return `<path d="${d} L${W},${H} Z" fill="${fill}"/>`;
}

const pine = (x: number, base: number, h: number, color: string) => {
  const w = h * 0.3;
  let s = `<rect x="${f(x - 2)}" y="${f(base - h * 0.12)}" width="4" height="${f(h * 0.12)}" fill="${color}"/>`;
  for (let i = 0; i < 3; i++) {
    const top = base - h + i * h * 0.27;
    const ww = w * (0.55 + i * 0.25);
    s += `<polygon points="${f(x)},${f(top)} ${f(x - ww)},${f(top + h * 0.42)} ${f(x + ww)},${f(top + h * 0.42)}" fill="${color}"/>`;
  }
  return s;
};

const palm = (x: number, base: number, h: number, lean: number, trunk: string, leaf: string, r: R) => {
  const cx = x + lean;
  const cy = base - h;
  let s = `<path d="M${f(x)},${f(base)} Q${f(x + lean * 0.1)},${f(base - h * 0.6)} ${f(cx)},${f(cy)}" fill="none" stroke="${trunk}" stroke-width="${f(h * 0.045 + 3)}" stroke-linecap="round"/>`;
  for (const deg of [-165, -135, -105, -75, -45, -15, 10, 175]) {
    const a = (deg * Math.PI) / 180;
    const L = h * (0.42 + r() * 0.16);
    const ex = cx + Math.cos(a) * L;
    const ey = cy + Math.sin(a) * L * 0.55 + L * 0.38;
    const qx = cx + Math.cos(a) * L * 0.55;
    const qy = cy + Math.sin(a) * L * 0.55 - L * 0.22;
    s += `<path d="M${f(cx)},${f(cy)} Q${f(qx)},${f(qy)} ${f(ex)},${f(ey)} Q${f(qx)},${f(qy + 9)} ${f(cx)},${f(cy)}Z" fill="${leaf}"/>`;
  }
  return s + `<circle cx="${f(cx)}" cy="${f(cy + 3)}" r="4" fill="${trunk}"/>`;
};

const building = (x: number, base: number, w: number, h: number, fill: string, r: R, win?: string) => {
  let s = `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
  if (win) {
    for (let yy = base - h + 8; yy < base - 6; yy += 11) {
      for (let xx = x + 5; xx < x + w - 5; xx += 9) if (r() > 0.55) s += `<rect x="${f(xx)}" y="${f(yy)}" width="3.5" height="5" fill="${win}" opacity=".85"/>`;
    }
  }
  return s;
};

const waves = (r: R, y0: number, y1: number, color: string, count: number) => {
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = r() * W;
    const y = y0 + r() * (y1 - y0);
    const w = 18 + r() * 40;
    s += `<path d="M${f(x)},${f(y)} q${f(w / 4)},-4 ${f(w / 2)},0 t${f(w / 2)},0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
  }
  return s;
};

const birds = (r: R, n: number, color: string) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 80 + r() * 640;
    const y = 50 + r() * 110;
    s += `<path d="M${f(x)},${f(y)} q6,-7 12,0 q6,-7 12,0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return s;
};

const stars = (r: R, n: number, maxY: number) => {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${f(r() * W)}" cy="${f(r() * maxY)}" r="${f(0.6 + r() * 1.2)}" fill="#fff" opacity="${f(0.4 + r() * 0.5)}"/>`;
  return s;
};

// ───────────────────────── Scenes ─────────────────────────

const scenes: Record<string, (r: R) => string> = {
  kashmir: (r) =>
    sky([[0, '#7fa7d1'], [0.6, '#e9c9bf'], [1, '#f7e1c6']]) +
    sun(560, 250, 26, '#fff1d6') +
    ridge(r, 330, 90, 190, 8, '#8ba4c4', '#f4f8fc') +
    ridge(r, 372, 60, 120, 10, '#5d7fa3') +
    hills(r, 360, 22, '#2f5a4f') +
    [60, 110, 150, 690, 735, 770].map((x) => pine(x, 395 + r() * 8, 70 + r() * 30, '#1f3f38')).join('') +
    `<defs>${grad('lake', [[0, '#3f86a3'], [1, '#17465f']])}</defs><rect y="385" width="${W}" height="${H - 385}" fill="url(#lake)"/>` +
    waves(r, 395, 510, '#bfe3ee', 16) +
    // shikara
    `<g transform="translate(330 445)"><path d="M-70,0 Q-40,16 0,16 Q40,16 90,-6 Q40,4 -70,0Z" fill="#c24a4a"/><path d="M-35,-2 L-35,-26 Q0,-40 40,-26 L40,-2Z" fill="#f4d58d"/><path d="M-35,-26 Q0,-40 40,-26" fill="none" stroke="#c24a4a" stroke-width="3"/><path d="M-20,-4 v-22M0,-4 v-27M20,-4 v-26" stroke="#c24a4a" stroke-width="2"/></g>` +
    birds(r, 3, '#33475f'),

  manali: (r) =>
    sky([[0, '#8dbbe6'], [1, '#eef5fb']]) +
    sun(610, 120, 22, '#fffbe8') +
    ridge(r, 330, 110, 210, 8, '#9db6d3', '#ffffff') +
    ridge(r, 380, 70, 130, 10, '#6e8fb2', '#e9f1f9') +
    hills(r, 395, 16, '#dfe9f3') +
    `<path d="M0,${H} L0,455 Q200,420 420,450 T800,430 L${W},${H}Z" fill="#ffffff"/>` +
    [50, 95, 140, 665, 715, 760].map((x, i) => pine(x, 430 + (i % 3) * 14, 120 + r() * 40, i % 2 ? '#1c3b33' : '#25483d')).join('') +
    `<g transform="translate(360 405)"><rect x="0" y="0" width="70" height="40" fill="#8a5a3a"/><polygon points="-8,0 35,-30 78,0" fill="#f2f6fa"/><rect x="28" y="14" width="14" height="14" fill="#ffd36b"/></g>` +
    birds(r, 2, '#4a5f78'),

  goa: (r) =>
    sky([[0, '#ff8f70'], [0.55, '#ffcf99'], [1, '#fff0cf']], 340) +
    sun(400, 320, 46, '#fff3c4', 'rgba(255,230,160,.5)') +
    `<defs>${grad('sea', [[0, '#e99a74'], [0.25, '#2b8aa3'], [1, '#12607f']])}</defs><rect y="320" width="${W}" height="200" fill="url(#sea)"/>` +
    waves(r, 340, 420, '#ffffff', 22) +
    `<path d="M0,${H} L0,430 Q220,405 440,425 T800,415 L${W},${H}Z" fill="#f0d6a2"/><path d="M0,${H} L0,470 Q260,450 520,470 T800,462 L${W},${H}Z" fill="#e6c78a"/>` +
    palm(110, 470, 230, 40, '#4a3322', '#1d4d3a', r) +
    palm(660, 465, 260, -50, '#4a3322', '#1d4d3a', r) +
    palm(735, 480, 190, 30, '#4a3322', '#245c43', r) +
    `<g transform="translate(470 438)"><rect width="64" height="26" fill="#9a6a45"/><polygon points="-8,0 32,-24 72,0" fill="#d9b25f"/><rect x="26" y="10" width="12" height="16" fill="#3b2a1d"/></g>` +
    birds(r, 3, '#6b3b2b'),

  kerala: (r) =>
    sky([[0, '#bfe0c9'], [1, '#fff1c8']], 330) +
    sun(580, 215, 30, '#fff7d6', 'rgba(255,245,200,.55)') +
    hills(r, 300, 12, '#7fb08a') +
    hills(r, 322, 10, '#4f8a69') +
    `<defs>${grad('bw', [[0, '#5fb59a'], [1, '#1f6f61']])}</defs><rect y="330" width="${W}" height="${H - 330}" fill="url(#bw)"/>` +
    waves(r, 345, 505, '#d5f2e4', 20) +
    // houseboat
    `<g transform="translate(250 395)"><path d="M0,0 H300 Q320,0 335,-14 H-12 Q-4,0 0,0Z" fill="#5a3b25"/><path d="M12,-14 V-52 Q165,-98 318,-52 V-14Z" fill="#e2bd6e"/><path d="M12,-52 Q165,-98 318,-52" fill="none" stroke="#9c7234" stroke-width="4"/>${[40, 90, 140, 190, 240, 285].map((x) => `<rect x="${x}" y="-44" width="22" height="22" fill="#5a3b25" opacity=".85"/>`).join('')}</g>` +
    `<path d="M200,475 Q400,490 640,470" stroke="#d5f2e4" stroke-width="3" fill="none" opacity=".5"/>` +
    palm(80, 360, 280, 40, '#3e2b1c', '#1f5b3f', r) +
    palm(140, 380, 200, -20, '#3e2b1c', '#2a6b4a', r) +
    palm(720, 365, 300, -45, '#3e2b1c', '#1f5b3f', r) +
    birds(r, 3, '#38604b'),

  rajasthan: (r) =>
    sky([[0, '#e9855a'], [0.5, '#f6b26b'], [1, '#ffe2b0']]) +
    sun(560, 300, 54, '#fff0c2', 'rgba(255,225,160,.55)') +
    hills(r, 410, 14, '#e6a85b') +
    // fort
    `<g fill="#7a3426"><rect x="90" y="270" width="520" height="140"/>${Array.from({ length: 26 }, (_, i) => `<rect x="${90 + i * 20}" y="262" width="12" height="10"/>`).join('')}` +
    `<rect x="170" y="190" width="70" height="90"/><rect x="350" y="170" width="96" height="110"/><rect x="520" y="200" width="64" height="80"/>` +
    [[205, 190, 22], [398, 170, 30], [552, 200, 20]].map(([x, y, rr]) => `<path d="M${x - rr},${y} a${rr},${rr} 0 0 1 ${rr * 2},0z"/><rect x="${x - 2}" y="${y - rr - 14}" width="4" height="14"/>`).join('') +
    `</g>` +
    `<path d="M370,410 V335 a28,34 0 0 1 56,0 V410z" fill="#3a140e"/>` +
    [[130, 330], [210, 330], [300, 330], [480, 330], [560, 330]].map(([x, y]) => `<path d="M${x},${y + 28} v-18 a9,12 0 0 1 18,0 v18z" fill="#3a140e" opacity=".8"/>`).join('') +
    `<path d="M0,${H} L0,455 Q220,425 430,452 T800,440 L${W},${H}Z" fill="#cf8f3c"/><path d="M0,${H} L0,490 Q260,466 520,488 T800,478 L${W},${H}Z" fill="#b87626"/>` +
    birds(r, 4, '#6a2c1e'),

  uttarakhand: (r) =>
    sky([[0, '#a9d3e8'], [1, '#f1f7ec']]) +
    sun(150, 120, 20, '#fffbe3') +
    ridge(r, 300, 90, 170, 8, '#8fb3c4', '#f3f8fb') +
    hills(r, 330, 28, '#6c9c8d') +
    hills(r, 372, 26, '#4f8272') +
    // temple on the hill
    `<g transform="translate(560 292)" fill="#e9dcc3"><rect x="-34" y="40" width="68" height="40"/><path d="M-26,40 Q-24,-8 0,-40 Q24,-8 26,40Z" fill="#e0a45a"/><rect x="-1.5" y="-62" width="3" height="24" fill="#c0392b"/><path d="M1.5,-62 l18,6 -18,6z" fill="#c0392b"/></g>` +
    hills(r, 410, 22, '#2f5f50') +
    `<path d="M0,500 Q180,440 320,470 T620,450 T800,470 L800,520 L0,520Z" fill="#cfe5ea"/>` +
    `<path d="M0,500 Q180,440 320,470 T620,450 T800,470" fill="none" stroke="#ffffff" stroke-width="3" opacity=".6"/>` +
    Array.from({ length: 9 }, (_, i) => `<ellipse cx="${200 + i * 52 + (i % 2) * 8}" cy="${474 + (i % 3) * 8}" rx="6" ry="3" fill="#ff9d2e"/><ellipse cx="${200 + i * 52 + (i % 2) * 8}" cy="${474 + (i % 3) * 8 - 2}" rx="2.4" ry="3" fill="#ffe08a"/>`).join('') +
    [40, 90, 700, 750].map((x) => pine(x, 430, 100 + r() * 30, '#24483c')).join(''),

  andaman: (r) =>
    sky([[0, '#6ccbe6'], [1, '#e8f8fb']], 300) +
    sun(650, 110, 24, '#fffbe3') +
    `<path d="M0,300 Q120,268 240,296 T470,292 T800,302 L800,330 L0,330Z" fill="#2f7d5b"/>` +
    `<defs>${grad('lag', [[0, '#0d86a8'], [0.45, '#18c0cb'], [0.8, '#74e5d6'], [1, '#d9f6ea']])}</defs><rect y="320" width="${W}" height="${H - 320}" fill="url(#lag)"/>` +
    waves(r, 340, 440, '#ffffff', 18) +
    `<path d="M0,${H} L0,470 Q250,445 520,468 T800,452 L${W},${H}Z" fill="#f5e6bf"/>` +
    // boat
    `<g transform="translate(330 380)"><path d="M0,0 H90 L74,16 H14Z" fill="#8a5a3a"/><rect x="38" y="-26" width="3" height="26" fill="#5a3b25"/><path d="M41,-26 L72,-6 H41Z" fill="#fff"/></g>` +
    palm(90, 480, 250, 55, '#5a3f2b', '#1f6b4a', r) +
    palm(160, 495, 180, -10, '#5a3f2b', '#28805a', r) +
    palm(720, 490, 230, -50, '#5a3f2b', '#1f6b4a', r) +
    birds(r, 3, '#2f6f86'),

  dubai: (r) =>
    sky([[0, '#16275c'], [0.55, '#8a5a8f'], [0.85, '#f29c6b'], [1, '#ffd29a']], 400) +
    stars(r, 40, 160) +
    sun(300, 372, 36, '#ffe3a8', 'rgba(255,200,140,.5)') +
    Array.from({ length: 14 }, (_, i) => building(i * 58 - 10, 420, 40 + r() * 20, 70 + r() * 70, '#3d3566', r)).join('') +
    Array.from({ length: 13 }, (_, i) => building(i * 64 + 8, 430, 44 + r() * 22, 100 + r() * 120, '#17183d', r, '#ffd986')).join('') +
    // tapered tower
    `<g fill="#0c0e2a"><polygon points="560,430 575,250 585,250 600,430"/><polygon points="566,310 579,170 581,170 594,310"/><polygon points="573,200 580,90 582,90 589,200"/><rect x="579" y="50" width="3" height="50"/></g>` +
    `<g fill="#ffd986" opacity=".7">${Array.from({ length: 12 }, (_, i) => `<rect x="${572 + (i % 2) * 8}" y="${280 + i * 12}" width="3" height="4"/>`).join('')}</g>` +
    `<path d="M0,${H} L0,455 Q200,430 420,452 T800,440 L${W},${H}Z" fill="#b97a3f"/><path d="M0,${H} L0,490 Q260,466 520,488 T800,476 L${W},${H}Z" fill="#9a6230"/>`,

  thailand: (r) =>
    sky([[0, '#ffb39b'], [0.6, '#ffe0b8'], [1, '#fff6e0']], 330) +
    sun(580, 160, 28, '#fff4cf', 'rgba(255,230,170,.55)') +
    `<defs>${grad('sea2', [[0, '#35bcc8'], [1, '#126f8b']])}</defs><rect y="320" width="${W}" height="${H - 320}" fill="url(#sea2)"/>` +
    // karsts
    [[120, 330, 90, 210], [250, 335, 70, 150], [560, 332, 110, 240], [700, 336, 80, 170]]
      .map(([x, y, w, h]) => `<path d="M${x - w / 2},${y} Q${x - w * 0.55},${y - h * 0.6} ${x - w * 0.25},${y - h * 0.9} Q${x},${y - h * 1.08} ${x + w * 0.28},${y - h * 0.9} Q${x + w * 0.56},${y - h * 0.6} ${x + w / 2},${y}Z" fill="#6f7f6c"/><path d="M${x - w * 0.25},${y - h * 0.9} Q${x},${y - h * 1.08} ${x + w * 0.28},${y - h * 0.9} Q${x},${y - h * 0.76} ${x - w * 0.25},${y - h * 0.9}Z" fill="#2f6b4a"/>`)
      .join('') +
    waves(r, 350, 500, '#d8f6f3', 24) +
    // longtail boat
    `<g transform="translate(300 430)"><path d="M0,0 H200 Q220,-4 236,-18 Q210,12 150,16 H20Z" fill="#2b2b36"/><path d="M60,-2 v-24 h90 v24" fill="#e8c46a"/><path d="M10,-2 H230" stroke="#e24a5a" stroke-width="4"/><path d="M236,-18 L330,-44" stroke="#3a2a1d" stroke-width="5" stroke-linecap="round"/><circle cx="330" cy="-44" r="6" fill="#3a2a1d"/>${[80, 110, 140].map((x, i) => `<path d="M${x},-26 v-12" stroke="${['#e24a5a', '#f6c453', '#2fb5a6'][i]}" stroke-width="3"/>`).join('')}</g>` +
    birds(r, 3, '#8a4b3a'),

  bali: (r) =>
    sky([[0, '#ffc999'], [0.6, '#ffe6c4'], [1, '#fff6e6']]) +
    sun(150, 150, 30, '#fff3c8', 'rgba(255,225,150,.55)') +
    hills(r, 270, 18, '#79b05a') +
    [[320, '#9ccf62'], [350, '#85c053'], [385, '#6bae45'], [425, '#589a3c'], [470, '#468533']]
      .map(([y, c], i) => `<path d="M0,${H} L0,${(y as number) + 24} Q${200 + i * 20},${(y as number) - 26} 420,${(y as number) + 4} T800,${(y as number) - 6 - i * 4} L800,${H}Z" fill="${c}"/><path d="M0,${(y as number) + 24} Q${200 + i * 20},${(y as number) - 26} 420,${(y as number) + 4} T800,${(y as number) - 6 - i * 4}" fill="none" stroke="#e8f3c8" stroke-width="2" opacity=".55"/>`)
      .join('') +
    // split temple gate
    `<g fill="#3d3a3a" transform="translate(470 250)">` +
    `<path d="M0,170 V70 l10,-8 v-20 l12,-8 v-18 l14,-10 v-18 l12,10 v30 l10,12 v30 l8,6 V170z"/><path d="M180,170 V70 l-10,-8 v-20 l-12,-8 v-18 l-14,-10 v-18 l-12,10 v30 l-10,12 v30 l-8,6 V170z" transform="translate(-4 0)"/></g>` +
    palm(90, 470, 260, 35, '#4d3524', '#2a6b3c', r) +
    palm(160, 490, 190, -15, '#4d3524', '#2f7a45', r) +
    palm(740, 480, 240, -40, '#4d3524', '#2a6b3c', r) +
    birds(r, 3, '#7a4a2a'),

  singapore: (r) =>
    sky([[0, '#0c1a45'], [0.6, '#265f8f'], [1, '#f0a07a']], 390) +
    stars(r, 50, 180) +
    Array.from({ length: 16 }, (_, i) => building(i * 52 - 10, 400, 36 + r() * 20, 60 + r() * 100, '#1a2f5a', r, '#ffe8a8')).join('') +
    // three towers with sky deck
    `<g fill="#0b1531">${[300, 390, 480].map((x) => `<polygon points="${x},400 ${x + 12},230 ${x + 52},230 ${x + 64},400"/>`).join('')}<path d="M255,226 H570 Q585,214 595,206 Q570,238 540,238 H290 Q270,238 255,226Z"/></g>` +
    `<g fill="#ffe8a8" opacity=".75">${Array.from({ length: 22 }, (_, i) => `<rect x="${316 + (i % 3) * 90 + (i % 2) * 14}" y="${250 + Math.floor(i / 3) * 18}" width="3" height="5"/>`).join('')}</g>` +
    // supertrees
    [[90, 330], [160, 300], [680, 320], [740, 290]]
      .map(([x, y]) => `<g><rect x="${x - 3}" y="${y}" width="6" height="${400 - y}" fill="#14223f"/><path d="M${x - 46},${y + 6} Q${x},${y - 38} ${x + 46},${y + 6} Q${x},${y - 6} ${x - 46},${y + 6}Z" fill="#c2368a"/><path d="M${x - 46},${y + 6} Q${x},${y - 6} ${x + 46},${y + 6}" fill="none" stroke="#35e0d0" stroke-width="3"/></g>`)
      .join('') +
    `<defs>${grad('bay', [[0, '#1c4a78'], [1, '#0a1c3f']])}</defs><rect y="400" width="${W}" height="${H - 400}" fill="url(#bay)"/>` +
    Array.from({ length: 24 }, (_, i) => `<rect x="${60 + i * 30 + r() * 12}" y="${410 + r() * 70}" width="2.5" height="${14 + r() * 26}" fill="${['#ffe8a8', '#35e0d0', '#e9559f'][i % 3]}" opacity=".35"/>`).join(''),

  maldives: (r) =>
    sky([[0, '#72d3ee'], [1, '#e4fbff']], 300) +
    sun(150, 110, 24, '#fffbe3') +
    `<defs>${grad('mv', [[0, '#0aa1bf'], [0.5, '#17cbd0'], [1, '#8cefdc']])}</defs><rect y="300" width="${W}" height="${H - 300}" fill="url(#mv)"/>` +
    waves(r, 320, 500, '#ffffff', 22) +
    // jetty and villas in perspective
    `<path d="M120,520 L430,340 L440,340 L180,520Z" fill="#a47a52" opacity=".95"/>` +
    [[0.0], [0.2], [0.42], [0.64], [0.84]]
      .map(([t]) => {
        const x = 440 - t * 330 + 0;
        const y = 340 + t * 150;
        const s = 0.5 + t * 1.15;
        return `<g transform="translate(${f(x + 20 * s)} ${f(y - 10 * s)}) scale(${f(s)})"><rect x="-4" y="8" width="3" height="16" fill="#6b4a2f"/><rect x="40" y="8" width="3" height="16" fill="#6b4a2f"/><rect x="0" y="-10" width="42" height="20" fill="#e9d3a4"/><polygon points="-8,-10 21,-34 50,-10" fill="#b8884e"/><rect x="16" y="-6" width="10" height="12" fill="#6b4a2f"/></g>`;
      })
      .join('') +
    `<path d="M520,330 q60,-24 120,0 q-20,10 -60,10 q-40,0 -60,-10Z" fill="#f3e3b8"/>` +
    palm(580, 330, 90, 18, '#5a3f2b', '#1f6b4a', r) +
    palm(620, 332, 70, -10, '#5a3f2b', '#28805a', r) +
    birds(r, 3, '#2f7f95'),

  vietnam: (r) =>
    sky([[0, '#c9e1e6'], [1, '#f8efe0']], 340) +
    sun(600, 150, 26, '#fff4d2', 'rgba(255,245,215,.6)') +
    [[0.55, 270, '#b6cbc8'], [0.75, 300, '#8fb0aa'], [1, 335, '#5d8a82']]
      .map(([o, y, c], k) => {
        let s = '';
        const n = 4 + k;
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * (W / n) + (r() - 0.5) * 50;
          const w = 90 + r() * 70;
          const h = 70 + r() * 90 + k * 20;
          s += `<path d="M${f(x - w / 2)},${y + 40} Q${f(x - w * 0.5)},${f(y - h * 0.6)} ${f(x - w * 0.15)},${f(y - h * 0.9)} Q${f(x + w * 0.05)},${f(y - h * 1.05)} ${f(x + w * 0.22)},${f(y - h * 0.85)} Q${f(x + w * 0.5)},${f(y - h * 0.5)} ${f(x + w / 2)},${y + 40}Z" fill="${c}" opacity="${o}"/>`;
        }
        return s;
      })
      .join('') +
    `<defs>${grad('jd', [[0, '#5a9d93'], [1, '#2a6b6a']])}</defs><rect y="335" width="${W}" height="${H - 335}" fill="url(#jd)"/>` +
    waves(r, 350, 500, '#d9efe9', 20) +
    // junk boat
    `<g transform="translate(300 440)"><path d="M0,0 H230 Q248,0 262,-14 H-14 Q-6,0 0,0Z" fill="#4a2e1c"/><path d="M70,-14 V-120 L150,-100 L136,-14Z" fill="#b5442a"/><path d="M130,-14 V-100 L205,-84 L192,-14Z" fill="#c9582f"/><path d="M70,-70 H146 M70,-42 H140 M130,-62 H198 M130,-34 H193" stroke="#7a2a17" stroke-width="2"/><rect x="68" y="-124" width="3" height="110" fill="#3a2414"/></g>` +
    // lanterns
    `<path d="M0,40 Q200,100 400,40 T800,40" fill="none" stroke="#7a4b2f" stroke-width="2"/>${Array.from({ length: 12 }, (_, i) => {
      const x = 50 + i * 65;
      const y = 62 + Math.sin(i * 0.8) * 14;
      return `<g><line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y}" stroke="#7a4b2f"/><ellipse cx="${x}" cy="${y + 10}" rx="9" ry="12" fill="${['#e8453c', '#f6b73c', '#e8453c', '#f08a3c'][i % 4]}"/></g>`;
    }).join('')}`,

  europe: (r) =>
    sky([[0, '#8fc3ec'], [1, '#f3f8fc']]) +
    sun(120, 110, 20, '#fffbe6') +
    ridge(r, 330, 130, 230, 8, '#9fb4cf', '#ffffff') +
    hills(r, 365, 24, '#6da552') +
    // village with church spire
    `<g transform="translate(470 330)"><rect x="0" y="20" width="34" height="46" fill="#efe4d0"/><polygon points="-4,20 17,-4 38,20" fill="#a8493a"/><rect x="48" y="34" width="46" height="32" fill="#efe4d0"/><polygon points="44,34 71,12 98,34" fill="#a8493a"/><rect x="-46" y="38" width="38" height="28" fill="#f4ead8"/><polygon points="-50,38 -27,20 -4,38" fill="#7b3a30"/></g>` +
    `<g transform="translate(300 290)"><rect x="0" y="40" width="30" height="76" fill="#efe4d0"/><polygon points="-3,40 15,-14 33,40" fill="#3f6b8a"/><circle cx="15" cy="62" r="7" fill="#fff"/><path d="M15,62 v-5 M15,62 h4" stroke="#333" stroke-width="1.5"/></g>` +
    hills(r, 410, 20, '#7cbb5f') +
    hills(r, 455, 18, '#5d9f45') +
    Array.from({ length: 40 }, () => `<circle cx="${f(r() * W)}" cy="${f(440 + r() * 75)}" r="${f(1.5 + r() * 1.8)}" fill="${['#fff', '#ffd54a', '#ff7a7a', '#c78cff'][Math.floor(r() * 4)]}"/>`).join('') +
    // chalet
    `<g transform="translate(90 385)"><rect x="0" y="22" width="110" height="64" fill="#8a5a3a"/><polygon points="-14,24 55,-22 124,24" fill="#5a3a26"/><rect x="18" y="42" width="20" height="22" fill="#ffd98a"/><rect x="72" y="42" width="20" height="22" fill="#ffd98a"/><rect x="44" y="52" width="22" height="34" fill="#3b2a1d"/></g>` +
    birds(r, 3, '#51677f'),
};

export const SCENE_SLUGS = Object.keys(scenes);

/** Full SVG document for a destination. */
export function artSvg(slug: string): string {
  const scene = scenes[slug];
  if (!scene) throw new Error(`No artwork scene for ${slug}`);
  const body = scene(rng(slug));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration">${body}</svg>`;
}

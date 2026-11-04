// graphics.js
// Generates all visual elements as inline SVG strings — no image assets.
// Three families: staff notation, fingering diagrams, and the home-screen
// instrument icon set (a small custom line-icon system).

const Graphics = (() => {

  const HALF = 8;           // px per diatonic staff step
  const STAFF_SPACE = 2 * HALF; // px between two adjacent staff lines
  const STAFF_BOTTOM_Y = 140; // y of pos0 (E4, bottom line)
  const STAFF_LEFT_X = 30;
  const STAFF_RIGHT_X = 105;
  const INK = 'var(--dg-ink)';   // staff lines, clef, strong outlines
  const OPEN = 'var(--dg-open)'; // open hole / vent interior

  function yForPos(pos) { return STAFF_BOTTOM_Y - pos * HALF; }

  function ledgerPositions(pos) {
    const out = [];
    if (pos > 8) {
      const maxL = (pos % 2 === 0) ? pos : pos - 1;
      for (let p = 10; p <= maxL; p += 2) out.push(p);
    } else if (pos < 0) {
      const minL = (pos % 2 === 0) ? pos : pos + 1;
      for (let p = -2; p >= minL; p -= 2) out.push(p);
    }
    return out;
  }

  // ── CLEF GLYPHS ──────────────────────────────────────────────────────────
  // Every clef has a "reference line" that must land on one specific staff
  // position: the treble clef's spiral sits on the G line, the bass clef's two
  // dots straddle the F line, and the alto clef's arrow heads point at the
  // middle line (that is what makes it an alto clef).
  //
  // The shapes are Bravura's outlines, embedded as paths (see fonts/OFL.txt)
  // instead of drawn from a system font. That keeps them identical on macOS,
  // Windows, Linux and Android — no glyph fallback, no font-specific metrics,
  // and the clef cannot shift when a fallback font is picked. Coordinates are
  // font units (250 per staff space) with the origin on the clef's reference
  // line, which is exactly where the staff line must pass.
  const CLEF_UNITS_PER_SPACE = 250;
  const CLEF_GLYPH = {
    treble: {
      refPos: 2,
      xMin: 0, xMax: 671, top: 1098, bottom: -658,
      path: 
      'M376 415C374 427 376 428 382 434C398 449 419 470 438 491C522 583 572 702 572 815C572 902 548 988 507 1048 '
      + 'C492 1070 466 1098 455 1098C441 1098 410 1072 390 1050C316 968 292 843 292 739C292 681 299 616 306 575 '
      + 'C308 563 309 561 297 551C233 498 164 437 112 373C43 287 0 194 0 87C0 -87 119 -252 364 -252 '
      + 'C387 -252 413 -250 433 -246C444 -244 446 -243 448 -255C460 -322 475 -409 475 -456C475 -604 375 -622 316 -622 '
      + 'C262 -622 236 -606 236 -593C236 -586 245 -583 268 -576C299 -567 335 -540 335 -482C335 -427 300 -380 239 -380 '
      + 'C172 -380 132 -433 132 -495C132 -560 171 -658 322 -658C389 -658 519 -628 519 -458C519 -401 501 -306 490 -244 '
      + 'C488 -232 489 -233 503 -227C604 -187 671 -102 671 11C671 139 577 252 430 252C404 252 404 252 401 270ZM470 943 '
      + 'C503 943 530 916 530 861C530 792 497 728 419 650C403 634 379 611 356 591C349 585 345 586 343 599 '
      + 'C339 625 337 659 337 691C337 847 409 943 470 943ZM361 262C364 243 364 244 346 238C258 208 201 129 201 44 '
      + 'C201 -46 248 -110 316 -133C324 -136 336 -139 343 -139C351 -139 355 -134 355 -128C355 -121 347 -118 340 -115 '
      + 'C298 -97 268 -54 268 -8C268 49 307 92 368 109C384 113 386 112 388 101L438 -197C440 -208 439 -208 424 -211 '
      + 'C408 -214 388 -216 368 -216C193 -216 80 -119 80 20C80 79 90 158 173 252C233 319 279 356 326 394 '
      + 'C336 402 338 401 340 390ZM430 103C428 115 429 118 441 117C522 110 589 42 589 -46C589 -109 551 -160 495 -188 '
      + 'C483 -194 481 -194 479 -182Z',
    },
    alto: {
      refPos: 4,
      xMin: 0, xMax: 699, top: 506, bottom: -506,
      path: 
      'M230 482C230 496 223 503 209 503H208C194 503 187 496 187 482V-482C187 -496 194 -503 208 -503H209 '
      + 'C223 -503 230 -496 230 -482V-44C230 -36 235 -37 239 -38C265 -45 307 -71 328 -184C331 -200 337 -209 347 -209 '
      + 'C358 -209 363 -199 368 -182C381 -138 404 -89 475 -89C540 -89 558 -153 558 -284C558 -415 535 -474 452 -474 '
      + 'C430 -474 410 -471 394 -466C377 -461 367 -454 367 -447C367 -442 383 -436 394 -432C414 -425 434 -405 434 -367 '
      + 'C434 -323 405 -298 366 -298C323 -298 289 -327 289 -380C289 -443 344 -506 463 -506C627 -506 699 -391 699 -287 '
      + 'C699 -149 623 -53 490 -53C461 -53 442 -58 429 -62C424 -64 418 -65 413 -65C409 -65 404 -64 400 -61 '
      + 'C386 -52 364 -20 364 0C364 20 386 52 400 61C404 64 409 65 413 65C418 65 424 64 429 62C442 58 461 53 490 53 '
      + 'C623 53 699 149 699 287C699 391 627 506 463 506C344 506 289 443 289 380C289 327 323 298 366 298 '
      + 'C405 298 434 323 434 367C434 405 414 425 394 432C383 436 367 442 367 447C367 454 377 461 394 466 '
      + 'C410 471 430 474 452 474C535 474 558 415 558 284C558 153 540 89 475 89C404 89 381 138 368 182 '
      + 'C363 199 358 209 347 209C337 209 331 200 328 184C307 71 265 45 239 38C235 37 230 36 230 44ZM21 503 '
      + 'C7 503 0 496 0 482V-482C0 -496 7 -503 21 -503H107C121 -503 128 -496 128 -482V482C128 496 121 503 107 503Z',
    },
    bass: {
      refPos: 6,
      xMin: -5, xMax: 684, top: 262, bottom: -635,
      path: 
      'M252 262C78 262 0 135 0 39C0 -41 42 -110 123 -110C186 -110 229 -66 229 -4C229 60 182 100 133 100 '
      + 'C106 100 96 93 83 93C70 93 67 101 67 111C67 151 127 224 229 224C335 224 381 120 381 -37 '
      + 'C381 -140 359 -260 297 -356C237 -449 134 -534 10 -605C1 -610 -5 -615 -5 -623C-5 -629 -1 -635 8 -635 '
      + 'C13 -635 19 -633 25 -630C158 -565 286 -489 392 -375C479 -281 531 -159 531 -28C531 146 425 262 252 262ZM629 180 '
      + 'C598 180 574 156 574 125C574 94 598 70 629 70C660 70 684 94 684 125C684 156 660 180 629 180ZM630 -71 '
      + 'C599 -71 576 -94 576 -125C576 -156 599 -179 630 -179C661 -179 684 -156 684 -125C684 -94 661 -71 630 -71Z',
    },
  };

  // Height in staff spaces, used by the tests and the layout comments.
  const CLEF_SPACES = {};
  Object.keys(CLEF_GLYPH).forEach(clef => {
    const g = CLEF_GLYPH[clef];
    CLEF_SPACES[clef] = (g.top - g.bottom) / CLEF_UNITS_PER_SPACE;
  });

  // `yRef` is the y of the clef's reference line on the staff. The path's
  // origin sits on that line, so the transform places it directly.
  function clefText(clef, { x, yRef, space = STAFF_SPACE, color = INK }) {
    const g = CLEF_GLYPH[clef] || CLEF_GLYPH.treble;
    const s = space / CLEF_UNITS_PER_SPACE;
    return `<path class="clef clef-${clef}" d="${g.path}"`
      + ` transform="translate(${x.toFixed(2)} ${yRef.toFixed(2)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})"`
      + ` fill="${color}"/>`;
  }

  // Draw a clef with its left ink edge at `left`, so the horizontal placement
  // is the same for every glyph regardless of its side bearing.
  function clefAt(clef, left, space, yRef, color) {
    const g = CLEF_GLYPH[clef] || CLEF_GLYPH.treble;
    const s = space / CLEF_UNITS_PER_SPACE;
    return clefText(clef, { x: left - g.xMin * s, yRef, space, color });
  }

  // Width of a clef's ink in staff spaces.
  function clefWidth(clef) {
    const g = CLEF_GLYPH[clef] || CLEF_GLYPH.treble;
    return (g.xMax - g.xMin) / CLEF_UNITS_PER_SPACE;
  }

  // Where each clef's ink starts. The notehead sits to the right of the clef,
  // so the widest clef still clears it.
  const CLEF_STAFF_LEFT = { treble: 20, alto: 20, bass: 20 };
  const CLEF_MELODY_LEFT = { treble: 18, alto: 18, bass: 18 };
  // Song clefs are drawn at 0.8 of the staff spacing: a treble clef is about 7
  // staff spaces tall, so this reaches roughly 1.4 staff heights.
  const CLEF_MELODY_SCALE = 0.8;

  // ── STAFF NOTATION ──────────────────────────────────────────────────────
  function staffSVG({ pos, accidental = null, clef = 'treble', accentColor = 'var(--accent-warm)', width = 130 }) {
    const noteX = (STAFF_LEFT_X + STAFF_RIGHT_X) / 2 + 8;
    const noteY = yForPos(pos);
    const stemUp = pos <= 4;
    const lineColor = '#524F70';
    const renderH = width * (220 / 130);

    let svg = `<svg viewBox="0 0 130 220" width="${width}" height="${renderH}" xmlns="http://www.w3.org/2000/svg">`;

    // Staff lines
    for (let i = 0; i <= 8; i += 2) {
      const y = yForPos(i);
      svg += `<line x1="${STAFF_LEFT_X}" y1="${y}" x2="${STAFF_RIGHT_X}" y2="${y}" stroke="${lineColor}" stroke-width="1.5"/>`;
    }

    // Clef glyph (G clef for treble; simplified bass clef dots+curve otherwise)
    if (clef === 'treble') {
      svg += `<text x="${STAFF_LEFT_X - 14}" y="${STAFF_BOTTOM_Y + 8}" font-size="130" font-family="Georgia, 'Apple Symbols', serif" fill="${lineColor}">&#119070;</text>`;
    } else {
      svg += `<text x="${STAFF_LEFT_X - 10}" y="${yForPos(3) + 10}" font-size="80" font-family="Georgia, 'Apple Symbols', serif" fill="${lineColor}">&#119074;</text>`;
    }

    // Ledger lines
    ledgerPositions(pos).forEach(p => {
      const y = yForPos(p);
      svg += `<line x1="${noteX - 12}" y1="${y}" x2="${noteX + 12}" y2="${y}" stroke="${lineColor}" stroke-width="1.5"/>`;
    });

    // Accidental
    if (accidental) {
      svg += `<text x="${noteX - 24}" y="${noteY + 6}" font-size="22" fill="${accentColor}" font-family="Georgia, serif">${accidental}</text>`;
    }

    // Notehead (filled ellipse, slightly tilted)
    svg += `<ellipse cx="${noteX}" cy="${noteY}" rx="7.5" ry="5.5" fill="${accentColor}" transform="rotate(-18 ${noteX} ${noteY})"/>`;

    // Stem
    if (stemUp) {
      svg += `<line x1="${noteX + 7}" y1="${noteY}" x2="${noteX + 7}" y2="${noteY - 46}" stroke="${accentColor}" stroke-width="2"/>`;
    } else {
      svg += `<line x1="${noteX - 7}" y1="${noteY}" x2="${noteX - 7}" y2="${noteY + 46}" stroke="${accentColor}" stroke-width="2"/>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // ── MELODY STRIP (song step-through) ─────────────────────────────────
  // `notes` is a list of { pos, accidental, duration }. Duration is in beats:
  // 4 whole, 2 half, 1 quarter, 0.5 eighth, 1.5 dotted quarter. `gaps[g]` is
  // the rest, in beats, that comes before note g; `gaps[notes.length]` is a
  // rest at the end of the tune. `keySig` is the number of sharps (> 0) or
  // flats (< 0) in the key signature.
  //
  // The tune sits on a grid of bars. Bars are the same width in every system,
  // a bar line falls on every bar boundary, and a system holds `barsPerSystem`
  // bars. Notes are spaced by their value, so a quarter takes more room than an
  // eighth and less than a half.
  const KEY_SHARP_POS = [8, 5, 9, 6, 3, 7, 4];  // F C G D A E B
  const KEY_FLAT_POS = [4, 7, 3, 6, 2, 5, 1];   // B E A D G C F

  // Rest outlines are Bravura's (SIL OFL, see fonts/OFL.txt), like the clefs.
  // Units are SMuFL font units: 250 per staff space.
  const REST_GLYPH = {
    quarter: { x_min: 1, x_max: 270, d: 'M112 -55 C174 -141 135 -84 156 -111 C183 -161 177 -147 183 -158 C181 -167 183 -163 183 -166 C166 -174 179 -173 173 -174 C143 -170 160 -174 148 -171 C137 -170 141 -170 138 -170 L125 -166 C1 -304 50 -166 1 -233 C168 -527 1 -376 63 -446 C206 -540 180 -536 194 -540 C228 -531 216 -540 226 -537 C230 -521 229 -527 230 -524 C207 -487 230 -508 219 -497 C170 -435 189 -487 173 -448 C164 -397 166 -423 164 -410 C255 -292 164 -338 194 -292 C369 -317 297 -292 344 -308 L370 -318 C382 -320 376 -320 379 -320 C389 -314 386 -320 389 -318 C336 -232 389 -297 351 -249 C236 -32 281 -166 236 -112 C236 -27 236 -30 236 -29 L238 -17 C238 -13 238 -16 238 -14 C333 199 243 71 295 140 C338 220 337 206 338 213 C333 248 338 235 333 248 C95 526 333 248 120 501 C69 537 88 533 78 537 C40 507 55 537 40 527 C46 484 40 500 42 492 C134 291 52 468 134 395 C48 108 134 238 112 176 C27 66 33 94 27 78 C42 32 27 46 42 32 Z' },
    eighth: { x_min: 0, x_max: 247, d: 'M193 154 C96 251 193 207 150 251 C0 154 43 251 0 207 C39 81 0 124 17 98 C117 56 62 65 89 56 C173 66 137 56 157 60 C225 88 193 72 206 78 C232 89 228 89 230 89 C239 76 238 89 239 84 C238 60 239 72 239 66 C104 -343 233 39 130 -248 C145 -361 104 -360 137 -361 C196 -347 161 -361 181 -359 C341 161 200 -344 341 161 C356 217 347 187 354 210 C338 240 356 232 341 239 C323 235 336 240 331 240 C193 140 312 226 240 140 Z' },
    half: { x_min: 0, x_max: 282, d: 'M406 35 L406 167 C369 204 406 189 389 204 L37 204 C0 167 16 204 0 189 L0 35 C37 -3 0 14 16 -3 L369 -3 C406 35 389 -3 406 14 Z' },
    whole: { x_min: 0, x_max: 282, d: 'M406 -157 L406 -24 C369 13 406 -3 389 13 L37 13 C0 -24 16 13 0 -3 L0 -157 C37 -194 0 -177 16 -194 L369 -194 C406 -157 389 -194 406 -177 Z' },
  };

  // `ref` is the staff position the glyph origin sits on: the middle line for
  // quarter, eighth and half rests, and the fourth line for a whole rest.
  function restSVG(x, y, dur, color) {
    const kind = dur >= 4 ? 'whole' : dur >= 2 ? 'half' : dur >= 1 ? 'quarter' : 'eighth';
    const glyph = REST_GLYPH[kind];
    const ref = kind === 'whole' ? 6 : 4;
    const s = (STAFF_SPACE / 250) * 0.8;
    const tx = x - ((glyph.x_min + glyph.x_max) / 2) * s;
    return `<path class="rest rest-${kind}" d="${glyph.d}" fill="${color}" transform="translate(${tx.toFixed(2)} ${y(ref).toFixed(2)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})"/>`;
  }

  function melodySVG({ notes = [], highlightIndex = -1, clef = 'treble', accentColor = 'var(--accent-warm)', width = 320, barsPerSystem = 4, beatsPerBar = 4, timeSig = null, keySig = 0, pickup = 0, gaps = [] }) {
    if (!notes.length) return '';
    const VB_W = 360;
    const SYSTEM_H = 100;
    const TOP_LINE_Y = 34;
    const LEFT_X = 16;
    const RIGHT_X = VB_W - 12;
    const KEY_X = 56;
    const PAD = 4;
    const MIN_SPACE = 11;   // closest centre-to-centre distance between noteheads
    const HEAD_RX = 5.0;
    const bpb = timeSig ? timeSig.num * 4 / timeSig.den : beatsPerBar;
    const sigNum = timeSig ? timeSig.num : beatsPerBar;
    const sigDen = timeSig ? timeSig.den : 4;
    const keyCount = Math.min(Math.abs(keySig) || 0, 7);
    const sysStartX = KEY_X + keyCount * 8 + 26;
    const avail = RIGHT_X - sysStartX;
    const gapArr = Array.isArray(gaps) ? gaps : [];
    const positiveGap = g => (typeof gapArr[g] === 'number' && gapArr[g] > 0 ? gapArr[g] : 0);
    const durOf = n => (typeof n.duration === 'number' && n.duration > 0 ? n.duration : 1);

    const events = [];
    let beat = pickup;
    notes.forEach((n, g) => {
      const gap = positiveGap(g);
      if (gap) { events.push({ rest: true, dur: gap, start: beat }); beat += gap; }
      events.push({ rest: false, note: n, index: g, dur: durOf(n), start: beat });
      beat += durOf(n);
    });
    const tail = positiveGap(notes.length);
    if (tail) { events.push({ rest: true, dur: tail, start: beat }); beat += tail; }

    const nBars = Math.max(1, Math.ceil(beat / bpb - 1e-9));
    const barEvents = Array.from({ length: nBars }, () => []);
    events.forEach(e => {
      const bi = Math.min(nBars - 1, Math.floor(e.start / bpb + 1e-9));
      barEvents[bi].push(e);
    });

    // Event weights set the spacing: a quarter gets more room than an eighth,
    // and the bar must be wide enough that the tightest noteheads keep MIN_SPACE.
    // Bars per system shrink when the tune is dense, so the notes never collide.
    const weight = e => 1 + e.dur;
    const denomOf = evs => Math.max(evs.reduce((s, e) => s + weight(e), 0), bpb * 2);
    const barNeed = evs => {
      if (!evs.length) return 0;
      const minW = Math.min(...evs.map(weight));
      return MIN_SPACE * denomOf(evs) / minW + 2 * PAD;
    };
    const need = Math.max(...barEvents.map(barNeed));
    const perSystem = Math.max(1, Math.min(barsPerSystem, Math.floor(avail / need)));
    const barW = avail / perSystem;
    const systemCount = Math.ceil(nBars / perSystem);
    const VB_H = systemCount * SYSTEM_H + 30;
    const renderH = width * (VB_H / VB_W);

    const xOf = new Map();
    barEvents.forEach((evs, bi) => {
      const denom = denomOf(evs);
      const barX = sysStartX + (bi % perSystem) * barW;
      let cum = 0;
      evs.forEach(e => {
        xOf.set(e, barX + PAD + ((cum + weight(e) / 2) / denom) * (barW - 2 * PAD));
        cum += weight(e);
      });
    });

    // Runs of eighth notes inside one beat share a beam. In compound meters
    // such as 6/8 the beat is a dotted quarter, so a beam spans three eighths.
    const beamUnit = timeSig && timeSig.den === 8 && timeSig.num % 3 === 0 ? 1.5 : 1;
    const beamGroups = [];
    barEvents.forEach(evs => {
      let cur = null;
      evs.forEach(e => {
        const beamable = !e.rest && e.dur === 0.5;
        const prev = cur && cur[cur.length - 1];
        if (beamable && prev && Math.floor(prev.start / beamUnit + 1e-9) === Math.floor(e.start / beamUnit + 1e-9)) cur.push(e);
        else if (beamable) { cur = [e]; beamGroups.push(cur); }
        else cur = null;
      });
    });
    const beamUp = new Map();
    beamGroups.filter(g => g.length > 1).forEach(g => {
      const up = g.reduce((s, e) => s + e.note.pos, 0) / g.length <= 4;
      g.forEach(e => beamUp.set(e, up));
    });
    const stemUpOf = e => (beamUp.has(e) ? beamUp.get(e) : e.note.pos <= 4);

    let svg = `<svg viewBox="0 0 ${VB_W} ${VB_H}" width="${width}" height="${renderH.toFixed(1)}" xmlns="http://www.w3.org/2000/svg">`;
    const clefName = CLEF_GLYPH[clef] ? clef : 'treble';
    const cmet = CLEF_GLYPH[clefName];
    const keyPos = keySig > 0 ? KEY_SHARP_POS : KEY_FLAT_POS;
    const keyGlyph = keySig > 0 ? '\u266F' : '\u266D';

    for (let s = 0; s < systemCount; s++) {
      const topLineY = TOP_LINE_Y + s * SYSTEM_H;
      const y = pos => topLineY + (8 - pos) * HALF;
      const firstBar = s * perSystem;
      const bars = Math.min(perSystem, nBars - firstBar);
      const endX = sysStartX + bars * barW;
      const line = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w}"/>`;

      for (let p = 0; p <= 8; p += 2) svg += line(LEFT_X, y(p), endX, y(p), 1.3);
      svg += line(LEFT_X, y(8), LEFT_X, y(0), 1.3);
      svg += clefAt(clefName, CLEF_MELODY_LEFT[clefName], STAFF_SPACE * CLEF_MELODY_SCALE, y(cmet.refPos), INK);
      for (let i = 0; i < keyCount; i++) {
        svg += `<text x="${KEY_X + i * 8}" y="${y(keyPos[i]) + 6}" font-size="17" fill="${INK}" font-family="Georgia, serif">${keyGlyph}</text>`;
      }
      if (s === 0) {
        const sigX = KEY_X + keyCount * 8 + 12;
        svg += `<text x="${sigX}" y="${y(4) - 1}" font-size="24" font-weight="700" text-anchor="middle" font-family="Georgia, serif" fill="${INK}">${sigNum}</text>`;
        svg += `<text x="${sigX}" y="${y(2) + 14}" font-size="24" font-weight="700" text-anchor="middle" font-family="Georgia, serif" fill="${INK}">${sigDen}</text>`;
      }

      for (let b = 1; b < bars; b++) svg += line(sysStartX + b * barW, y(8), sysStartX + b * barW, y(0), 1.3);
      if (s === systemCount - 1) {
        svg += line(endX - 4, y(8), endX - 4, y(0), 1.3);
        svg += line(endX, y(8), endX, y(0), 3.5);
      } else {
        svg += line(endX, y(8), endX, y(0), 1.3);
      }

      for (let b = 0; b < bars; b++) {
        barEvents[firstBar + b].forEach(e => {
          const x = xOf.get(e);
          if (e.rest) { svg += restSVG(x, y, e.dur, INK); return; }
          const note = e.note;
          const color = e.index === highlightIndex ? accentColor : INK;
          const noteY = y(note.pos);
          const up = stemUpOf(e);
          if (e.index === highlightIndex) svg += `<circle cx="${x}" cy="${noteY}" r="12" fill="${accentColor}" opacity="0.18"/>`;
          svg += `<g data-note-index="${e.index}">`;
          ledgerPositions(note.pos).forEach(p => {
            svg += `<line x1="${x - 9}" y1="${y(p)}" x2="${x + 9}" y2="${y(p)}" stroke="${color}" stroke-width="1.3"/>`;
          });
          if (note.accidental) {
            svg += `<text x="${x - 13}" y="${noteY + 5}" font-size="17" fill="${color}" font-family="Georgia, serif">${note.accidental}</text>`;
          }
          const open = e.dur >= 2;
          svg += `<ellipse cx="${x}" cy="${noteY}" rx="${HEAD_RX}" ry="4.2" fill="${open ? 'none' : color}" stroke="${open ? color : OPEN}" stroke-width="${open ? 1.8 : 1.2}" transform="rotate(-18 ${x} ${noteY})"/>`;
          if (e.dur === 1.5) svg += `<circle cx="${x + 10}" cy="${noteY}" r="1.6" fill="${color}"/>`;
          if (e.dur < 4) {
            const stemX = up ? x + 5.5 : x - 5.5;
            const stemEnd = up ? noteY - 32 : noteY + 32;
            svg += `<line x1="${stemX}" y1="${noteY}" x2="${stemX}" y2="${stemEnd}" stroke="${color}" stroke-width="1.6"/>`;
          }
          svg += `</g>`;
        });
      }

      beamGroups.forEach(g => {
        const first = g[0];
        const last = g[g.length - 1];
        const bi0 = Math.min(nBars - 1, Math.floor(first.start / bpb + 1e-9));
        if (bi0 < firstBar || bi0 >= firstBar + bars) return;
        const color = g.some(e => e.index === highlightIndex) ? accentColor : INK;
        if (g.length === 1) {
          const e = first;
          const up = stemUpOf(e);
          const sx = xOf.get(e) + (up ? 5.5 : -5.5);
          const sy = up ? y(e.note.pos) - 32 : y(e.note.pos) + 32;
          const ex = sx - (up ? 9 : -9);
          const ey = up ? y(e.note.pos) - 22 : y(e.note.pos) + 22;
          const cx = (sx + ex) / 2;
          const cy = (sy + ey) / 2;
          svg += `<path d="M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        } else if (g.length === 2) {
          const e1 = first;
          const e2 = last;
          const up = stemUpOf(e1);
          const p1 = [xOf.get(e1) + (up ? 5.5 : -5.5), up ? y(e1.note.pos) - 32 : y(e1.note.pos) + 32];
          const p2 = [xOf.get(e2) + (up ? 5.5 : -5.5), up ? y(e2.note.pos) - 32 : y(e2.note.pos) + 32];
          const midX = (p1[0] + p2[0]) / 2;
          const midY = (p1[1] + p2[1]) / 2;
          svg += `<path d="M${p1[0]} ${p1[1]} Q${midX} ${midY} ${p2[0]} ${p2[1]}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        } else {
          const up = beamUp.get(first);
          const ends = e => [xOf.get(e) + (up ? 5.5 : -5.5), y(e.note.pos) + (up ? -32 : 32)];
          const [x1, y1] = ends(first);
          const [x2, y2] = ends(last);
          svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3.5"/>`;
        }
      });
    }

    svg += `</svg>`;
    return svg;
  }

  // ── RECORDER FINGERING DIAGRAM ──────────────────────────────────────────
  function recorderFingeringSVG(fingeringState, accentColor = 'var(--accent-warm)', size = 130, splitHoles = [], splitHoleState = {}) {
    const [thumb, h1, h2, h3, h4, h5, h6, h7] = fingeringState;
    const cx = 65;
    const tubeTop = 18, tubeBottom = 215, tubeW = 30;
    const holeYs = [62, 84, 106, 132, 154, 176, 198]; // h1..h7
    const holes = [h1, h2, h3, h4, h5, h6, h7];
    const splitSet = new Set(splitHoles || []);

    let svg = `<svg viewBox="0 0 130 230" width="${size}" height="${size * 230 / 130}" xmlns="http://www.w3.org/2000/svg">`;

    // Mouthpiece notch
    svg += `<path d="M ${cx - 14} ${tubeTop} Q ${cx} ${tubeTop - 10} ${cx + 14} ${tubeTop} L ${cx + 15} ${tubeTop + 14} L ${cx - 15} ${tubeTop + 14} Z" fill="#3A3868" stroke="#524F70" stroke-width="1.5"/>`;

    // Tube body
    svg += `<rect x="${cx - tubeW/2}" y="${tubeTop + 12}" width="${tubeW}" height="${tubeBottom - tubeTop - 12}" rx="10" fill="#21204A" stroke="#3A3868" stroke-width="1.5"/>`;

    // Joint lines (decorative, suggests head/body/foot joints)
    svg += `<line x1="${cx - tubeW/2}" y1="70" x2="${cx + tubeW/2}" y2="70" stroke="#3A3868" stroke-width="1.5"/>`;
    svg += `<line x1="${cx - tubeW/2}" y1="188" x2="${cx + tubeW/2}" y2="188" stroke="#3A3868" stroke-width="1.5"/>`;

    // Thumb hole (back) — offset left with dashed connector + label
    const thumbY = 46;
    svg += `<line x1="${cx - tubeW/2 - 2}" y1="${thumbY}" x2="${cx - tubeW/2 - 22}" y2="${thumbY}" stroke="#524F70" stroke-width="1" stroke-dasharray="2,2"/>`;
    svg += `<circle cx="${cx - tubeW/2 - 28}" cy="${thumbY}" r="9" fill="${thumb ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
    svg += `<text x="${cx - tubeW/2 - 28}" y="${thumbY + 24}" font-size="9" fill="#8986A8" text-anchor="middle" font-weight="600">TH</text>`;

    // Finger holes 1-7 down the front. Holes 6 and 7 may be split (double)
    // holes on alto/bass recorders: left sub-hole ~60% size, right ~35%.
    holes.forEach((covered, i) => {
      const holeNum = i + 1;
      const y = holeYs[i];
      const r = i < 3 ? 9 : 7.5;
      if (splitSet.has(holeNum)) {
        const state = (splitHoleState && splitHoleState[holeNum]) || 'both';
        const leftFilled = !!covered && (state === 'left' || state === 'both');
        const rightFilled = !!covered && (state === 'right' || state === 'both');
        const leftR = r * 0.6;
        const rightR = r * 0.35;
        const leftX = cx - 5;
        const rightX = cx + 5;
        svg += `<circle cx="${leftX}" cy="${y}" r="${leftR}" fill="${leftFilled ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
        svg += `<circle cx="${rightX}" cy="${y}" r="${rightR}" fill="${rightFilled ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
      } else {
        svg += `<circle cx="${cx}" cy="${y}" r="${r}" fill="${covered ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  // ── BRASS VALVE FINGERING DIAGRAM (trumpet, euphonium, tuba style) ──────
  function valveFingeringSVG(fingeringState, accentColor = '#D4A017', size = 130) {
    const [v1, v2, v3] = fingeringState;
    const positions = [v1, v2, v3];
    const casingX = [34, 65, 96];
    const casingTop = 50, casingH = 110, casingW = 26;

    let svg = `<svg viewBox="0 0 130 200" width="${size}" height="${size * 200 / 130}" xmlns="http://www.w3.org/2000/svg">`;

    // Connecting leadpipe hint
    svg += `<line x1="10" y1="${casingTop + 14}" x2="120" y2="${casingTop + 14}" stroke="#3A3868" stroke-width="6" stroke-linecap="round"/>`;

    positions.forEach((pressed, i) => {
      const x = casingX[i];
      // Casing
      svg += `<rect x="${x - casingW/2}" y="${casingTop}" width="${casingW}" height="${casingH}" rx="13" fill="#21204A" stroke="#3A3868" stroke-width="1.5"/>`;
      // Button (moves down + fills when pressed)
      const buttonY = pressed ? casingTop + 30 : casingTop + 8;
      svg += `<circle cx="${x}" cy="${buttonY}" r="13" fill="${pressed ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2.5"/>`;
      // Valve number label
      svg += `<text x="${x}" y="${casingTop + casingH + 22}" font-size="13" font-weight="700" fill="#8986A8" text-anchor="middle">${i + 1}</text>`;
    });

    svg += `</svg>`;
    return svg;
  }

  // ── WOODWIND KEY DIAGRAM (flute, clarinet, sax, oboe, bassoon) ──────────
  // Simplified key pads on a tube — same visual language as recorder but with
  // a distinct label and smaller "key" circles to suggest pads not holes.
  function woodwindFingeringSVG(fingeringState, accentColor = '#7BAFC0', size = 130) {
    const [thumb, h1, h2, h3, h4, h5, h6, h7, extra] = fingeringState;
    const cx = 65;
    const tubeTop = 18, tubeBottom = 215, tubeW = 30;
    const allKeys = [h1, h2, h3, h4, h5, h6, h7];
    const keyYs = [62, 84, 106, 132, 154, 176, 198]; // h1..h7

    let svg = `<svg viewBox="0 0 130 230" width="${size}" height="${size * 230 / 130}" xmlns="http://www.w3.org/2000/svg">`;

    // Mouthpiece notch
    svg += `<path d="M ${cx - 14} ${tubeTop} Q ${cx} ${tubeTop - 10} ${cx + 14} ${tubeTop} L ${cx + 15} ${tubeTop + 14} L ${cx - 15} ${tubeTop + 14} Z" fill="#3A3868" stroke="#524F70" stroke-width="1.5"/>`;

    // Tube body
    svg += `<rect x="${cx - tubeW/2}" y="${tubeTop + 12}" width="${tubeW}" height="${tubeBottom - tubeTop - 12}" rx="10" fill="#21204A" stroke="#3A3868" stroke-width="1.5"/>`;

    // Joint lines (decorative, suggests upper/middle/lower joint)
    svg += `<line x1="${cx - tubeW/2}" y1="70" x2="${cx + tubeW/2}" y2="70" stroke="#3A3868" stroke-width="1.5"/>`;
    svg += `<line x1="${cx - tubeW/2}" y1="188" x2="${cx + tubeW/2}" y2="188" stroke="#3A3868" stroke-width="1.5"/>`;

    // Extra key (register / octave) — small filled circle above LH1
    if (extra !== undefined) {
      const exY = keyYs[0] - 30;
      svg += `<circle cx="${cx}" cy="${exY}" r="6" fill="${extra ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${exY + 20}" font-size="8" fill="#8986A8" text-anchor="middle" font-weight="600">R</text>`;
    }

    // Thumb key (offset left of tube — same layout as recorder)
    const thumbY = 46;
    svg += `<line x1="${cx - tubeW/2 - 2}" y1="${thumbY}" x2="${cx - tubeW/2 - 22}" y2="${thumbY}" stroke="#524F70" stroke-width="1" stroke-dasharray="2,2"/>`;
    svg += `<circle cx="${cx - tubeW/2 - 28}" cy="${thumbY}" r="9" fill="${thumb ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2"/>`;
    svg += `<text x="${cx - tubeW/2 - 28}" y="${thumbY + 24}" font-size="9" fill="#8986A8" text-anchor="middle" font-weight="600">TH</text>`;

    // Finger keys 1-7 down the tube — circles for key pads
    allKeys.forEach((pressed, i) => {
      const y = keyYs[i];
      const r = i < 3 ? 9 : 7.5;
      svg += `<circle cx="${cx}" cy="${y}" r="${r}" fill="${pressed ? accentColor : '#161530'}" stroke="${accentColor}" stroke-width="2.5"/>`;
    });

    svg += `</svg>`;
    return svg;
  }

  // ── TROMBONE SLIDE POSITION DIAGRAM ──────────────────────────────────────
  // Shows a tube with 7 position markers. The current position is highlighted.
  function tromboneFingeringSVG(position, accentColor = '#C0A020', size = 130) {
    const tubeY = 50;
    const tubeLeft = 20, tubeRight = 110;
    const tubeLen = tubeRight - tubeLeft;
    const posCount = 7;
    const posSpacing = (tubeLen - 20) / (posCount - 1);
    const posStart = tubeLeft + 10;

    let svg = `<svg viewBox="0 0 130 100" width="${size}" height="${size * 100 / 130}" xmlns="http://www.w3.org/2000/svg">`;

    // Slide tube
    svg += `<line x1="${tubeLeft}" y1="${tubeY}" x2="${tubeRight}" y2="${tubeY}" stroke="#524F70" stroke-width="4" stroke-linecap="round"/>`;
    // Inner slide (extends out to current position)
    const slideEnd = posStart + (position - 1) * posSpacing;
    svg += `<line x1="${tubeLeft}" y1="${tubeY}" x2="${slideEnd}" y2="${tubeY}" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>`;

    // Position markers and labels
    for (let i = 1; i <= posCount; i++) {
      const x = posStart + (i - 1) * posSpacing;
      const isActive = i === position;
      const dotColor = isActive ? accentColor : '#3A3868';
      svg += `<circle cx="${x}" cy="${tubeY}" r="${isActive ? 5 : 3.5}" fill="${dotColor}" stroke="${isActive ? accentColor : 'none'}" stroke-width="2"/>`;
      svg += `<text x="${x}" y="${tubeY + 20}" font-size="10" font-weight="${isActive ? '800' : '500'}" fill="${isActive ? accentColor : '#524F70'}" text-anchor="middle">${i}</text>`;
    }

    // Mouthpiece hint
    svg += `<rect x="${tubeLeft - 8}" y="${tubeY - 3}" width="8" height="6" rx="3" fill="#3A3868"/>`;

    // Bell hint
    svg += `<path d="M${tubeRight} ${tubeY - 8} Q${tubeRight + 12} ${tubeY} ${tubeRight} ${tubeY + 8}" stroke="#524F70" stroke-width="3" fill="none" stroke-linecap="round"/>`;

    // Label
    svg += `<text x="65" y="${tubeY + 42}" font-size="9" font-weight="600" fill="#8986A8" text-anchor="middle" letter-spacing="0.15em">POSITION</text>`;

    svg += `</svg>`;
    return svg;
  }

  function fingeringSVG(fingeringType, fingeringState, accentColor, size = 130, splitHoles = [], splitHoleState = {}) {
    if (fingeringType === 'recorder') return recorderFingeringSVG(fingeringState, accentColor, size, splitHoles, splitHoleState);
    if (fingeringType === 'trombone') return tromboneFingeringSVG(fingeringState, accentColor, size);
    if (['flute', 'clarinet', 'saxophone', 'oboe', 'bassoon'].includes(fingeringType)) {
      return woodwindFingeringSVG(fingeringState, accentColor, size);
    }
    return valveFingeringSVG(fingeringState, accentColor, size);
  }

  // ── INSTRUMENT ICON SET (home screen) ───────────────────────────────────
  // Consistent line-icon language: currentColor stroke, 64x64 viewBox.
  function instrumentIconSVG(id, size = 56) {
    const s = (inner) => `<svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

    switch (id) {
      case 'soprano-recorder':
        return s(`
          <path d="M26 8 Q32 4 38 8 L40 18 L24 18 Z"/>
          <rect x="25" y="18" width="14" height="38" rx="5"/>
          <line x1="25" y1="28" x2="39" y2="28"/>
          <line x1="25" y1="46" x2="39" y2="46"/>
          <circle cx="32" cy="34" r="1.8" fill="currentColor"/>
          <circle cx="32" cy="40" r="1.8" fill="currentColor"/>
          <path d="M27 56 L30 60 M37 56 L34 60" />
        `);
      case 'alto-recorder':
        return s(`
          <path d="M24 8 Q32 4 40 8 L42 20 L22 20 Z"/>
          <rect x="21" y="20" width="22" height="40" rx="6"/>
          <line x1="21" y1="32" x2="43" y2="32"/>
          <line x1="21" y1="52" x2="43" y2="52"/>
          <circle cx="32" cy="40" r="2" fill="currentColor"/>
          <circle cx="32" cy="46" r="2" fill="currentColor"/>
          <path d="M26 60 L30 64 M38 60 L34 64" />
        `);
      case 'tenor-recorder':
        return s(`
          <path d="M26 6 Q32 2 38 6 L40 16 L24 16 Z"/>
          <rect x="25" y="16" width="14" height="44" rx="5"/>
          <line x1="25" y1="26" x2="39" y2="26"/>
          <line x1="25" y1="52" x2="39" y2="52"/>
          <circle cx="32" cy="36" r="1.8" fill="currentColor"/>
          <circle cx="32" cy="44" r="1.8" fill="currentColor"/>
          <path d="M27 60 L30 64 M37 60 L34 64" />
        `);
      case 'bass-recorder':
        return s(`
          <path d="M18 4 Q24 0 30 4 L34 8 Q36 12 34 16 L22 16 Q20 12 22 8 Z"/>
          <rect x="22" y="16" width="18" height="44" rx="7"/>
          <line x1="22" y1="28" x2="40" y2="28"/>
          <line x1="22" y1="52" x2="40" y2="52"/>
          <circle cx="31" cy="38" r="2.5" fill="currentColor"/>
          <circle cx="31" cy="46" r="2.5" fill="currentColor"/>
          <path d="M24 60 L28 64 M36 60 L32 64" />
          <path d="M28 4 L28 2 L34 2 L34 4" />
        `);
      case 'flute':
        return s(`
          <rect x="6" y="27" width="46" height="9" rx="4.5"/>
          <circle cx="16" cy="31.5" r="1.6" fill="currentColor"/>
          <circle cx="26" cy="31.5" r="1.6" fill="currentColor"/>
          <circle cx="36" cy="31.5" r="1.6" fill="currentColor"/>
          <path d="M52 27 L58 31.5 L52 36 Z"/>
          <line x1="10" y1="22" x2="10" y2="41" stroke-width="1.6"/>
        `);
      case 'clarinet':
        return s(`
          <path d="M27 6 L34 10 L31 16 L26 14 Z"/>
          <rect x="25" y="16" width="13" height="40" rx="3"/>
          <line x1="25" y1="26" x2="38" y2="26"/>
          <line x1="25" y1="36" x2="38" y2="36"/>
          <line x1="25" y1="46" x2="38" y2="46"/>
          <path d="M25 56 L22 60 L41 60 L38 56 Z"/>
        `);
      case 'alto-saxophone':
        return s(`
          <path d="M22 8 Q30 6 32 14 L34 38 Q34 50 24 50 Q16 50 17 42 Q18 36 26 38"/>
          <circle cx="22" cy="44" r="6.5"/>
          <circle cx="29" cy="20" r="1.6" fill="currentColor"/>
          <circle cx="31" cy="27" r="1.6" fill="currentColor"/>
          <circle cx="32" cy="33" r="1.6" fill="currentColor"/>
        `);
      case 'oboe':
        return s(`
          <path d="M29 6 L33 9 L31 13 L28 12 Z"/>
          <rect x="27" y="13" width="9" height="42" rx="2.5"/>
          <line x1="27" y1="24" x2="36" y2="24"/>
          <line x1="27" y1="35" x2="36" y2="35"/>
          <line x1="27" y1="46" x2="36" y2="46"/>
          <path d="M27 55 L25 60 L38 60 L36 55 Z"/>
        `);
      case 'bassoon':
        return s(`
          <rect x="20" y="20" width="9" height="38" rx="2.5"/>
          <rect x="33" y="20" width="9" height="38" rx="2.5"/>
          <path d="M20 58 Q20 62 24.5 62 Q29 62 29 58"/>
          <path d="M33 58 Q33 62 37.5 62 Q42 62 42 58"/>
          <path d="M20 20 Q20 12 26 12"/>
          <path d="M38 20 L44 14 L48 8" stroke-width="2"/>
          <line x1="20" y1="32" x2="29" y2="32"/>
          <line x1="33" y1="44" x2="42" y2="44"/>
        `);
      case 'trumpet':
        return s(`
          <line x1="6" y1="32" x2="26" y2="32" stroke-width="4"/>
          <rect x="24" y="22" width="6" height="20" rx="2"/>
          <rect x="32" y="22" width="6" height="20" rx="2"/>
          <rect x="40" y="22" width="6" height="20" rx="2"/>
          <circle cx="27" cy="20" r="3" fill="currentColor"/>
          <circle cx="35" cy="20" r="3" fill="currentColor"/>
          <circle cx="43" cy="20" r="3" fill="currentColor"/>
          <path d="M46 28 L58 24 Q60 32 58 40 L46 36 Z"/>
          <path d="M14 32 Q14 24 20 24 Q26 24 26 32" stroke-width="3"/>
        `);
      case 'trombone':
        return s(`
          <line x1="6" y1="28" x2="34" y2="28" stroke-width="4"/>
          <line x1="10" y1="38" x2="34" y2="38" stroke-width="4"/>
          <line x1="10" y1="28" x2="10" y2="38"/>
          <path d="M34 24 Q44 24 44 33 Q44 42 34 42"/>
          <path d="M44 26 L57 22 Q59 33 57 44 L44 40 Z"/>
        `);
      case 'french-horn':
        return s(`
          <path d="M18 40 Q8 32 14 18 Q20 8 34 12 Q46 16 44 30 Q42 40 34 38" stroke-width="3" fill="none"/>
          <path d="M34 38 Q46 42 46 28 Q44 16 34 12" stroke-width="3" fill="none"/>
          <path d="M18 40 L10 46 L6 42" stroke-width="2.5" fill="none"/>
          <circle cx="22" cy="20" r="2.2" fill="currentColor"/>
          <circle cx="29" cy="16" r="2.2" fill="currentColor"/>
          <circle cx="36" cy="18" r="2.2" fill="currentColor"/>
        `);
      case 'euphonium':
        return s(`
          <path d="M14 44 Q14 26 30 26 Q44 26 44 40" stroke-width="3"/>
          <rect x="24" y="20" width="7" height="22" rx="2.5"/>
          <rect x="33" y="20" width="7" height="22" rx="2.5"/>
          <circle cx="27.5" cy="17" r="3" fill="currentColor"/>
          <circle cx="36.5" cy="17" r="3" fill="currentColor"/>
          <path d="M44 32 Q56 30 58 20 Q59 12 51 10" stroke-width="3"/>
        `);
      case 'tuba':
        return s(`
          <path d="M14 46 Q10 36 18 26 Q26 18 38 22 Q46 24 46 36" stroke-width="3.5" fill="none"/>
          <path d="M46 36 Q58 38 56 24 Q54 12 44 8" stroke-width="3.5" fill="none"/>
          <ellipse cx="14" cy="48" rx="7" ry="5" stroke-width="2.5" fill="none"/>
          <rect x="24" y="18" width="8" height="22" rx="3"/>
          <rect x="34" y="18" width="8" height="22" rx="3"/>
          <circle cx="28" cy="15" r="2.5" fill="currentColor"/>
          <circle cx="38" cy="15" r="2.5" fill="currentColor"/>
        `);
      default:
        return s(`<circle cx="32" cy="32" r="20"/>`);
    }
  }

  // ── SONG SCORE (multi-note staff for full songs) ───────────────────────────
  function songStaffSVG({ notes, clef = 'treble', accentColor = 'var(--accent-warm)', keySig = 0, timeSig = null }) {
    const SPACING = 48;
    const MARGIN_R = 20;
    const H = 220;
    const lineColor = '#524F70';
    const noteColor = accentColor;

    // ── Compute layout: clef + key sig + time sig width → note start X ──
    const SHARP_STEPS = [8, 5, 2, 6, 3, 7, 4];
    const FLAT_STEPS  = [4, 7, 3, 6, 2, 5, 8];
    let accX = 52;
    if (keySig > 0)      accX += keySig * 14 + 8;
    else if (keySig < 0) accX += Math.abs(keySig) * 14 + 8;
    const noteStartX = accX + (timeSig ? 34 : 14);

    const totalW = Math.ceil(noteStartX + notes.length * SPACING + MARGIN_R);

    let s = `<svg viewBox="0 0 ${totalW} ${H}" width="${totalW}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;

    // Staff lines
    for (let i = 0; i <= 8; i += 2) {
      const y = yForPos(i);
      s += `<line x1="0" y1="${y}" x2="${totalW}" y2="${y}" stroke="${lineColor}" stroke-width="1.5"/>`;
    }

    // Clef
    if (clef === 'treble') {
      s += `<text x="10" y="${STAFF_BOTTOM_Y + 8}" font-size="121" font-family="Georgia, 'Apple Symbols', serif" fill="${lineColor}">&#119070;</text>`;
    } else {
      s += `<text x="12" y="${yForPos(3) + 10}" font-size="77" font-family="Georgia, 'Apple Symbols', serif" fill="${lineColor}">&#119074;</text>`;
    }

    // ── Key signature ────────────────────────────────────────────────────
    accX = 52;
    if (keySig > 0) {
      for (let i = 0; i < keySig && i < SHARP_STEPS.length; i++) {
        const y = yForPos(SHARP_STEPS[i]);
        s += `<text x="${accX + i * 14}" y="${y + 7}" font-size="22" fill="${lineColor}" font-family="Georgia, serif">♯</text>`;
      }
      accX += keySig * 14 + 8;
    } else if (keySig < 0) {
      const nFlat = Math.abs(keySig);
      for (let i = 0; i < nFlat && i < FLAT_STEPS.length; i++) {
        const y = yForPos(FLAT_STEPS[i]);
        s += `<text x="${accX + i * 14}" y="${y + 18}" font-size="22" fill="${lineColor}" font-family="Georgia, serif">♭</text>`;
      }
      accX += nFlat * 14 + 8;
    }

    // ── Time signature ──────────────────────────────────────────────────
    if (timeSig) {
      const tsX = accX + 4;
      s += `<text x="${tsX}" y="${yForPos(5) + 2}" font-size="26" fill="${lineColor}" font-family="Georgia, serif" text-anchor="middle">${timeSig.num}</text>`;
      s += `<text x="${tsX}" y="${yForPos(1) + 2}" font-size="26" fill="${lineColor}" font-family="Georgia, serif" text-anchor="middle">${timeSig.den}</text>`;
    }

    // ── Bar lines (every 4 beats) ──────────────────────────────────────
    const staffTop = yForPos(8) - HALF / 2;
    const staffBot = yForPos(0) + HALF / 2;
    let beatAccum = 0;
    for (let i = 0; i < notes.length; i++) {
      const dur = notes[i].dur || 'q';
      const beats = dur === 'h' ? 2 : dur === 'w' ? 4 : dur === '8' ? 0.5 : 1;
      beatAccum += beats;
      if (beatAccum >= 4 || i === notes.length - 1) {
        if (i < notes.length - 1) {
          const x = noteStartX + (i + 1) * SPACING - SPACING / 2;
          s += `<line x1="${x}" y1="${staffTop}" x2="${x}" y2="${staffBot}" stroke="${lineColor}" stroke-width="1.5"/>`;
        }
        beatAccum = 0;
      }
    }

    // End bar line (thin left, thick right)
    const endX = noteStartX + notes.length * SPACING - SPACING / 2;
    s += `<line x1="${endX}" y1="${staffTop}" x2="${endX}" y2="${staffBot}" stroke="${lineColor}" stroke-width="1.5"/>`;
    s += `<line x1="${endX + 3}" y1="${staffTop}" x2="${endX + 3}" y2="${staffBot}" stroke="${lineColor}" stroke-width="4"/>`;

    // ── Precompute beam groups ──────────────────────────────────────────
    const beamGroups = [];
    let grpStart = -1;
    for (let i = 0; i < notes.length; i++) {
      const d = notes[i].dur || 'q';
      if (d === '8') {
        if (grpStart === -1) grpStart = i;
        if (i - grpStart === 1) {
          beamGroups.push({ start: grpStart, end: i });
          grpStart = -1;
        }
      } else {
        if (grpStart !== -1 && i - grpStart >= 2) beamGroups.push({ start: grpStart, end: i - 1 });
        grpStart = -1;
      }
    }
    if (grpStart !== -1 && notes.length - grpStart >= 2) {
      beamGroups.push({ start: grpStart, end: notes.length - 1 });
    }

    const beamLookup = {};
    beamGroups.forEach(g => { beamLookup[g.start] = g.end; });
    const beamedSet = new Set();
    beamGroups.forEach(g => { for (let j = g.start; j <= g.end; j++) beamedSet.add(j); });

    // ── Notes ───────────────────────────────────────────────────────────
    notes.forEach((note, i) => {
      const x = noteStartX + i * SPACING;
      const y = yForPos(note.staffStep);
      const stemUp = note.staffStep <= 4;
      const dur = note.dur || 'q';
      const isHalf = dur === 'h';
      const isWhole = dur === 'w';
      const isEighth = dur === '8';
      const filled = !isHalf && !isWhole;
      const isBeamed = beamedSet.has(i);
      const isBeamStart = beamLookup[i] !== undefined;

      // Ledger lines
      ledgerPositions(note.staffStep).forEach(p => {
        const ly = yForPos(p);
        s += `<line x1="${x - 12}" y1="${ly}" x2="${x + 12}" y2="${ly}" stroke="${lineColor}" stroke-width="1.5"/>`;
      });

      // Accidental
      if (note.accidental) {
        s += `<text x="${x - 22}" y="${y + 6}" font-size="20" fill="${accentColor}" font-family="Georgia, serif">${note.accidental}</text>`;
      }

      s += `<g data-note-index="${i}">`;

      // Notehead
      if (filled) {
        s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${noteColor}" transform="rotate(-18 ${x} ${y})"/>`;
      } else {
        s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="none" stroke="${noteColor}" stroke-width="2.5" transform="rotate(-18 ${x} ${y})"/>`;
      }

      // Stem (no stem for whole notes)
      if (!isWhole) {
        if (stemUp) {
          s += `<line x1="${x + 6.5}" y1="${y}" x2="${x + 6.5}" y2="${y - 42}" stroke="${noteColor}" stroke-width="2"/>`;
        } else {
          s += `<line x1="${x - 6.5}" y1="${y}" x2="${x - 6.5}" y2="${y + 42}" stroke="${noteColor}" stroke-width="2"/>`;
        }

        if (isEighth && isBeamStart) {
          // Draw beam connecting this note to the last note in the group
          const lastIdx = beamLookup[i];
          const lastX = noteStartX + lastIdx * SPACING;
          const lastNote = notes[lastIdx];
          const lastY = yForPos(lastNote.staffStep);
          const lastStemUp = lastNote.staffStep <= 4;
          const bTipX1 = stemUp ? x + 6.5 : x - 6.5;
          const bTipY1 = stemUp ? y - 42 : y + 42;
          const bTipX2 = lastStemUp ? lastX + 6.5 : lastX - 6.5;
          const bTipY2 = lastStemUp ? lastY - 42 : lastY + 42;
          const bw = 8;
          if (stemUp) {
            s += `<polygon points="${bTipX1},${bTipY1} ${bTipX2},${bTipY2} ${bTipX2},${bTipY2 + bw} ${bTipX1},${bTipY1 + bw}" fill="${noteColor}"/>`;
          } else {
            s += `<polygon points="${bTipX1},${bTipY1} ${bTipX2},${bTipY2} ${bTipX2},${bTipY2 - bw} ${bTipX1},${bTipY1 - bw}" fill="${noteColor}"/>`;
          }
        } else if (isEighth && !isBeamed) {
          // Individual flag for standalone eighth notes
          const flagX = stemUp ? x + 6.5 : x - 6.5;
          const flagY = stemUp ? y - 42 : y + 42;
          s += `<path d="M${flagX} ${flagY} Q${flagX + 12} ${flagY + 6} ${flagX + 6} ${flagY + 16}" stroke="${noteColor}" stroke-width="2" fill="none"/>`;
        }
        // Beamed notes that are not the beam start: no flag, no beam drawn
      }

      s += `</g>`;
    });

    s += `</svg>`;
    return s;
  }

  return { staffSVG, songStaffSVG, melodySVG, fingeringSVG, recorderFingeringSVG, valveFingeringSVG, tromboneFingeringSVG, woodwindFingeringSVG, instrumentIconSVG, yForPos, ledgerPositions };
})();

// test-curriculum.js — integrity checks for js/curriculum.js (Preludio Recorder)

const fs = require('fs');
const path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, 'js', f), 'utf8');

const sandbox = new Function(`
${read('curriculum.js')}
return { CURRICULUM, INSTRUMENT_ORDER };
`);
const { CURRICULUM, INSTRUMENT_ORDER } = sandbox();

let pass = 0, fail = 0;
const failures = [];
function check(cond, msg) { if (cond) pass++; else { fail++; failures.push(msg); } }

// Every instrument in INSTRUMENT_ORDER must exist
for (const id of INSTRUMENT_ORDER) {
  check(!!CURRICULUM[id], `instrument ${id} missing from CURRICULUM`);
}

// Every lesson with a note must have a fingeringState array
for (const id of INSTRUMENT_ORDER) {
  const inst = CURRICULUM[id];
  if (!inst || !inst.lessons) continue;
  for (const l of inst.lessons) {
    if (l.type === 'song' || l.type === 'review') continue;
    if (!l.noteName) continue;
    check(Array.isArray(l.fingeringState), `${id}/${l.id} missing fingeringState`);
    check(typeof l.freq === 'number' && l.freq > 0, `${id}/${l.id} bad freq`);
    check(typeof l.staffStep === 'number', `${id}/${l.id} bad staffStep`);
    check(typeof l.description === 'string' && l.description.length > 0, `${id}/${l.id} empty description`);
  }
}

// fingering array length consistency per family
const REC_LEN = 8;
for (const id of INSTRUMENT_ORDER) {
  const inst = CURRICULUM[id];
  if (!inst || !inst.lessons) continue;
  for (const l of inst.lessons) {
    if (l.type === 'song' || l.type === 'review') continue;
    if (!l.fingeringState) continue;
    check(l.fingeringState.length === REC_LEN, `${id}/${l.id} fingeringState length ${l.fingeringState.length} != ${REC_LEN}`);
  }
}

// Each instrument must have a name and available flag
for (const id of INSTRUMENT_ORDER) {
  const inst = CURRICULUM[id];
  check(!!inst, `${id} missing`);
  if (!inst) continue;
  check(typeof inst.name === 'string' && inst.name.length > 0, `${id} missing name`);
  check(typeof inst.available === 'boolean', `${id} missing available flag`);
}

// ── Song meters: every song has a time signature, and no note crosses a bar line
{
  const DUR = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };
  const songs = Object.values(CURRICULUM).flatMap(inst => (inst.lessons || []).filter(l => l.type === 'song'));
  check(songs.length > 0, 'the curriculum has songs to check');
  songs.forEach(l => {
    check(l.timeSig && l.timeSig.num > 0 && l.timeSig.den > 0, `${l.id} (${l.noteName}) has a time signature`);
    if (!l.timeSig) return;
    const bpb = l.timeSig.num * 4 / l.timeSig.den;
    const pickup = l.pickup || 0;
    const durs = (l.noteIds || []).map((_, i) => { const d = (l.durations || [])[i]; return typeof d === 'number' ? d : (DUR[d] || 1); });
    let cum = 0, straddles = 0;
    const gaps = l.gaps || [];
    durs.forEach((d, i) => { cum += gaps[i] || 0; const s0 = cum - pickup; cum += d; const e0 = cum - pickup; if (Math.floor(s0 / bpb + 1e-9) !== Math.floor((e0 - 1e-9) / bpb)) straddles++; });
    const tail = cum + (gaps[durs.length] || 0) - pickup;
    if (Math.abs(tail / bpb - Math.round(tail / bpb)) >= 1e-9) console.log(`  WARN ${l.id} (${l.noteName}): the song does not fill whole bars (${tail} beats)`);
    check(straddles === 0, `${l.id} (${l.noteName}): no note crosses a bar line (${straddles} do)`);
  });
}

console.log(`${pass} passed, ${fail} failed`);
if (fail) { failures.slice(0,20).forEach(f => console.log('  FAIL:', f)); process.exit(1); }

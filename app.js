'use strict';
/* =====================================================================
   Mantra Box — wersja 2
   Trzy zakładki = trzy kanały, które grają JEDNOCZEŚNIE i nakładają się:
     Pętle 1      — hipnotyzujące pętle (jak w wersji 1)
     Pętle 2      — te same pętle, niezależny drugi kanał
     Moje dźwięki — nagrania z mikrofonu, dodane pliki, folder „dzwieki”
   Każdy kanał ma własną głośność, wysokość i pogłos (od „lasu” po „kosmos”).
   ===================================================================== */

const $ = id => document.getElementById(id);
const SR = 44100;
const midiToHz = m => 440 * 2 ** ((m - 69) / 12);

/* ---------------------------------------------------------------------
   1. Silnik dźwięku
   --------------------------------------------------------------------- */
let audio = null; // AudioContext — tworzony przy pierwszym „Graj”
let mix = null;   // wspólne wyjście wszystkich kanałów (z ogranicznikiem)

function ensureAudio() {
  if (audio) return;
  // iPhone: graj nawet przy włączonym przełączniku „cisza”
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  const Ctx = window.AudioContext || window.webkitAudioContext;
  audio = new Ctx();
  // Ogranicznik: gdy kilka zakładek gra naraz, dźwięk nie zacznie trzeszczeć
  mix = audio.createDynamicsCompressor();
  mix.threshold.value = -10;
  mix.knee.value = 8;
  mix.ratio.value = 8;
  mix.attack.value = 0.01;
  mix.release.value = 0.4;
  mix.connect(audio.destination);
}

/* ---------------------------------------------------------------------
   2. Pogłos — od małego „leśnego” po długi „kosmiczny”
   Suwak 0…1 zmienia: długość (0,3 s → 18 s), ilość pogłosu,
   wczesne odbicia (pieczara) i ciemnienie ogona.
   --------------------------------------------------------------------- */
function reverbName(r) {
  return r < 0.2 ? 'Las' : r < 0.4 ? 'Pieczara' : r < 0.6 ? 'Sala' : r < 0.8 ? 'Katedra' : 'Kosmos';
}

const impulseCache = new Map();

function getImpulse(r) {
  const key = Math.round(r * 20) / 20; // 21 wariantów wystarczy
  if (impulseCache.has(key)) return impulseCache.get(key);

  const sr = audio.sampleRate;
  const dur = 0.3 * Math.pow(60, key);   // 0,3 s … 18 s
  const pre = 0.004 + 0.05 * key;        // chwila ciszy przed pogłosem (większa przestrzeń)
  const p0 = Math.floor(pre * sr);
  const len = p0 + Math.floor(dur * sr);
  const buf = audio.createBuffer(2, len, sr);

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = p0; i < len; i++) {
      const t = (i - p0) / sr;
      const env = Math.exp(-6.9 * t / dur);                        // cichnie do −60 dB
      const bright = 0.12 + 0.88 * Math.exp(-t / (0.2 + dur * 0.3)); // ogon robi się ciemniejszy
      lp += bright * ((Math.random() * 2 - 1) - lp);
      d[i] = lp * env;
    }
    // wczesne odbicia od ścian — słychać je w lesie i w pieczarze
    if (key < 0.55) {
      for (let k = 0; k < 8; k++) {
        const at = p0 + Math.floor((0.006 + Math.random() * (0.03 + 0.12 * key)) * sr);
        if (at < len) d[at] += (Math.random() < 0.5 ? -1 : 1) * (0.9 - k * 0.08) * (1 - key);
      }
    }
  }
  impulseCache.set(key, buf);
  return buf;
}

/* ---------------------------------------------------------------------
   3. Kanał — jedna zakładka
   Głosy → wejście → (sucho + pogłos) → głośność kanału → głośniki
   --------------------------------------------------------------------- */
class Channel {
  constructor(id, source, index = 0) {
    this.id = id;
    this.source = source;
    this.index = index;
    this.playing = false;
    this.vol = 0.7;
    this.pitch = 1;
    this.rev = 0.45;
    this.current = null; // aktualnie grający dźwięk
    this.nodes = null;
    this.revTimer = null;
  }

  ensureNodes() {
    if (this.nodes) return;
    const input = audio.createGain();
    const dry = audio.createGain();
    const out = audio.createGain();
    out.gain.value = this.vol;
    out.connect(mix);
    input.connect(dry).connect(out);
    // dwa „gniazda” pogłosu, żeby zmiana była płynna (jeden cichnie, drugi narasta)
    const slots = [0, 1].map(() => {
      const g = audio.createGain();
      g.gain.value = 0;
      g.connect(out);
      return { conv: null, gain: g };
    });
    this.nodes = { input, dry, out, slots, active: 0 };
    this.applyReverb(true);
  }

  applyReverb(first = false) {
    const n = this.nodes;
    if (!n) return;
    const now = audio.currentTime;
    const next = first ? 0 : 1 - n.active;
    const slot = n.slots[next];
    if (slot.conv) slot.conv.disconnect();
    slot.conv = audio.createConvolver();
    slot.conv.buffer = getImpulse(this.rev);
    n.input.connect(slot.conv);
    slot.conv.connect(slot.gain);

    n.dry.gain.setTargetAtTime(1 - 0.45 * this.rev, now, 0.1);
    slot.gain.gain.setTargetAtTime(0.25 + 0.65 * this.rev, now, 0.15);
    if (!first) {
      const old = n.slots[n.active];
      old.gain.gain.setTargetAtTime(0, now, 0.15);
      const oldConv = old.conv;
      setTimeout(() => { if (old.conv === oldConv && oldConv) { oldConv.disconnect(); old.conv = null; } }, 1500);
    }
    n.active = next;
  }

  setReverb(r) {
    this.rev = r;
    clearTimeout(this.revTimer);
    this.revTimer = setTimeout(() => this.applyReverb(), 250); // przelicz po zatrzymaniu suwaka
  }

  setVolume(v) {
    this.vol = v;
    if (this.nodes) this.nodes.out.gain.setTargetAtTime(v, audio.currentTime, 0.03);
    const c = this.current;
    if (c && c.el && !c.fading) c.el.volume = v;
  }

  setPitch(v) {
    this.pitch = v;
    const c = this.current;
    if (!c) return;
    if (c.src) c.src.playbackRate.value = v;
    if (c.el) c.el.playbackRate = v;
  }

  async start() {
    ensureAudio();
    if (audio.state !== 'running') { try { await audio.resume(); } catch (e) {} }
    this.ensureNodes();
    const i = this.index;
    const res = await this.source.get(i);
    if (!this.playing || this.index !== i) return; // w międzyczasie zmieniono wybór lub zatrzymano
    if (!res) { this.stop(); updateScreen(); return; }
    const previous = this.current;
    this.current = res.buffer ? playBuffer(res.buffer, this) : playElement(res.url, this);
    fadeOut(previous);
  }

  play() { this.playing = true; this.start(); }
  stop() { this.playing = false; fadeOut(this.current); this.current = null; }
  toggle() { this.playing ? this.stop() : this.play(); }

  change(step) {
    const n = this.source.count();
    if (!n) return;
    this.index = (this.index + step + n) % n;
    if (this.playing) this.start();
  }
}

// Odtwarza gotowy dźwięk w pętli w danym kanale (z płynnym narastaniem)
function playBuffer(buffer, ch) {
  const src = audio.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.playbackRate.value = ch.pitch;
  const gain = audio.createGain();
  const now = audio.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + 1);
  src.connect(gain).connect(ch.nodes.input);
  src.start();
  return { src, gain };
}

// Zapasowy sposób dla plików z folderu przy otwarciu dwuklikiem
// (przeglądarka nie pozwala wtedy wczytać pliku do Web Audio — taki dźwięk gra bez pogłosu)
function playElement(url, ch) {
  const el = new Audio(url);
  el.loop = true;
  el.preservesPitch = false;
  el.webkitPreservesPitch = false;
  el.playbackRate = ch.pitch;
  el.volume = 0;
  el.play().catch(() => {});
  const voice = { el, fading: true };
  rampVolume(el, 0, () => ch.vol, 1000, () => { voice.fading = false; });
  return voice;
}

function rampVolume(el, from, toFn, ms, done) {
  const t0 = performance.now();
  const id = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    el.volume = Math.max(0, Math.min(1, from + (toFn() - from) * k));
    if (k >= 1) { clearInterval(id); if (done) done(); }
  }, 40);
}

function fadeOut(voice, seconds = 1) {
  if (!voice) return;
  if (voice.el) {
    voice.fading = true;
    rampVolume(voice.el, voice.el.volume, () => 0, seconds * 1000, () => {
      voice.el.pause();
      voice.el.removeAttribute('src');
      voice.el.load();
    });
    return;
  }
  const now = audio.currentTime;
  voice.gain.gain.cancelScheduledValues(now);
  voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
  voice.gain.gain.linearRampToValueAtTime(0, now + seconds);
  voice.src.stop(now + seconds + 0.05);
}

/* ---------------------------------------------------------------------
   4. Źródło: Pętle (wspólne dla „Pętle 1” i „Pętle 2”)
   Każda nuta: [start (s), dźwięk (MIDI), długość (s), głośność, narastanie (s)]
   Pętle są „suche” — pogłos dodaje kanał (suwak Pogłos).
   --------------------------------------------------------------------- */
const LOOPS = [
  { name: 'Świt',   len: 8,  wave: 'sine',     cutoff: 2000, notes: [[0,50,8,1],[0,57,8,.7],[2,66,3,.5],[5,64,3,.5]] },
  { name: 'Mgła',   len: 10, wave: 'triangle', cutoff: 900,  notes: [[0,45,10,1],[0,52,10,.6],[3,69,4,.4],[7,67,3,.4]] },
  { name: 'Dzwon',  len: 8,  wave: 'sine',     cutoff: 4000, rel: 4, notes: [[0,48,8,.5,1.5],[0,72,.1,1,.01],[2,79,.1,.7,.01],[4,76,.1,.8,.01],[6,74,.1,.6,.01]] },
  { name: 'Oddech', len: 7,  wave: 'sine',     cutoff: 1500, notes: [[0,53,3.5,1],[3.5,55,3.5,1],[0,41,7,.6]] },
  { name: 'Głębia', len: 12, wave: 'sawtooth', cutoff: 500,  notes: [[0,38,12,1],[0,45,12,.6],[6,50,6,.4]] },
  { name: 'Kropla', len: 6,  wave: 'sine',     cutoff: 5000, rel: 2.5, notes: [[0,52,6,.5,1.5],[0,84,.05,.5,.005],[1.5,81,.05,.4,.005],[3,79,.05,.5,.005],[4.5,76,.05,.4,.005]] },
  { name: 'Chór',   len: 9,  wave: 'triangle', cutoff: 1400, notes: [[0,57,9,.6],[0,60,9,.5],[0,64,9,.5],[4.5,67,4.5,.4]] },
  { name: 'Noc',    len: 11, wave: 'sine',     cutoff: 1800, notes: [[0,43,11,1],[0,50,11,.6],[2,62,3,.3],[6,65,4,.3]] },
  { name: 'Mantra', len: 8,  wave: 'square',   cutoff: 700,  notes: [[0,48,2,1],[2,51,2,1],[4,55,2,1],[6,53,2,1],[0,36,8,.5]] },
];
const TAIL = 5;
const loopCache = new Map();

async function renderLoop(def) {
  if (loopCache.has(def)) return loopCache.get(def);
  const total = def.len + TAIL;
  const ctx = new OfflineAudioContext(2, Math.ceil(total * SR), SR);
  const out = ctx.createGain();
  out.gain.value = 0.5;
  out.connect(ctx.destination);

  for (const [t, midi, dur, gain = 1, atk = 0.8] of def.notes) {
    const rel = Math.min(def.rel ?? 1.5, total - t - dur - 0.05);
    const end = t + dur + rel;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.25 * gain, t + Math.min(atk, dur));
    env.gain.setValueAtTime(0.25 * gain, t + dur);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = def.cutoff;
    filter.connect(env).connect(out);

    for (const detune of [-7, 0, 7]) {
      const osc = ctx.createOscillator();
      osc.type = def.wave;
      osc.frequency.value = midiToHz(midi);
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(t);
      osc.stop(end + 0.05);
    }
  }

  const raw = await ctx.startRendering();

  // Doklejamy wybrzmienie na początek, żeby pętla nie miała „szwu”
  const n = Math.round(def.len * SR);
  const buf = ctx.createBuffer(2, n, SR);
  let peak = 0;
  for (let ch = 0; ch < 2; ch++) {
    const src = raw.getChannelData(ch), dst = buf.getChannelData(ch);
    for (let i = 0; i < src.length; i++) dst[i % n] += src[i];
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(dst[i]));
  }
  const norm = peak > 0 ? 0.7 / peak : 1;
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < n; i++) d[i] *= norm;
  }
  loopCache.set(def, buf);
  return buf;
}

const loopsSource = {
  count: () => LOOPS.length,
  label: i => LOOPS[i].name,
  get: async i => ({ buffer: await renderLoop(LOOPS[i]) }),
};

/* ---------------------------------------------------------------------
   5. Źródło: Moje dźwięki
   Folder „dzwieki” (lista w dzwieki/lista.js), pliki dodane przyciskiem
   i nagrania z mikrofonu. Dodane i nagrane dźwięki zostają w pamięci
   przeglądarki (IndexedDB).
   --------------------------------------------------------------------- */
const DB_NAME = 'mantra-box', STORE = 'dzwieki';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbRun(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
}
const dbAll = () => dbRun('readonly', s => s.getAll());
const dbPut = rec => dbRun('readwrite', s => s.put(rec));
const dbDelete = id => dbRun('readwrite', s => s.delete(id));

function decode(data) {
  return new Promise((resolve, reject) => audio.decodeAudioData(data, resolve, reject));
}

const mineSource = {
  items: [],
  buffers: new Map(),
  count() { return this.items.length; },
  label(i) { return this.items[i] ? this.items[i].name : 'Brak dźwięków'; },

  async load() {
    const folder = (window.MOJE_DZWIEKI || []).map(file => ({
      id: 'folder:' + file,
      name: file.replace(/\.[^.]+$/, ''),
      url: 'dzwieki/' + encodeURIComponent(file),
      folder: true,
    }));
    let saved = [];
    try { saved = (await dbAll()).sort((a, b) => a.created - b.created); }
    catch (e) { console.warn('Brak dostępu do pamięci przeglądarki', e); }
    this.items = [...folder, ...saved];
  },

  async get(i) {
    const item = this.items[i];
    if (!item) { info('Nagraj dźwięk albo dodaj pliki, żeby coś zagrało.'); return null; }
    if (this.buffers.has(item.id)) return { buffer: this.buffers.get(item.id) };
    try {
      const data = item.blob
        ? await new Response(item.blob).arrayBuffer()
        : await (await fetch(item.url)).arrayBuffer();
      const buffer = await decode(data);
      this.buffers.set(item.id, buffer);
      return { buffer };
    } catch (e) {
      if (item.url) return { url: item.url };
      info('Nie udało się odczytać tego dźwięku.');
      return null;
    }
  },
};

/* ---------------------------------------------------------------------
   6. Kanały
   --------------------------------------------------------------------- */
const channels = [
  new Channel(0, loopsSource),
  new Channel(1, loopsSource),
  new Channel(2, mineSource),
];
const MINE = channels[2];
let sel = 0;              // wybrana zakładka
let status = null;        // chwilowy napis na wyświetlaczu
const box = $('box');

function info(text) { $('info').textContent = text || ''; }

function mineSummary() {
  const n = mineSource.items.length;
  if (!n) return 'Nagraj dźwięk mikrofonem albo dodaj pliki WAV / MP3.';
  const f = mineSource.items.filter(x => x.folder).length;
  return `Dźwięków: ${n}` + (f ? ` (z folderu „dzwieki”: ${f})` : '') + '. Każdy gra w pętli.';
}

function updateScreen() {
  const ch = channels[sel];
  const n = ch.source.count();
  ch.index = Math.min(ch.index, Math.max(0, n - 1));

  $('name').textContent = status || (n ? ch.source.label(ch.index) : 'Brak dźwięków');
  $('num').textContent = n ? `${ch.index + 1}/${n}` : '0/0';
  $('play').textContent = ch.playing ? '■ Stop' : '▶ Graj';
  box.dataset.track = sel;
  box.classList.toggle('playing', ch.playing);

  const any = channels.some(c => c.playing);
  box.classList.toggle('any', any);
  $('stopAll').disabled = !any;
  document.querySelectorAll('.tab').forEach((b, k) => {
    b.classList.toggle('active', k === sel);
    b.classList.toggle('on', channels[k].playing);
  });

  $('vol').value = ch.vol;
  $('pitch').value = ch.pitch;
  $('rev').value = ch.rev;
  $('revName').textContent = reverbName(ch.rev);
  $('mine').hidden = sel !== 2;
  savePrefs();
}

function select(k) {
  if (k === sel) return;
  sel = k;
  if (k === 2) info(mineSummary());
  updateScreen();
}

function stopAll() {
  channels.forEach(c => { if (c.playing) c.stop(); });
  updateScreen();
}

/* ---------------------------------------------------------------------
   7. Nagrywanie, dodawanie i usuwanie dźwięków
   --------------------------------------------------------------------- */
async function saveSound(name, blob) {
  const rec = { id: 'zapis:' + Date.now() + Math.random().toString(36).slice(2, 6), name, blob, created: Date.now() };
  try { await dbPut(rec); }
  catch (e) { info('Nie udało się zapisać dźwięku w pamięci przeglądarki.'); return false; }
  await mineSource.load();
  MINE.index = mineSource.items.findIndex(x => x.id === rec.id);
  return true;
}

let recorder = null, recTimer = null;

async function toggleRecord() {
  if (recorder) { recorder.stop(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    info('Tutaj nie da się nagrywać. Otwórz aplikację w Safari lub Chrome (najlepiej wersję z internetu).');
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
  } catch (e) {
    info('Brak dostępu do mikrofonu. Zezwól przeglądarce na użycie mikrofonu i spróbuj ponownie.');
    return;
  }
  stopAll(); // żeby głośniki nie nagrały się do mikrofonu

  const chunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  recorder.onstop = async () => {
    const type = recorder.mimeType || 'audio/webm';
    stream.getTracks().forEach(t => t.stop());
    clearInterval(recTimer);
    recorder = null;
    $('rec').classList.remove('on');
    $('rec').textContent = '● Nagraj';
    const blob = new Blob(chunks, { type });
    if (!blob.size) { info('Nagranie jest puste.'); return; }
    const d = new Date();
    const name = 'Nagranie ' + d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }) +
      ' ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    if (await saveSound(name, blob)) info('Zapisano „' + name + '”. Kliknij ▶ Graj.');
    updateScreen();
  };
  recorder.start();

  const t0 = Date.now();
  $('rec').classList.add('on');
  const tick = () => {
    const s = Math.floor((Date.now() - t0) / 1000);
    $('rec').textContent = `■ Stop ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  tick();
  recTimer = setInterval(tick, 500);
  info('Nagrywam… (pozostałe zakładki są wyciszone). Kliknij „Stop”, gdy skończysz.');
}

async function addFiles(files) {
  let ok = 0;
  for (const file of files) {
    const blob = new Blob([await new Response(file).arrayBuffer()], { type: file.type || 'audio/mpeg' });
    if (await saveSound(file.name.replace(/\.[^.]+$/, ''), blob)) ok++;
  }
  if (ok) info(`Dodano: ${ok}. ` + mineSummary());
  updateScreen();
}

async function deleteCurrent() {
  const i = MINE.index;
  const item = mineSource.items[i];
  if (!item) return;
  if (item.folder) {
    info('Ten dźwięk leży w folderze „dzwieki”. Usuń plik stamtąd i uruchom „odswiez-dzwieki”.');
    return;
  }
  if (!confirm(`Usunąć „${item.name}”?`)) return;
  if (MINE.playing) MINE.stop();
  await dbDelete(item.id);
  mineSource.buffers.delete(item.id);
  await mineSource.load();
  MINE.index = Math.max(0, Math.min(i, mineSource.items.length - 1));
  info('Usunięto. ' + mineSummary());
  updateScreen();
}

/* ---------------------------------------------------------------------
   8. Zapamiętywanie ustawień
   --------------------------------------------------------------------- */
function savePrefs() {
  try {
    localStorage.setItem('mantra-box-2', JSON.stringify({
      sel,
      channels: channels.map(c => ({ index: c.index, vol: c.vol, pitch: c.pitch, rev: c.rev })),
    }));
  } catch (e) {}
}
function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem('mantra-box-2'));
    if (!p) return;
    sel = p.sel ?? 0;
    (p.channels || []).forEach((s, k) => {
      const c = channels[k];
      if (!c || !s) return;
      c.index = s.index ?? 0;
      c.vol = s.vol ?? 0.7;
      c.pitch = s.pitch ?? 1;
      c.rev = s.rev ?? 0.45;
    });
  } catch (e) {}
}

/* ---------------------------------------------------------------------
   9. Przyciski, suwaki, klawiatura
   --------------------------------------------------------------------- */
const current = () => channels[sel];

$('play').onclick = () => { current().toggle(); updateScreen(); };
$('prev').onclick = () => { current().change(-1); updateScreen(); };
$('next').onclick = () => { current().change(1); updateScreen(); };
$('stopAll').onclick = stopAll;
document.querySelectorAll('.tab').forEach(b => { b.onclick = () => select(+b.dataset.track); });

$('vol').oninput = e => { current().setVolume(+e.target.value); savePrefs(); };
$('pitch').oninput = e => { current().setPitch(+e.target.value); savePrefs(); };
$('rev').oninput = e => {
  current().setReverb(+e.target.value);
  $('revName').textContent = reverbName(+e.target.value);
  savePrefs();
};

$('rec').onclick = toggleRecord;
$('add').onclick = () => $('file').click();
$('file').onchange = e => { addFiles([...e.target.files]); e.target.value = ''; };
$('del').onclick = deleteCurrent;

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
  if (e.code === 'Space') { e.preventDefault(); $('play').click(); }
  else if (e.code === 'ArrowLeft') { e.preventDefault(); $('prev').click(); }
  else if (e.code === 'ArrowRight') { e.preventDefault(); $('next').click(); }
  else if (e.code === 'Escape') stopAll();
  else if (e.key === '1' || e.key === '2' || e.key === '3') select(+e.key - 1);
});

// Tryb „aplikacji”: działanie bez internetu (tylko gdy strona jest w internecie lub na serwerze)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Start
loadPrefs();
updateScreen();
if (sel === 2) info(mineSummary());
mineSource.load().then(() => { if (sel === 2) info(mineSummary()); updateScreen(); });

# Mantra Box — wersja 2

Aplikacja do medytacyjnego słuchania. Trzy zakładki grają **jednocześnie** i nakładają się na siebie, tworząc własny pejzaż dźwiękowy. Każda zakładka ma własną głośność, wysokość i pogłos — od małego „leśnego” po długi „kosmiczny”. Działa w przeglądarce, a po umieszczeniu w internecie można ją zainstalować jako aplikację na Macu i iPhonie.

---

## 1. Wytyczne (zamówienie)

### 1a. Pierwsze zamówienie wersji 2

> Stwórz wersję drugą — wszystko działa tak, jak sobie wyobrażałem. W wersji 2 chciałbym, aby były minimum trzy ścieżki:
> 1. taka, jaką już stworzyłeś, czyli pętle hipnotyzujące,
> 2. własne dźwięki ambientalne nagrane mikrofonem lub wrzucone w dedykowany folder jako WAV lub MP3,
> 3. syntezowany dźwięk guzheng — pojedyncza struna, akord, arpeggio — wszystko w klimacie medytacyjnej harmonii.
>
> Chciałbym, aby aplikacja miała wersję HTML, ale także wersję działającą na macOS i iPhone.

### 1b. Korekty

> Zakładka Pętle jest OK — chciałbym, aby pojawiła się druga identyczna zakładka Pętle z tymi samymi dźwiękami. Dodatkowo chodzi o to, aby wszystkie zakładki odtwarzały dźwięki jednocześnie, nakładając się na siebie. Zakładkę Guzheng skasuj — wymaga dopracowania w kolejnej wersji. Każda z zakładek oprócz głośności i wysokości powinna mieć suwak „pogłos”, w którym możemy nadawać klimatu od małego leśno-pieczarowego pogłosiku po długi pogłos kosmiczny.

## 2. Jak spełniono wytyczne

| Wytyczna | Rozwiązanie |
|---|---|
| Zakładka **Pętle 1** | 9 hipnotyzujących pętli z wersji 1. |
| Druga identyczna zakładka **Pętle 2** | Te same 9 pętli, ale osobny, niezależny kanał. |
| **Moje dźwięki**: mikrofon | Przycisk **● Nagraj** — nagranie zapisuje się w aplikacji i gra w pętli. |
| **Moje dźwięki**: dedykowany folder | Folder `dzwieki/` + plik `odswiez-dzwieki.command`, który aktualizuje listę. |
| **Moje dźwięki**: dodawanie plików (dodatkowo) | Przycisk **＋ Dodaj pliki** — działa też na iPhonie (aplikacja Pliki). |
| Wszystkie zakładki grają **jednocześnie** | Każda zakładka to osobny kanał z własnym **Graj / Stop**. Kanały miksują się razem. |
| Suwak **Pogłos** w każdej zakładce | 5 klimatów płynnie: **Las → Pieczara → Sala → Katedra → Kosmos** (0,3 s → 18 s). |
| Guzheng usunięty | Kod zachowany w rozdziale 11 do dopracowania w wersji 3. |
| Wersja HTML | `index.html` — otwierasz dwuklikiem. |
| Wersja na macOS i iPhone | Aplikacja „instalowalna” (PWA): ikona, pełny ekran, działa bez internetu. Wymaga umieszczenia w internecie (np. GitHub Pages). |

## 3. Pliki

```
ver 2/
├── index.html               wygląd aplikacji
├── app.js                   cała logika i dźwięk
├── manifest.webmanifest     opis aplikacji dla Maca / iPhone’a (nazwa, ikona, kolory)
├── sw.js                    działanie bez internetu
├── odswiez-dzwieki.command  odświeża listę plików w folderze „dzwieki”
├── dzwieki/
│   └── lista.js             lista Twoich plików (tworzy się sama)
├── ikony/                   ikonki aplikacji (SVG + PNG 180/192/512)
└── DOKUMENTACJA.md          ten plik
```

## 4. Jak uruchomić

**Na Macu (wersja HTML):** kliknij dwa razy `index.html`.

**Jako aplikacja na Macu i iPhonie:** aplikacja musi być w internecie (np. darmowe GitHub Pages). Potem:
- **iPhone:** otwórz adres w Safari → **Udostępnij** → **Do ekranu początkowego**.
- **Mac (Safari):** otwórz adres → menu **Plik** → **Dodaj do Docka**.
- **Mac (Chrome):** ikona instalacji na końcu paska adresu → **Zainstaluj**.

## 5. Sterowanie

| Element | Co robi |
|---|---|
| Zakładki **Pętle 1 / Pętle 2 / Moje dźwięki** (klawisze **1 2 3**) | Wybór zakładki, którą sterujesz. Kropka przy nazwie świeci = ta zakładka gra. |
| **▶ Graj / ■ Stop** (spacja) | Włącza / wyłącza **tylko wybraną** zakładkę. Pozostałe grają dalej. |
| **◀ ▶** (strzałki) | Zmiana pętli lub nagrania w wybranej zakładce. |
| **Głośność** | Głośność wybranej zakładki. |
| **Wysokość** | Niżej i wolniej ↔ wyżej i szybciej (wybrana zakładka). |
| **Pogłos** | Przestrzeń: Las → Pieczara → Sala → Katedra → Kosmos (wybrana zakładka). |
| **■ Zatrzymaj wszystko** (Esc) | Wycisza wszystkie zakładki naraz. |
| **● Nagraj** | Nagrywanie z mikrofonu (na czas nagrania wszystko się wycisza). |
| **＋ Dodaj pliki** | Dodanie plików WAV / MP3 / M4A z dysku. |
| **Usuń** | Usuwa wybrane nagranie lub dodany plik. |

Każda zakładka pamięta swój wybór i położenie suwaków (także po zamknięciu aplikacji).

**Przykład:** Pętle 1 → „Głębia” z pogłosem Kosmos, Pętle 2 → „Kropla” z pogłosem Pieczara, Moje dźwięki → nagrany deszcz z pogłosem Las.

## 6. Pogłos — jak działa

Pogłos to „odbicia” dźwięku od otoczenia. Aplikacja tworzy go matematycznie (splot z wygenerowaną odpowiedzią pomieszczenia):

| Położenie suwaka | Klimat | Długość | Charakter |
|---|---|---|---|
| 0,0 – 0,2 | **Las** | 0,3 – 0,7 s | krótki, blisko, kilka wyraźnych odbić |
| 0,2 – 0,4 | **Pieczara** | 0,7 – 1,5 s | wyraźne odbicia od skał |
| 0,4 – 0,6 | **Sala** | 1,5 – 3,5 s | gładki, przestrzenny |
| 0,6 – 0,8 | **Katedra** | 3,5 – 8 s | długi, ciemniejący ogon |
| 0,8 – 1,0 | **Kosmos** | 8 – 18 s | bardzo długi, prawie nieskończony |

Im dalej w prawo, tym więcej pogłosu w miksie i dłuższa przerwa przed nim (wrażenie większej przestrzeni). Zmiana przelicza się po zatrzymaniu suwaka i przechodzi płynnie (bez trzasków).

## 7. Moje dźwięki

1. **Mikrofon** — **● Nagraj**, nagraj (deszcz, szum drzew, misa tybetańska…), **■ Stop**.
2. **Dodaj pliki** — wybierz pliki z dysku. Są kopiowane do pamięci aplikacji.
3. **Folder `dzwieki`** — wrzuć pliki WAV/MP3, kliknij dwa razy `odswiez-dzwieki.command`, odśwież stronę (**Cmd+R**).

Nagrania i dodane pliki zostają w pamięci tej przeglądarki na tym urządzeniu (nie synchronizują się między Makiem a iPhonem).

**Najlepsze pętle:** nagrania 10–60 s, bez wyraźnego początku i końca (np. jednostajny szum).

## 8. Jak to działa (dla ciekawych)

```
Pętle 1 ──┐                      ┌─ sucho ─────────┐
Pętle 2 ──┼─ każdy kanał: wejście┤                  ├─ głośność ─┐
Moje   ───┘                      └─ pogłos (splot) ─┘             ├─ ogranicznik ─ głośniki
                                                    (3 kanały) ───┘
```

- **Kanał** (`class Channel`) — każda zakładka ma własny łańcuch: wejście → sucho + pogłos → głośność.
- **Ogranicznik** — gdy grają trzy zakładki naraz, pilnuje, żeby dźwięk nie trzeszczał.
- **Pętle** są tworzone „na sucho” (bez pogłosu) — pogłos dodaje kanał, więc suwak ma pełną kontrolę.
- **Płynna zmiana pogłosu** — dwa gniazda pogłosu na kanał; nowy narasta, stary cichnie.
- **Pamięć** — ustawienia w `localStorage`, nagrania i pliki w `IndexedDB`.

## 9. Ograniczenia

- **iPhone:** dźwięk zatrzymuje się po zablokowaniu ekranu (tak działają aplikacje webowe na iOS).
- **Wersja z pliku (dwuklik):** pliki z folderu `dzwieki` grają wtedy **bez pogłosu** (przeglądarka nie pozwala ich przetwarzać). W wersji z internetu pogłos działa dla wszystkich dźwięków. Nagrywanie z mikrofonu w Safari też wymaga wersji z internetu.
- **Folder `dzwieki` na iPhonie:** widać tylko pliki, które były w folderze w chwili umieszczenia aplikacji w internecie. Nowe dźwięki dodawaj na telefonie przyciskiem **＋ Dodaj pliki** albo nagrywaj.

## 10. Pomysły na wersję 3

- dopracowany **guzheng** (kod wyjściowy w rozdziale 11),
- wyłącznik czasowy („wycisz za 20 minut”),
- zapisywanie ulubionych zestawów (np. „Poranek”, „Sen”),
- natywna aplikacja z App Store (wymaga Xcode i konta Apple Developer).

---

## 11. Archiwum: guzheng (usunięty z wersji 2, do dopracowania)

Synteza addytywna szarpniętej struny (18 alikwotów, nieharmoniczność, „trzask” paznokcia, vibrato, podciąganie), 21 strun w pentatonice D (D E F♯ A B), tryby: pojedyncza struna, akord, arpeggio. Kod wymaga obiektów `audio`, `master`, `reverbIn`, `pitch()`, `tempo()`, `isCurrent()` i `setStatus()` z pierwszego wydania wersji 2.

```js
/* ---------------------------------------------------------------------
   4. Ścieżka 3 — Guzheng (syntezowana chińska cytra)
   Strój pentatoniczny D: D E F# A B — każda kombinacja brzmi harmonijnie.
   --------------------------------------------------------------------- */
const PENTA = [0, 2, 4, 7, 9];
const STRINGS = [];
for (let m = 38; m <= 86; m++) if (PENTA.includes(((m - 62) % 12 + 12) % 12)) STRINGS.push(m);

// Akordy zbudowane wyłącznie z dźwięków skali (od najniższej struny)
const CHORDS = [
  [50, 57, 62, 66, 69, 74], // D
  [47, 54, 59, 62, 66, 71], // Bm
  [52, 59, 64, 69, 71, 76], // E–A–B (zawieszony)
  [45, 52, 57, 64, 69, 76], // A (puste kwinty)
];
const PROGRESSION = [0, 1, 2, 0, 1, 3];

const pluckCache = new Map();

// Szarpnięta struna: suma alikwotów, wyższe gasną szybciej, do tego krótki „trzask” palca
function pluckBuffer(midi) {
  if (pluckCache.has(midi)) return pluckCache.get(midi);
  const f0 = midiToHz(midi);
  const n = Math.floor(6 * SR);
  const buf = audio.createBuffer(1, n, SR);
  const d = buf.getChannelData(0);
  const B = 0.0002;  // lekka „nieharmoniczność” prawdziwej struny
  const pos = 0.17;  // miejsce szarpnięcia (blisko mostka = jaśniej)

  for (let k = 1; k <= 18; k++) {
    const fk = k * f0 * Math.sqrt(1 + B * k * k);
    if (fk > 16000) break;
    const amp = Math.abs(Math.sin(Math.PI * k * pos)) / Math.pow(k, 0.85);
    const decay = 0.45 + 0.28 * k * Math.sqrt(f0 / 220);
    const w = 2 * Math.PI * fk / SR;
    const mul = Math.exp(-decay / SR);
    let env = amp;
    for (let i = 0; i < n; i++) {
      d[i] += env * Math.sin(w * i);
      env *= mul;
      if (env < 1e-5) break;
    }
  }
  // „trzask” paznokcia na strunie
  let lp = 0;
  const noiseLen = Math.floor(0.04 * SR);
  for (let i = 0; i < noiseLen; i++) {
    lp += 0.25 * ((Math.random() * 2 - 1) - lp);
    d[i] += lp * 0.6 * Math.exp(-i / (0.004 * SR));
  }
  // łagodny początek i koniec + wyrównanie głośności
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]));
  const att = Math.floor(0.003 * SR), rel = Math.floor(0.3 * SR);
  for (let i = 0; i < n; i++) {
    let g = 0.9 / peak;
    if (i < att) g *= i / att;
    if (i > n - rel) g *= (n - i) / rel;
    d[i] *= g;
  }
  pluckCache.set(midi, buf);
  return buf;
}

// Zagraj jedną strunę. vibrato = drganie lewą ręką, bend = podciągnięcie struny (w półtonach)
function pluck(session, midi, when, { gain = 0.5, vibrato = 0, bend = 0 } = {}) {
  const buf = pluckBuffer(midi);
  const src = audio.createBufferSource();
  src.buffer = buf;
  const rate = pitch();
  src.playbackRate.setValueAtTime(rate, when);
  if (bend) {
    src.playbackRate.setValueAtTime(rate, when + 0.45);
    src.playbackRate.linearRampToValueAtTime(rate * 2 ** (bend / 12), when + 0.8);
  }

  const g = audio.createGain();
  g.gain.value = gain * (1 - Math.max(0, midi - 62) / 70); // wysokie struny trochę ciszej
  src.connect(g);
  let last = g;
  if (audio.createStereoPanner) {
    const p = audio.createStereoPanner();
    p.pan.value = ((STRINGS.indexOf(midi) / STRINGS.length) - 0.5) * 0.8; // niskie z lewej, wysokie z prawej
    g.connect(p);
    last = p;
  }
  last.connect(session.bus);

  if (vibrato) {
    const lfo = audio.createOscillator();
    lfo.frequency.value = 4.6 + Math.random() * 1.2;
    const depth = audio.createGain();
    depth.gain.setValueAtTime(0, when);
    depth.gain.linearRampToValueAtTime(rate * vibrato, when + 1.5);
    lfo.connect(depth).connect(src.playbackRate);
    lfo.start(when);
    lfo.stop(when + buf.duration);
    session.sources.add(lfo);
    lfo.onended = () => session.sources.delete(lfo);
  }
  src.start(when);
  session.sources.add(src);
  src.onended = () => session.sources.delete(src);
}

const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Każdy wzór gra jedno „zdarzenie” i zwraca czas do następnego (w sekundach)
const PATTERNS = [
  // 1. Pojedyncza struna — powolna, wędrująca melodia z drganiem i podciąganiem
  (s, t) => {
    const pool = STRINGS.filter(m => m >= 57 && m <= 79);
    let i = pool.indexOf(s.last);
    if (i < 0) i = Math.floor(pool.length / 2);
    i = Math.max(0, Math.min(pool.length - 1, i + pick([-2, -1, -1, 0, 1, 1, 2])));
    const m = pool[i];
    const doBend = Math.random() < 0.3 && i < pool.length - 1;
    pluck(s, m, t, { gain: 0.6, vibrato: 0.007, bend: doBend ? pool[i + 1] - m : 0 });
    if (Math.random() < 0.2) pluck(s, m - 12, t, { gain: 0.3, vibrato: 0.004 });
    s.last = doBend ? pool[i + 1] : m;
    return rand(2.6, 4.8);
  },
  // 2. Akord — miękkie przeciągnięcie palcem po strunach + jeden wysoki dźwięk później
  (s, t) => {
    const chord = CHORDS[PROGRESSION[s.step++ % PROGRESSION.length]];
    chord.forEach((m, k) => pluck(s, m, t + k * 0.06, {
      gain: 0.42 - k * 0.025,
      vibrato: k === chord.length - 1 ? 0.006 : 0,
    }));
    const high = pick(STRINGS.filter(m => m >= 74 && m <= 83));
    pluck(s, high, t + rand(2.6, 3.4), { gain: 0.38, vibrato: 0.007 });
    return 7;
  },
  // 3. Arpeggio — płynące rozłożone akordy, co 16 dźwięków zmiana akordu
  (s, t) => {
    const chord = CHORDS[PROGRESSION[Math.floor(s.step / 16) % PROGRESSION.length]];
    const shape = [0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1];
    const pos = s.step % 16;
    const k = shape[pos];
    pluck(s, chord[k], t, { gain: pos === 0 ? 0.5 : 0.32, vibrato: k === 5 ? 0.005 : 0 });
    if (pos === 0) {
      const bass = chord[0] - 12 >= 38 ? chord[0] - 12 : chord[0];
      pluck(s, bass, t, { gain: 0.45 });
    }
    s.step++;
    return 0.34;
  },
];

const guzhengTrack = {
  modes: ['Pojedyncza struna', 'Akord', 'Arpeggio'],
  session: null,
  tuned: false,
  count() { return this.modes.length; },
  label(i) { return this.modes[i]; },

  async start(i) {
    this.stop();
    if (!this.tuned) {
      setStatus('Stroję struny…');
      for (const m of STRINGS) { pluckBuffer(m); await sleep(0); }
      this.tuned = true;
      setStatus(null);
    }
    if (!isCurrent(this, i)) return;
    this.stop();

    const bus = audio.createGain();
    bus.connect(master);
    bus.connect(reverbIn);
    const s = { bus, mode: i, t: audio.currentTime + 0.15, step: 0, last: 0, sources: new Set() };
    s.timer = setInterval(() => this.schedule(s), 50);
    this.session = s;
    this.schedule(s);
  },

  // Planuje nuty trochę do przodu, żeby rytm był równy
  schedule(s) {
    while (s.t < audio.currentTime + 0.35) s.t += PATTERNS[s.mode](s, s.t) / tempo();
  },

  stop() {
    const s = this.session;
    if (!s) return;
    this.session = null;
    clearInterval(s.timer);
    const now = audio.currentTime;
    s.bus.gain.setValueAtTime(s.bus.gain.value, now);
    s.bus.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => {
      s.sources.forEach(x => { try { x.stop(); } catch (e) {} });
      s.bus.disconnect();
    }, 1700);
  },
  setPitch() {}, // nowe nuty same biorą aktualną wysokość
};

```

---

## 12. Kod źródłowy

### `index.html`

```html
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Mantra Box</title>

<!-- Dzięki tym liniom stronę można „zainstalować” jako aplikację na Macu i iPhonie -->
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="ikony/ikona.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="ikony/ikona-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Mantra Box">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#9c2f1f">

<style>
  :root {
    --bg: #e9e4da;
    --box: #c9442e;
    --box-dark: #9c2f1f;
    --grille: #d9563f;
    --ink: #2b211c;
    --screen: #1d1a17;
    --led: #ffb347;
    --key: #f3ece2;
    --key-shadow: #b9ad9c;
    --text-on-box: #fbeee6;
  }
  /* Każda zakładka ma swój kolor pudełka */
  .box[data-track="1"] { --box: #3b4f86; --box-dark: #26345c; --grille: #4a5f9a; --led: #a9c4ff; }
  .box[data-track="2"] { --box: #2f6f68; --box-dark: #1f4a45; --grille: #3b8178; --led: #9ff0d8; }

  * { box-sizing: border-box; }
  [hidden] { display: none !important; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    min-height: 100vh;
    min-height: 100dvh;
    display: grid;
    place-items: center;
    background: var(--bg);
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
    color: var(--ink);
    padding: max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  .box {
    width: min(340px, 100%);
    background: linear-gradient(160deg, var(--box), var(--box-dark));
    border-radius: 28px;
    padding: 24px 22px 20px;
    box-shadow: 0 24px 50px rgba(60, 30, 20, .35), inset 0 2px 0 rgba(255,255,255,.25);
    transition: background .4s;
  }

  .tracks { display: flex; gap: 6px; margin-bottom: 18px; }
  .tab {
    flex: 1;
    font-size: 12px;
    padding: 8px 2px;
    border-radius: 10px;
    background: rgba(0,0,0,.18);
    color: var(--text-on-box);
    box-shadow: none;
  }
  .tab.active { background: var(--key); color: var(--ink); font-weight: 600; }
  /* kropka = ta zakładka teraz gra */
  .tab::after {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    margin-left: 5px;
    border-radius: 50%;
    vertical-align: middle;
    background: currentColor;
    opacity: .2;
  }
  .tab.on::after { background: #ffc24a; opacity: 1; box-shadow: 0 0 6px #ffc24a; }

  .grille {
    aspect-ratio: 1;
    width: 72%;
    margin: 0 auto 18px;
    border-radius: 50%;
    background:
      radial-gradient(circle, rgba(0,0,0,.45) 2.2px, transparent 2.6px) 0 0 / 14px 14px,
      radial-gradient(circle at 35% 30%, var(--grille), var(--box-dark));
    box-shadow: inset 0 4px 12px rgba(0,0,0,.35);
  }
  .any .grille { animation: breathe 4s ease-in-out infinite; }
  @keyframes breathe { 50% { transform: scale(1.025); } }

  .screen {
    background: var(--screen);
    color: var(--led);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    gap: 10px;
    align-items: center;
    font-family: ui-monospace, Menlo, monospace;
    font-size: 15px;
    margin-bottom: 16px;
    box-shadow: inset 0 2px 6px rgba(0,0,0,.6);
  }
  #name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .led { width: 9px; height: 9px; border-radius: 50%; background: #4a3a2a; flex: none; }
  .playing .led { background: var(--led); box-shadow: 0 0 8px var(--led); }

  .buttons { display: flex; gap: 10px; margin-bottom: 14px; }
  button {
    flex: 1;
    border: 0;
    border-radius: 12px;
    padding: 12px 0;
    font-size: 18px;
    font-family: inherit;
    background: var(--key);
    color: var(--ink);
    cursor: pointer;
    box-shadow: 0 3px 0 var(--key-shadow);
  }
  button:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--key-shadow); }
  #play { flex: 1.6; font-weight: 600; font-size: 16px; }

  .mine-row { display: flex; gap: 8px; }
  .mine-row button { font-size: 13px; padding: 10px 0; }
  #rec.on { background: #ff5a4e; color: #fff; animation: blink 1s steps(2) infinite; }
  @keyframes blink { 50% { opacity: .75; } }
  .info { color: var(--text-on-box); opacity: .85; font-size: 12px; line-height: 1.4; margin: 10px 2px 4px; min-height: 1.4em; }

  label {
    display: grid;
    grid-template-columns: 78px 1fr;
    align-items: center;
    color: var(--text-on-box);
    font-size: 13px;
    margin-top: 10px;
  }
  .with-name { display: flex; align-items: center; gap: 8px; }
  .with-name input { flex: 1; min-width: 0; }
  #revName { width: 58px; text-align: right; font-size: 11px; opacity: .85; }
  input[type=range] { width: 100%; accent-color: var(--key); }

  #stopAll {
    display: block;
    width: 100%;
    margin-top: 16px;
    padding: 9px 0;
    font-size: 13px;
    background: rgba(0,0,0,.2);
    color: var(--text-on-box);
    box-shadow: none;
  }
  #stopAll:disabled { opacity: .4; cursor: default; }
  .hint { text-align: center; color: var(--text-on-box); opacity: .65; font-size: 11px; margin-top: 12px; }
  @media (hover: none) { .hint { display: none; } }
</style>
</head>
<body>
  <div class="box" id="box" data-track="0">
    <nav class="tracks">
      <button class="tab" data-track="0">Pętle 1</button>
      <button class="tab" data-track="1">Pętle 2</button>
      <button class="tab" data-track="2">Moje dźwięki</button>
    </nav>

    <div class="grille"></div>

    <div class="screen">
      <span id="name">—</span>
      <span id="num"></span>
      <span class="led"></span>
    </div>

    <div class="buttons">
      <button id="prev" title="Poprzedni">◀</button>
      <button id="play">▶ Graj</button>
      <button id="next" title="Następny">▶</button>
    </div>

    <!-- Tylko dla zakładki „Moje dźwięki” -->
    <div id="mine" hidden>
      <div class="mine-row">
        <button id="rec">● Nagraj</button>
        <button id="add">＋ Dodaj pliki</button>
        <button id="del">Usuń</button>
      </div>
      <input id="file" type="file" accept="audio/*,.wav,.mp3,.m4a,.aiff" multiple hidden>
      <p class="info" id="info"></p>
    </div>

    <label>Głośność <input id="vol" type="range" min="0" max="1" step="0.01" value="0.7"></label>
    <label>Wysokość <input id="pitch" type="range" min="0.5" max="1.5" step="0.01" value="1"></label>
    <label>Pogłos
      <span class="with-name">
        <input id="rev" type="range" min="0" max="1" step="0.01" value="0.45">
        <small id="revName">Sala</small>
      </span>
    </label>

    <button id="stopAll" disabled>■ Zatrzymaj wszystko</button>
    <div class="hint">Spacja: graj/stop · ← →: zmiana · 1 2 3: zakładka · Esc: wszystko stop</div>
  </div>

  <!-- Lista plików z folderu „dzwieki” (tworzy ją odswiez-dzwieki.command) -->
  <script src="dzwieki/lista.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### `app.js`

```js
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
```

### `sw.js`

```js
// Pozwala aplikacji działać bez internetu (po pierwszym otwarciu).
const CACHE = 'mantra-box-v2-2';
const FILES = [
  './', 'index.html', 'app.js', 'manifest.webmanifest', 'dzwieki/lista.js',
  'ikony/ikona.svg', 'ikony/ikona-180.png', 'ikony/ikona-192.png', 'ikony/ikona-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Najpierw internet (żeby mieć najnowszą wersję), a gdy go nie ma — kopia zapisana w telefonie
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
```

### `manifest.webmanifest`

```json
{
  "name": "Mantra Box",
  "short_name": "Mantra Box",
  "description": "Medytacyjne pętle i własne dźwięki, grające razem, z pogłosem od lasu po kosmos.",
  "lang": "pl",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#e9e4da",
  "theme_color": "#9c2f1f",
  "icons": [
    { "src": "ikony/ikona-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "ikony/ikona-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "ikony/ikona-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### `odswiez-dzwieki.command`

```bash
#!/bin/bash
# Mantra Box: odświeża listę dźwięków z folderu „dzwieki”.
# Kliknij ten plik dwa razy po wrzuceniu nowych plików WAV / MP3.
cd "$(dirname "$0")/dzwieki" || exit 1
shopt -s nullglob nocaseglob
{
  echo '// Ten plik tworzy się sam: wrzuć pliki WAV/MP3 do folderu „dzwieki”'
  echo '// i kliknij dwa razy „odswiez-dzwieki.command”.'
  echo 'window.MOJE_DZWIEKI = ['
  for f in *.wav *.mp3 *.m4a *.aif *.aiff *.ogg *.flac; do
    printf '  "%s",\n' "$(printf '%s' "$f" | sed 's/\\/\\\\/g; s/"/\\"/g')"
  done
  echo '];'
} > lista.js
echo
echo "Gotowe! Dźwięki w folderze „dzwieki”:"
grep '^  "' lista.js || echo "  (brak plików — wrzuć tu pliki WAV lub MP3)"
echo
echo "Odśwież stronę Mantra Box w przeglądarce (Cmd+R). To okno możesz zamknąć."
```

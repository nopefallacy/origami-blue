# origami-blue — style system

Everything here is already implemented in `assets/style_base.html` (CSS), `assets/fx_defs.html` (SVG filters
and patterns) and `assets/fx.js` (boil, float, ghost), injected by `scripts/assemble.py`. This file explains
*what each piece is for* so new beats stay inside the language.

## Contents
1. Canvas, layers, safe zones
2. Palette and colour rule
3. Typography
4. Components (the grammar)
5. Textures — the hand-made layer
6. Motion vocabulary
7. Camera and footage treatment
8. Captions
9. Series identity: tile, ₹1 crore line, CTA
10. Full-page cutaways (B-roll pages)
11. Sound

---

## 1. Canvas, layers, safe zones

- 1080×1920, 30 fps, vertical. Root `#root` is transparent in the composition; footage comes from the
  pipeline (graphics are rendered as separate transparent passes and composited).
- **Layers (z-index):** `.behind` 3 (diagrams that sit behind the speaker) → *subject cut-out* (pipeline) →
  `.front` 6 (titles, rows, text) → `.caps` 7 (subtitles) → `#grain` 9. Full-screen tile/cutaway pages use
  inline `z-index: 8`.
- **The zone above the head.** The speaker sits low (head top ≈ y 600–700 on screen). Every group living in
  the top area gets `transform: translateY(60px) scale(1.06); transform-origin: 540px 250px;` so layout y maps
  to screen `1.06·y + 45`. Lay out in y 250–600; most beats end by y ≈ 560.
- **Instagram safe zones:** keep text below y 240 (top UI), above y 1672 (bottom UI), and out of x > 918 below
  y 1156 (right action rail). Cards draw these as dashed blue guides.
- **Clearance:** each beat declares its graphics' screen-bottom in `<key>-clear.json`; `adapt.py` pushes/zooms
  the camera so the head top stays below it (zoom cap 1.25). Write C = screen bottom of the lowest graphic + ~20.

## 2. Palette and colour rule

| token | value | use |
|---|---|---|
| ink | `#121113` | text on yellow, page background |
| white | `#F5F3EE` | kicker lines, line art, white serif notes |
| yellow | `#FED100` | **the hero** — one per beat: the payoff word, the resolved state, CTA keys |
| blue (pill) | `#2478AF` | structural pills, tile bar |
| blue (light) | `#5AA9E6` | lines/labels/arrows on dark, small-caps section labels, "?" marks |

Rule: **at most one** yellow element per beat, and it marks the thing the viewer must remember from that beat.
- In a **headline beat** that names the pain (hook "UNDERCHARGING.", "1:1 CALLS."), the pain noun is the yellow —
  it's the hook's point.
- In a **diagram beat that shows the broken state** (empty slots, noisy amplifier, wobbling stack), keep the
  problem white/grey/blue; a beat with no yellow is fine. Save yellow for the moment it resolves.
- In **turn / payoff / instruction beats**, yellow is the resolution (OFFER PROBLEM., the foundation, "work here.",
  slots filling yellow, CLEAR OFFER.).
Supporting elements are blue or white. Callbacks often turn a blue/white structure yellow at the moment of
resolution — that colour change *is* the payoff.

## 3. Typography

- **Inter Tight** (local woff2, 100–900): all sans. Uppercase headlines at 800–900 with tight tracking
  (−0.035 to −0.06em). Small caps labels: 21px, 700, +0.14em tracking, uppercase.
- **Instrument Serif italic**: the human voice — notes, payoffs, "what you're worth", "reflect back.". Used
  white for notes, yellow for the hero serif line.
- Never introduce other fonts. Never use condensed display faces, outlines-only text (except ghost words), or
  text with drop-shadow boxes.

## 4. Components (the grammar)

- **Kicker + headline** (`.w-line` + `.y-big`): white justified uppercase line (56px) over a big yellow
  uppercase headline (110–160px). Kicker words enter word-by-word on their spoken words; headline blur-scales
  in. Use for hook, the turn, payoffs. Headline width ≤ ~950px (it gets ×1.06).
- **Serif headline** (`.serif` 80–120px yellow): softer payoff ("the life after.", "your approach.").
- **Label column** (`.small-caps` labels right-aligned in x 40–264 + `.vrule` at x≈286 + rows from x≈312):
  the structured way to show lists, dialogue, comparisons, before/after. Rows are `.outline` (white 2px border,
  translucent dark fill) or `.pill.y` / `.pill.b`. Proven uses: THE LEAD/YOU dialogue, IF/THEN, NOT A/IT'S AN,
  THEY ASK/THEY QUALIFY, BUILD ORDER stack, VIEWING/THEY GET IT tallies.
- **Pills:** `.pill.y` (hero), `.pill.b` (structure). Radius 12, no glow.
- **Line-art diagrams** (SVG, white 3–5px strokes, blue accents, `filter="url(#boil)"` on a `<g>`): scales,
  sliders, gauges, wheels, bridges, dominoes, amplifiers, eyes. Labels in small caps; one serif note.
- **Ghost word** (`.ghost`): a huge (180–300px) outlined halftone word in the *behind* layer at y ≈ 520–600 so
  the hair overlaps it — the cheapest way to show the chroma depth. 1 per hero beat, max ~3 per episode.
  `ghost(sel, t0, t1)` animates it (scale-settle, slow drift).
- **Key-caps** (`.key`): yellow keys with a hard 10px bottom edge spelling the comment keyword. CTA only.
- **Checks, arrows, brackets**: hand-drawn feel — rounded joins, brush filter on brackets/underlines.

Avoid: boxes behind captions, icons from icon sets, stamp circles, stickers, tilted paper cards, browser/phone
mock-ups, emoji, progress bars that look like UI, arrows with heavy heads, drop shadows on text blocks.

## 5. Textures — the hand-made layer

All subtle; they should be felt, not noticed.

- **Line boil** — `filter="url(#boil)"`: turbulence displacement re-seeded at 8 fps (fx.js), the classic
  drawn-animation shimmer. Apply to a `<g>` of line art. **Never on a single perfectly horizontal/vertical
  `<line>`** — its bounding box has zero height and it disappears; leave straight rules unfiltered.
- **Dry brush** — `filter="url(#brush)"` with stroke-width 9–16: underlines (hook swoosh), strike-throughs,
  brackets, roads, the "fast" curve. Animate with `draw()`.
- **Halftone fills** — `fill="url(#dots-y|#dots-b|#dots-w)"` (+ a faint solid tint underneath): wheel wedges,
  iceberg mass, area under a curve, domino faces, floor shadow.
- **Ink grain on headlines** — `.y-big` / `.ink` mask (`media/ink.png`): very faint letterpress mottling.
  Heavy distress looked grungy and was rejected — keep it faint.
- **Paper pages** — cutaway pages: `#121113` + 26px dot grid + `.page-tex` (paper fibre, screen blend) +
  `.page-vig` vignette; leading-edge shadow when sliding.
- **Film grain** — `#grain` layer always on (0.55).

## 6. Motion vocabulary

Helpers live in each episode's `script.js` (see the template) and `fx.js`:

| helper | what | default |
|---|---|---|
| `blurIn(sel, t, {y,s,d,st,e})` | opacity 0→1, blur 16→0, rise 18px | 0.42s power3.out |
| `blurOut(sel, t)` | fade + blur + lift | 0.32s power2.in |
| `wordsAt(sel, times[])` | kicker words on their spoken words | 0.32s |
| `draw(sel, t, d)` | stroke draw-on (dashoffset) | power2.inOut |
| `pop(sel, t, {from})` | scale-pop with back.out(2.2); **sets opacity 0 first** | 0.34s |
| `float(sel, t0, t1, amp)` | slow 2.8s parallax bob for behind diagrams | 6–7px |
| `ghost(sel, t0, t1)` | ghost word settle + drift + fade | |
| proxy + `onUpdate` | physics-like states (scale tilt, slider knob, gauge needle, domino tips via `svgOrigin`) | |

Rules:
- Enter on the word (transcript word start, −0.02s for captions). Hold while true. Exit 0.3s before the next
  beat. Don't leave a beat's graphics when the topic changed.
- Entrances 0.3–0.5s; nothing slower than ~0.8s unless it's a deliberate rack focus or a slow drift.
- Every element that pops later must be hidden until its time (the `pop` helper does this; anything using
  `immediateRender:false` must have a `gsap.set(…, {opacity:0})`). Elements visible before their word is the
  most common bug — check card frames 0.5s before each entrance.
- Callbacks reuse the same element (same position) and resolve it: tilt back, fill, tick, focus.
- Deterministic only (no Math.random — use a seeded LCG as in the amplifier waves).

## 7. Camera and footage treatment

- Footage is iPhone HEVC 10-bit HLG; converted to SDR first. Mirrored (`hflip`) everywhere.
- **Grade** (one for subject and room): brightness 0.9, contrast 1.08, saturation 0.9, sepia 0.05; vignette and a
  top shade (darkens the shelf area so graphics read). Graduated depth-of-field: the band above the head top is
  blurred (11px, 200px feather) — reads as a shallow-focus lens, keeps the speaker razor sharp.
- **Camera** (`camera.cjs`): face-centred zoom `full(z, 540, 1000)`, s ≥ 1 always. Grammar:
  - claims / hero words: punch `0.3s power4.out` to +0.08–0.12, settle with `sine.out`, release `0.6s power3.inOut`;
  - diagram beats: go wide (1.00–1.02) and drift slowly (`sine.inOut` 8–14s) so the graphic has room;
  - literal moves when the line invites it: "take a step back" → pull out; "stop" → hard punch to 1.18–1.20;
  - under full-screen tiles/cutaways: hard-set (duration 0) to reset.
  `adapt.py` then adds clearance so the head never covers the beat's graphics (cap 1.25).

## 8. Captions

- Word-by-word, 58px Inter Tight 700, white, lowercase-as-spoken, keyword list turns yellow
  (`assemble.py` `KEYWORDS`). Chunks ≤ 3 words, break on punctuation / 0.3s gaps / 1.25s span.
- No boxes: a soft dark elliptical burn (`#cap-burn`) fades in behind active captions only.
- Ride under the chin (pipeline shifts them by the camera's `capdy`), base y 1440, never below 1672.
- Hidden while the series tile is up (`TILE` window) and while a cutaway's own bottom headline is on screen
  (`tl.set("#captions", {opacity:0}, t)` … back to 1).
- Fix mishearings in an edited transcript copy (e.g., "call to your offer" → "comment your offer").

## 9. Series identity (Coach Meet Business Series)

Identical every episode — the series is recognised by repetition:
1. **Hook** (0–~6s): kicker + yellow headline stating the episode's turn, dry-brush underline on the key word,
   ghost word behind the head.
2. **Tile** on "Welcome to Coach Meet Business Series": full-screen paper `#ECEBE6` with dot grid, huge
   `ep. 0N` top-right (number rises), "coach meet" (blue) / **business** / **series** (white on blue bar),
   footer "Building a ₹1 crore business, step by step"; wipes up on "where I break down".
3. **₹1 crore line**: WHAT IT TAKES TO BUILD A / ₹1 CRORE (yellow, punch) / *coaching business.*
4. **CTA**: the *format* is fixed (white kicker + yellow key-caps + one serif promise), the words follow what's
   said: "COMMENT THE WORD [VALUE]" + "& I'll send you the workbook." when there's a keyword lead magnet;
   "COMMENT YOUR [OFFER]" + "& I'll help you improve it, for free." when viewers comment their own thing.

A different series or a one-off reel: keep the grammar, swap the tile content (series name + number style +
footer tagline). One-off reels skip the tile and go hook → first beat; the hook must then carry the whole
identity. See `metaphor-framework.md` §3.

## 10. Full-page cutaways (B-roll pages)

One per episode, 4–7s, at the conceptual peak or the worked example: iceberg (physical vs psychological),
income curves, eye chart, three roads. Page slides up (`yPercent 100→0`, 0.5s power4.inOut), elements draw in
on words, page slides away up. Content sits in y 330–1300; nothing in the caption band (y 1380–1520) unless
captions are held. Halftone + paper texture + one yellow serif payoff.

## 11. Sound

`mix.py`: voice + SFX cues `[t, kind, vol]`, loudnorm −14 LUFS. Kinds (template `sfx/`): whoosh (titles,
pages, sweeps) 0.2–0.4, pop (pills, keys, icons) 0.25–0.42, impact (punch-ins, hero hits) 0.08–0.16, thud
(weights landing, foundations, falls) 0.3–0.42, tick (labels, checks, small reveals) 0.2–0.35. Every visible
event of weight gets a sound; quiet beats stay quiet. Keys in the CTA: 3 pops 0.14s apart.

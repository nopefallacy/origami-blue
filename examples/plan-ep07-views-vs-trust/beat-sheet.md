# ep. 07 — "Views are not trust" · beat sheet (Phase 1–2 plan, pre-cards)

**Source:** `inputs/transcript.json` (232 words, 0.20–109.79 s). **DUR assumed 110.5 s.** Replace it with the `ffprobe`
duration of `a-sdr.mp4`. Only the last `clear.json`/`wins.json` entries depend on it. N ≈ 3315 frames.

**Transcript fixes (edited copy):** "one-core" (14.38) → "₹1 crore". "SPINE" (104.77) → lowercase "spine" in captions.
No other mishearings found.

**episode.env suggestions:** `EP=07`, `TILE="7.45 10.45"` (tile cuts in just before "Welcome", wipe starts on "where"),
`KEYWORDS="trust|spine|proof"`, `TRANSCRIPT=a.transcript.edited.json`. Caption cut at the tile start:
`if (start < 7.45 && end > 7.45) end = 7.45`.

---

## The turn (one sentence)

**Posting more isn't the fix. Views aren't trust, and trust only turns into booked calls when every post proves the same
one transformation: a content spine.**

The arc in one line: hook names the pain (NO CALLS.) → the false belief (consistency) → the turn (VIEWS ARE NOT TRUST.) →
why: the views pile up but there's no way up (ledge), because nothing connects (loose ribs), so the audience files you
as entertaining, not the expert (target page) → the fix: a content spine (backbone + one yellow head), every post a proof
point, trust compounds (ribs double) → payoff: the call is the next step (ledge callback; THE CALL turns yellow) → test
tomorrow's post against the spine → DON'T POST IT. → SPINE.

---

## Beat table

Layout y values are pre-zone-transform (screen = 1.06·y + 45). "—" rows are deliberate speaker-only breaths.

| # | window (s) | spoken line | visual | layer | yellow hero | motion keyed to words (s) | camera | SFX |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00–7.45 | "You post every single day, your reels get views, but nobody books a call with you." | **Hook.** White justified kicker YOUR REELS GET VIEWS. BUT / yellow headline **NO CALLS.** (150px, faint ink grain) / blue dry-brush underline under CALLS. Ghost word **VIEWS** behind the head: huge, outlined, hollow. | front (title) + behind (ghost) | NO CALLS. | Kicker blurs in on frame 1 (0.05, 0.07 stagger). Headline blur-scales in at 0.45. Underline paints on "nobody" 4.75. Ghost settles from 0.3 and drifts. All exit up with blur at 7.10, after "you." 6.84. | Open 1.10 → drift 1.06 (sine.inOut). **Punch** on "nobody" 4.75 → 1.14 (0.3 power4.out), settle 1.17. | whoosh 0.05 · impact 0.45 · tick 4.75 · impact 4.77 |
| 2 | 7.45–10.95 | "Welcome to Coach Meet Business Series where I break down…" | **Series tile**, unchanged: paper #ECEBE6, dot grid, `ep. 07` top-right, coach meet / business / series (blue bar), footer "Building a ₹1 crore business, step by step". | full-screen (z 8) | — (series identity) | Hard cut in at 7.45. 07 rises on "Welcome" 7.57. "coach meet" on "Coach" 8.46, footer on "Meet" 8.92, "business" on "Business" 9.34, bar + "series" on "Series" 9.94. Wipes up on "where" 10.45 (0.5s power4.inOut). Captions hidden 7.45–10.45. | Hard-set 1.04 under the tile (dur 0). 1.03 when it lifts. | whoosh 7.45 · pop 9.34 · tick 9.94 · whoosh 10.45 |
| 3 | 11.9–16.4 | "…what it takes to build a ₹1 crore coaching business." | WHAT IT TAKES TO BUILD A / **₹1 CRORE** / *coaching business.* (series line, unchanged) | front | ₹1 CRORE | Kicker words on what 12.08 · it 12.50 · takes 12.83 · to 13.30 · build 13.63 · a 14.09. ₹1 CRORE blur-scales in on "one-core" 14.38. Serif on "coaching" 14.93. Out at 16.05. | Punch 14.38 → 1.10 (0.35 power4.out), settle 1.12, release 16.1 → 1.03 (0.7 power3.inOut) | impact 14.38 |
| — | 16.4–19.8 | "So most coaches think that the problem is…" | speaker only | — | — | — | Slow push 1.03 → 1.07 (sine.inOut) leaning into "consistency" | — |
| 4 | 19.8–26.32 | "…the problem is consistency. They think if I just post more, someone will eventually buy." | **The false belief, label column.** Blue small caps THEY THINK, vrule at x 286. Row 1 outline: "the problem is consistency." Row 2 outline: "if I just post more…", with two faint echo outlines stacked under it. White serif: *…someone will eventually buy* plus a blue **?** | front | **none.** The belief is wrong, so yellow is held back for TRUST. 2s later. | Rule draws 19.80. THEY THINK + row 1 land on "consistency" 19.93. Row 2 on "post" 22.94. On "more" 23.36 two echo outlines cascade beneath it (0.08 stagger, 35% / 18%): more posts, same row. Serif on "someone" 23.93. Blue ? pops on "buy" 25.60. Out at 26.00, before "But". | Release to 1.02 (0.6 power3.inOut), drift 1.02–1.04 | tick 19.8 · pop 19.93 · whoosh 22.94 · tick 23.36 · whoosh 23.93 · pop 25.60 |
| 5 | 26.32–29.47 | "But views are not trust." | **The turn.** Kicker BUT VIEWS ARE NOT / big yellow **TRUST.** (160px). Ghost word **TRUST** behind the head. | front + behind (ghost) | TRUST. | Kicker words on But 26.32 · views 26.70 · are 27.16 · not 27.54. TRUST. blur-scales in on "trust" 27.91, and the ghost settles on the same word. Out at 29.15. | **Hard punch** 27.91 → 1.16 (0.3 power4.out), settle 1.18. Release 29.3 → 1.00 (0.6 power3.inOut) | tick 26.32 · impact 27.91 · whoosh 27.93 |
| 6 | 29.45–36.4 | "People can watch you for six months and still not believe that you can solve their problem." | **NEW, the ledge (state 1: no way up).** White ground line at y 560. On the left, a blue halftone mound labelled 6 MONTHS OF VIEWS. On the right, a sheer white wall up to a ledge (x 760–970, y 300) labelled THE CALL, still dashed. Between them, a dashed blue dimension line with end ticks labelled **TRUST**, empty: the height nobody can climb. | behind | **none.** THE CALL stays white and dashed while it's out of reach. | Ground draws and the mound rises on "watch" 29.61 (label VIEWS). Mound swells on "six" 30.83; label becomes 6 MONTHS OF VIEWS on "months" 31.20. Wall + ledge draw up on "still" 32.09, THE CALL label on "not" 32.55. Empty TRUST dimension draws on "believe" 32.93. Slow float, holds while true. Out at 36.10. | Wide 1.00 → slow drift 1.03 over 6s (time passing) | whoosh 29.61 · tick 30.83 · whoosh 32.09 · tick 32.93 |
| — | 36.4–42.3 | "Why? Because every post is teaching something random." | speaker only (captions carry it) | — | — | — | **Punch** on "Why?" 36.49 → 1.12 (0.3 power4.out), release 37.6 → 1.05. Push on "random" 40.23 → 1.08 (0.35 power2.out). Wide 1.00 at 42.0 | impact 36.49 |
| 7 | 42.3–51.7 | "One day it is mindset, the next day it is a morning routine, the next day it is a motivational quote. Nothing connects." | **NEW, loose ribs (state 0 of the spine).** Three short white line-art arrows with light heads, labelled MINDSET, MORNING ROUTINE, MOTIVATIONAL QUOTE. They lie at unrelated angles and heights, each pointing a different way, with no backbone. White serif: *nothing connects.* | behind | **none** (nothing here is the point yet) | Each rib drops and settles at its own angle on its word (0.4s power3.out, small overshoot): "mindset" 42.50 (−35°), "morning" 45.32 (+20°), "motivational" 48.69 (+68°). On "Nothing" 50.29 a dashed blue connector starts from MINDSET toward MORNING ROUTINE and gives out halfway, fading. Serif on "connects" 50.84. Ribs drift ~6px apart. Out at 51.40. | Wide 1.00, drift 1.02. Tiny push 1.04 on "connects" 50.84 | thud 42.50 · thud 45.32 · thud 48.69 · whoosh 50.29 · tick 50.84 |
| — | 51.7–54.0 | "So in the mind of your audience," | speaker only | — | — | — | Push 1.07 on "mind" 52.83 (sine.out) | — |
| 8 | 54.0–60.8 | "…you are entertaining, but you are not the expert for one specific problem." | **THE CUTAWAY, NEW: the target "in their mind".** Dark paper page (#121113 + dot grid + paper fibre + vignette). Blue small caps IN THEIR MIND (y 330). A large dry-brush target centred (540, 790), rings r 330 / 220 / 130, faint halftone in the outer band. A blue **YOU** dot sits on the outer band, labelled ENTERTAINING. The bullseye is empty: a dashed ring with THE EXPERT / FOR ONE PROBLEM inside on two lines. White serif at y ≈ 1180: *entertaining, not the expert.* | full-screen page (z 8) | the **empty bullseye**: its ring turns yellow, the vacant spot worth owning | Page slides up on "audience" 54.00 (0.5s power4.inOut). Rings draw from 54.15. YOU dot drops onto the outer band with a soft bounce on "you" 54.75. ENTERTAINING on "entertaining" 55.50. Serif on "not" 57.55. THE EXPERT appears in the empty centre on "expert" 58.30. On "specific" 59.56 the bullseye ring turns yellow and FOR ONE PROBLEM lands, while the dot stays far out. Page slides away up at 60.30. | Hard-set 1.04 under the page (dur 0) | whoosh 54.00 · whoosh 54.15 · pop 54.75 · tick 55.50 · tick 57.55 · tick 58.30 · pop 59.56 · whoosh 60.30 |
| — | 60.8–62.85 | "What you need is a…" | speaker only | — | — | — | **Punch** on "need" 61.86 → 1.10. Release on "content" 62.9 → 1.00 (0.6 power3.inOut) | impact 61.86 |
| 9 | 62.85–71.9 | "…content spine. Pick the one transformation you deliver, and make every post a proof point of that transformation." | **CALLBACK of #7, then NEW: the content spine.** The loose ribs return where they were. A long blue dry-brush backbone (y 430, x 110 → 760) paints straight through them, with blue small caps A CONTENT SPINE over its left end. The old ribs fall away. A yellow head (rounded chevron x 770–1000) reading THE ONE / TRANSFORMATION in ink. Three white ribs click onto the spine, every arrowhead angled at the head. | behind | the head: THE ONE TRANSFORMATION | Old ribs fade back in on "content" 62.90. Spine paints left→right on "spine" 63.45 (0.55s brush) + label. On "Pick" 64.27 the old ribs drop off under gravity and fade (0.06 stagger). Head pops on "transformation" 65.44. Three ribs slide in on "every" 68.18 and click to 50° on "proof" 69.35 (0.12 stagger), arrowheads drawing at the joint. Head pulses on "transformation." 71.03. | Wide 1.00. Small push 1.04 on "transformation" 65.44 (0.35 power2.out), back to 1.01 drift | whoosh 62.90 · whoosh 63.45 · thud 64.27 · pop 65.44 · impact 65.46 · whoosh 68.18 · pop 69.35 / 69.47 / 69.59 · tick 71.03 |
| 10 | 71.9–79.4 | "A client result, a mistake you see again and again, a framework you use on calls." | **Same spine, the example.** The three ribs get names in white small caps at their tails: CLIENT RESULT (upper) · A MISTAKE YOU SEE (lower) · YOUR CALL FRAMEWORK (upper right). | behind | the head (unchanged, still the only yellow) | CLIENT RESULT on "client" 72.54. A MISTAKE YOU SEE on "mistake" 73.99; on "again" 75.30 and "again" 76.14 that rib gives two small nudges toward the head. YOUR CALL FRAMEWORK on "framework" 77.04. | Drift 1.01 → 1.03 (sine.inOut) | tick 72.54 · tick 73.99 · tick 77.04 |
| 11 | 79.4–84.6 | "When every post points to the same outcome, trust compounds." | **Same spine, compounding:** 3 → 6 → 12 ribs, all pointing at the head. The spine's halftone sheath thickens toward the head and the head swells. The left label swaps to white serif *trust compounds.* | behind | the head (grows ×1.12) | Labels dim to 40% and 3 more ribs click on at "every" 80.00 (0.08 stagger). A light pulse runs down every rib and along the spine into the head on "points" 80.88, arriving on "outcome" 82.52 (head pulse). On "compounds" 83.69 six more ribs cascade on (0.04 stagger), the head swells and the serif lands. Out at 84.40. | Push 1.06 on "compounds" 83.69 (0.35 power2.out) | pop 80.00 / 80.08 / 80.16 · whoosh 80.88 · tick 82.52 · pop 83.69 · impact 83.71 |
| 12 | 84.6–91.75 | "And when trust compounds, the call becomes the obvious next step, not a cold ask." | **CALLBACK of #6, resolved.** Same mound of views, same wall. Now three halftone-blue steps (white outlines) climb the wall's face, the TRUST dimension turns solid, and **THE CALL** ledge has turned yellow, exactly one step above the top step. White serif: *the obvious next step.* Small caps: NOT A COLD ASK. | behind | THE CALL (the ledge fills yellow) | Diagram fades back in as left on "And" 84.68. Steps slide up and land one on another on "compounds" 85.94 (0.18 stagger) while the TRUST line goes solid. THE CALL fills yellow on "call" 87.11. Serif on "obvious" 88.46. A small light blue arrow draws from the top step onto the ledge on "step" 89.44. NOT A COLD ASK on "cold" 90.67. Out at 91.45. | Wide 1.00. Push 1.06 on "step" 89.44 (0.35 power2.out), release 91.45 | whoosh 84.68 · thud 85.94 / 86.12 / 86.30 · pop 87.11 · tick 88.46 · tick 89.44 · impact 89.46 · tick 90.67 |
| — | 91.75–94.55 | "So before you post again tomorrow," | speaker only | — | — | — | Push 1.08 (sine.inOut 2.5s) | — |
| 13 | 94.55–101.7 | "…ask yourself, does this post prove that I can solve that one problem? If not," | **CALLBACK of the finished spine, now a test.** 12 ribs and the yellow head, with blue small caps BEFORE YOU POST, ASK. A new dashed white rib, TOMORROW'S POST, hovers above the spine at a loose angle with a blue **?**. | behind | the head | Spine returns as left on "ask" 94.66 + kicker. TOMORROW'S POST drops in and hovers on "does" 95.79. ? pops on "prove" 97.05. The rib swings toward the spine's angle on "solve" 98.59, and the head pulses on "one" 99.48 (the test). On "not" 101.09 it greys out and falls away below the spine. Spine out at 101.40. | Wide 1.00, drift 1.03 | whoosh 94.66 · whoosh 95.79 · pop 97.05 · whoosh 98.59 · tick 99.48 · thud 101.09 |
| 14 | 101.6–103.52 | "…do not post it." | **DON'T POST IT.** (yellow, 110px, centred, alone) | front | DON'T POST IT. | DON'T on "do" 101.61, POST on "post" 102.32, IT. on "it" 102.74 (blur-scale 0.3s). Out at 103.20. | **Hard punch** to 1.18 on "do" 101.61 (literal imperative). Hard reset 1.04 at 103.35 | impact 101.61 · whoosh 101.62 · tick 102.32 · tick 102.74 |
| 15 | 103.35–110.5 | "Comment the word spine and I will send you my content spine template for free." | **CTA.** COMMENT THE WORD / yellow key-caps **S P I N E** / serif *& I'll send you my template, for free.* Ghost word **SPINE** behind the head. | front + behind (ghost) | the key-caps | Kicker words on Comment 103.42 · the 103.97 · word 104.35. Keys drop in one by one from "SPINE" 104.77 (0.07 apart, back.out). Serif on "send" 106.31. Ghost settles on 104.77 and drifts to the end. | Push 1.07 on "SPINE" 104.77 (0.4 power2.out), drift 1.05 | whoosh 103.42 · pop 104.77 / 104.91 / 105.05 · tick 106.31 |

Card numbers in `cards.json` follow the beat numbers above (15 cards).

---

## Callbacks, cutaway, ghosts

- **Callback A, the ledge:** #6 (no way up; TRUST empty) → **#12** (steps fill the TRUST height; THE CALL turns yellow). This
  is also the hook's payoff: "NO CALLS." at 0s resolves into THE CALL in yellow at 87.11.
- **Callback B, the spine:** #7 (loose ribs) → **#9** (the same ribs come back and fall away as the backbone paints through)
  → #10–#11 (built and compounding) → **#13** (the finished spine used as a test; the rejected rib falls). Same element,
  same position every time.
- **The one full-page cutaway:** #8 "In their mind" target, 54.0–60.8 (≈ 6.8s incl. slide-out), on the deepest
  consequence (how the audience files you).
- **Three ghost words:** **VIEWS** (hook: hollow, the thing they have plenty of) · **TRUST** (the turn's noun) ·
  **SPINE** (CTA / payoff noun). Each sits on a beat with no behind-diagram, so it adds depth without clutter.

---

## New metaphors: the fold method (why each fits the mechanism)

None of these appear in the "families already used" table. Two caveats are noted honestly in `self-check.md`.

**1. The ledge: views pile up, trust is a height (#6 → #12)**
1 Shape: *measure a height that can't be climbed*, then *build a way up*. 2 Object: a wall with a ledge, later a
staircase; "next step" and "cold ask" are the speaker's own words. 3 States: mound on "watch" → swells on "six
months" → wall on "still" → empty TRUST on "believe" ‖ steps on "compounds" → yellow on "call" → arrow on "step".
4 Yellow: none while it's a wall; THE CALL turns yellow only once it's reachable. 5 Behind. 6 Returns as the payoff.
*Why it fits:* views grow sideways (a bigger heap of the same thing) but trust is vertical and has to be built.
Six months of views never reaches the ledge. Stacked proof turns the call into one ordinary step instead of a leap.

**2. Loose ribs → the content spine (#7 → #9–#10)**
1 Shape: *connect / align*, many pieces becoming one structure aimed at one outcome. 2 Object: a spine (the speaker's word
and the CTA keyword), drawn fish-bone style: one backbone, ribs angled toward one head. 3 States: ribs drop on
"mindset / morning / motivational", connector fails on "nothing" ‖ backbone on "spine", old ribs fall on "pick", head
on "transformation", ribs click on "proof", names on "client / mistake / framework". 4 Yellow: the head only.
5 Behind. 6 Comes back three times. *Why it fits:* "nothing connects" becomes literal. Ribs without a backbone are
sticks pointing anywhere, and the backbone is what makes separate posts one body. The arrow angles show "every post
points to the same outcome" without a word.

**3. Compounding by doubling (#11)**
1 Shape: *grow / compound*. 2 Object: the same spine, ribs 3 → 6 → 12, sheath thickening into the head. 3 States: +3 on
"every post", pulse on "points to", arrival on "outcome", +6 on "compounds". 4 Yellow: the head, which is the only
thing that grows. 5 Behind. 6 It is itself a callback state. *Why it fits:* compounding means each addition multiplies,
so the count doubles rather than ticking up. Everything flows into one head, which is why trust accumulates there
instead of spreading out.

**4. The target "in their mind" (#8, cutaway)**
1 Shape: *position / categorize*, where you sit in their head. 2 Object: a target. The centre is the person they'd call
for their problem; the outer band is "fun to watch". 3 States: rings on "audience" → YOU on outer band on "you" →
ENTERTAINING → empty centre THE EXPERT on "expert" → yellow on "specific". 4 Yellow: the empty bullseye. 5 Front,
full page. 6 No page callback; the spine's yellow head later plays the same role. *Why it fits:* "entertaining vs
expert" is about distance from their problem, not quality. A target shows you're visible but off-centre, and the
yellow marks the vacancy you could own.

**5. The spine as a test (#13)**
1 Shape: *filter / qualify*, accept or reject. 2 Object: a loose rib held against the finished spine: does it point at
the head? 3 States: hovers on "does", ? on "prove", swings to aim on "solve", head pulse on "one", falls on "not".
4 Yellow: the head. 5 Behind. 6 It *is* the final callback. *Why it fits:* the spine becomes the filter. A post either
fits the backbone or it doesn't, and the rejection is physical (it falls). That sets up "DON'T POST IT." with no box
and no question rows (avoiding ep06's self-qualify family).

**Not a metaphor, by choice: #4 "THEY THINK" rows.** The false belief is quoted thinking, so the label column is honest
structure, as in ep03's THE LEAD / YOU dialogue. The rows still perform: the "post more" row echoes into a stack of
copies on "more" (volume, same content). I kept a metaphor out of the wrong belief so the turn lands on a clean frame.

---

## Rhythm and coverage

Grammar sequence: headline → tile → headline → *breath* → **rows** → headline → **diagram** (ledge) → *breath* →
**diagram** (loose ribs) → *breath* → **page** → *breath* → **diagram** (spine, 3 states) → **callback** (ledge) →
*breath* → **callback** (spine test) → headline → CTA.
- Never two row beats in a row (there is only one).
- Breaths with speaker and captions only: 16.4–19.8 (3.4s), 36.4–42.3 (5.9s), 51.7–54.0 (2.3s), 60.8–62.85
  (2.05s), 91.75–94.55 (2.8s).
- Graphics on screen ≈ **84%** of 110.5s. The skill says 60–70%, but the reference episodes run ≈ 82–83% (see self-check).
- Camera follows meaning: wide on diagrams, punches on "nobody", "trust", "Why?", "need", and a hard 1.18 punch on the
  imperative "do not post it". Hard resets under the tile and the page.

## Layout bottoms → `clear.json` (C = 1.06·y_bottom + 45 + ~15–20)

| beat | lowest graphic (layout y) | screen | C |
|---|---|---|---|
| 1 hook | underline ≈ 500 | 575 | 590 |
| 3 ₹1 crore | series standard | — | 639 |
| 4 rows | serif bottom ≈ 534 | 611 | 625 |
| 5 turn | TRUST. bottom ≈ 512 | 588 | 605 |
| 6 / 12 ledge | ground line 560 (+ faint floor halftone, may tuck behind hair) | 639 | 655 |
| 7 loose ribs | rib / label ≈ 545 | 623 | 640 |
| 9–11, 13 spine | lower rib tails + labels ≈ 560 | 639 | 655 |
| 14 DON'T POST IT. | headline bottom ≈ 460 | 533 | 555 |
| 15 CTA | serif bottom ≈ 538 | 615 | 640 |

The tile and the page are full-screen, so they have no clearance entry (same as the examples).

## Open questions for the creator (to send with the cards)

1. Episode number **07**: confirm it follows ep.06.
2. CTA: I used the keyword format **COMMENT THE WORD / S P I N E** (as in ep.03/04), since the keyword isn't "your offer".
   Does the content spine template exist? The card promises it on screen.
3. Hook headline: **NO CALLS.** names the pain, and VIEWS ARE NOT TRUST. is saved for 27.91. Or would you rather open on
   the contrarian line?
4. The spine is drawn fish-bone style (backbone + ribs + head) rather than as an anatomical vertebral column, to stay
   line-art and non-medical. OK?
5. Transcript fix: "one-core" → ₹1 crore.

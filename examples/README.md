# origami-blue — reference episodes

Four finished episodes of the Coach Meet Business Series (vertical, 1080×1920, ~1.5–2.3 min). They are the
quality bar. Before designing a new episode, open `graphics-sheet.jpg` (and, where present, `cards-overview.jpg` and
`final-frames.jpg`) of at least two of them and read the `body.html` / `script.js` of the one closest to the new
topic.

Each folder:
- `graphics-sheet.jpg` — the graphics layer alone at every card beat, on grey (made with `scripts/quick.sh`).
  It's in every copy of the skill.
- The three JPGs below include the speaker. They exist only in the creator's own copy and are left out of the public repo.
- `cards-overview.jpg` — the approved design cards (beat peaks on the real footage).
- `final-frames.jpg` — frames from the finished draft at the same beats (subtitles included).
- `cards-board-sample.jpg` (ep05/06) — what a 2×2 approval board with notes looks like.
- `body.html`, `script.js` — the composition parts (assembled by `scripts/assemble.py`).
- `camera.cjs` — camera keys.
- `cards.json` — card spec (time, title, line, visual, motion) = the beat sheet.
- `clear.json` — head clearance per beat; `wins.json` (ep05/06) — chroma windows; `cues.json` — SFX.

Full renders live in the creator's project folder: `<video-set>/videos/{a-full/renders/ep03-draft.mp4,
b-full/renders/ep04-draft.mp4, ep05-full/renders/ep05-draft.mp4, ep06-full/renders/ep06-draft.mp4}`.
(ep01/ep02 in `videos/v1-full`, `v2-full` predate the current style — don't use them as references; ep02 has the
"childish" stamps that were rejected.)

## ep03 — "Your price isn't the problem" (price vs value, 1:31)
Turn: buyers compare on price because value was never seeded. Main construction: **balance scale** (PRICE
weight drops, VALUE pan empty) appearing three times (hook → missing value lights up → compared on price).
Also: dialogue rows (THE LEAD / YOU / THE LEAD), iceberg cutaway (physical tip vs psychological mass), order pills
(01 VALUE → 02 PRICE), A→B bridge with "your consulting" riding the arc, IF/THEN rows that split open, VALUE
key-caps. Learn from it: one construction carrying the episode with callbacks; label-column dialogue.

## ep04 — "Why you keep undercharging" (1:20)
Turn: undercharging comes from believing your expertise isn't enough. Main construction: **price slider** vs
"what you're worth" (gap opens; final callback slides to high-ticket). Also: life wheel (halftone wedges;
callback all yellow "absolute clarity", hub text on two lines inside the white), belief gauge (needle wobble →
swing to certainty), income-curve cutaway (slow vs fast curve vs dream line, halftone area), YOUR EXPERTISE IS
ENOUGH., SALES key-caps. Learn from it: three different measuring instruments without repeating one; ghost words.

## ep05 — "You don't have a lead problem" (lead vs offer, 2:17)
Turn: attention arrives but the offer doesn't convert. Eyes → YOUR OFFER (sight-lines fade), NOT A ~~LEAD
PROBLEM~~ / IT'S AN OFFER PROBLEM., eye-chart cutaway that defocuses, SEE IT / GET IT / GO DEEPER tally (0),
paid-ads amplifier (clean vs noisy input), build-order stack with OFFER as the foundation, step-back pull-out
LEADS? or OFFER?, tally callback with "work here.", STOP. / reflect back., CLEAR OFFER. rack-focus payoff,
OFFER key-caps + NO BS. Learn from it: metaphors chosen from the mechanism (attention, clarity, amplification,
order); literal camera moves; payoff that resolves the cutaway.

## ep06 — "Not enough people on your 1:1 calls" (approach, 2:05)
Turn: an unclear approach stops people qualifying themselves. Seven 1:1 call slots (one filled → all filled
yellow), THEY DON'T UNDERSTAND / your approach., THEY ASK question rows (callback with ticks), example rows
(reverse diabetes), three-roads cutaway (meditation / diet / exercise painted on as named), domino chain
APPROACH → OFFER → RIGHT PEOPLE on a floor line ("it will always be a hassle."), APPROACH → OFFER pills,
OFFER key-caps. Learn from it: capacity + qualification metaphors; physics-like motion with `svgOrigin`;
callbacks closing two diagrams at the end.

## plan-ep07 — "Views are not trust" (planning example only, not produced)
A Phase 1–2 plan made from a synthetic ~110 s transcript by a fresh session using only this skill: a complete
`beat-sheet.md` in the required format (turn, beat table with words and timestamps, callbacks, cutaway, ghost
words, open questions), plus `cards.json`, `clear.json`, `wins.json` and `cues.json`. New metaphors: a ledge
out of reach (views pile up, trust is the missing height; callback: steps build up and THE CALL turns
yellow), a content spine (scattered post "ribs" snap onto one backbone pointing at THE ONE TRANSFORMATION),
and a target cutaway ("in their mind" you sit on the ENTERTAINING ring, not the expert bullseye). Use it as
the model for what a beat sheet should look like before you build cards. There are no images: nothing was
rendered.

## Beat-to-code map (where to look for a technique)

| technique | file / search for |
|---|---|
| proxy-driven physics (tilt, slider, needle) | ep03 `place()` scale; ep04 `placeK()` slider, `placeN()` gauge |
| JS-built SVG (wheel wedges, eyes, people, slots) | ep04 wheel `AREAS`; ep05 `EYES`, `person()`; ep06 slots loop |
| dominoes tipping around a corner | ep06 `svgOrigin: "355 560"` |
| deterministic waves / noise | ep05 `wave()` with seeded LCG |
| strike-through brush | ep05 `#rf-strike` + `draw()` |
| rack focus payoff | ep05 `#cl-l2 span` blur 28px → 0 |
| full-page cutaway with paper texture | ep03 `#ice-page`, ep04 `#in-page`, ep05 `#ch-page`, ep06 `#rd-page` |
| holding captions during a page headline | ep04 `tl.set("#captions", …)` (in b-full script) |
| wobble until a foundation lands | ep05 build-order stack (`repeat` computed to end on 0) |
| callbacks reusing the same element | ep03 scale ×3, ep04 slider ×3 / wheel ×2, ep05 people/ask ×2, ep06 slots/qual ×2 |

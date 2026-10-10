---
name: origami-blue
description: The creator's signature "origami-blue" edit for vertical talking-head reels (Instagram/Shorts/TikTok), built in HyperFrames — editorial kinetic type (Inter Tight + Instrument Serif italic), a blue/yellow/white/black palette where yellow marks only the hero moment, hand-made line-art metaphor diagrams that sit BEHIND the speaker via chroma key, ghost halftone words, line boil / dry-brush / halftone / paper textures, a series tile, subtitles under the chin, SFX. Runs a cards-first workflow: transcribe → find the episode's turn → invent a visual metaphor per beat → design cards on the real footage for approval → only then the full edit and a draft render. Use this whenever the user wants a talking-head / coach / creator / founder video edited "in my style", "origami-blue", "like the last episodes", "Coach Meet Business Series", asks for design cards, a storyboard, beat plan, metaphor or B-roll ideas for a reel, or drops new footage into a video-set folder expecting the usual treatment — even if they never say the style name.
---

# origami-blue

A premium, editorial way to cut talking-head reels. Think of a sheet of paper folded with precision: every
element is cut clean, folded in **on a spoken word**, and placed in the empty space above the speaker's head.
**Blue builds the structure; yellow marks the one moment that matters.** The speaker stays the hero — never
shrunk, never boxed, always readable around — while ideas become small physical metaphors (a scale that tips, a
slider stuck far from "what you're worth", dominoes that fall, an eye chart that goes out of focus) that the
speaker stands in front of.

This skill holds the whole craft: the look (`references/style-system.md`), the thinking method for inventing
visuals (`references/metaphor-framework.md`), the step-by-step production (`references/workflow.md`), what
actually renders reliably on the creator's 8 GB Mac (`references/render-pipeline.md`), the creator's feedback
history (`references/feedback-log.md`), and four finished episodes as references (`examples/`).

## The bar (read this before designing anything)

The creator rejected generic template edits as "worst-looking" and "childish". Every rule below comes from a
real correction — see `references/feedback-log.md` for the history.

- **Editorial, not template.** No caption boxes, neon, glow gradients, emoji, stickers, stamp circles, tilted
  paper cards, mock UI screens, clip-art people. If it would look at home in a template pack, it's wrong.
- **The footage is sacred.** Never scale below 100%, no blurred fill bars, one grade for subject and room (a
  cut-out graded differently reads as a pasted sticker). Pushes go *in*, centred on the face.
- **Text is always readable.** Inside Instagram safe zones; the head never covers a title (adaptive camera);
  readable text lives in the front layer.
- **Everything performs on the word.** Each element enters on the exact word it illustrates (word-level
  transcript timings), holds while it's true, exits before the next idea.
- **At most one yellow hero per beat.** Yellow = the word/state to remember (the pain noun in a hook headline,
  otherwise the resolution); broken-state diagrams can have none. Blue = structure (pills, lines, labels).
  White serif = secondary notes. Too much yellow reads loud.
- **Show, don't label.** A diagram must *do* something (tip, fill, fall, focus, amplify). If it only restates
  the sentence in a box, find a better metaphor (`references/metaphor-framework.md`).
- **New metaphors every episode; callbacks within an episode.** Never reuse last episode's diagram; do return
  to this episode's diagram later with the resolved state.
- **Hand-made where it adds life** — line boil on line art, dry-brush strokes, halftone fills, paper-textured
  cutaway pages, faint ink grain on headlines — always subtle.
- **Draft quality only** until the creator says "final"/"4K". Drafts get reviewed on a phone.

## Workflow

Phases 1–3 end with cards for approval. **Do not start Phase 4 until the creator approves the cards.** They
value their time and want to agree before anything long or irreversible runs.

**Phase 0 — Intake.** Locate the new footage folder (usually `<video-set>/oct-N/*.MP4`), the previous episode
number (series continuity: `ep. 0N` increments), and free disk (`df -h`; renders need ≈ 8 MB × frames free) and
RAM. Set up a Python venv with numpy/pillow/scipy if none exists. Episode order = folder listing order unless the
creator says otherwise. On a fresh install also: `npm ci` in `scripts/node` if `node_modules` is missing, and
`scripts/get_sfx.sh` if `assets/template/sfx/` is empty (see the README).

**Whose video is it?** The series identity in this skill (the `coach meet / business series` tile, the "₹1 crore
coaching business" line, the CTA key-caps wording) belongs to one creator's Coach Meet Business Series. For
anyone else, keep the craft (palette logic, type, textures, metaphors, motion, cards-first) but ask for their
series name, tile wording, recurring promise line (if any) and CTA before designing; with no series, use the
one-off pattern in `references/metaphor-framework.md`. Never put another creator's series name on their video.

**Phase 1 — Understand.** `scripts/prep.sh` → SDR footage + word-level transcript per clip. Read the whole
transcript. Find the **turn** (the one belief the episode flips: "your price isn't the problem", "you don't have
a lead problem — you have an offer problem"). Segment into beats (hook, series intro, setup, turn, evidence,
example, consequence, instruction, payoff, CTA). Note mishearings ("one-core" → ₹1 crore, "call to your offer" →
"comment your offer").

**Phase 2 — Design.** Run the metaphor framework on every beat → a beat sheet: time window, the spoken line,
the visual, the motion keyed to words, the yellow hero, behind/front layer, camera move, SFX. Then author the
composition from the template (`scripts/new_episode.sh`): `parts/body.html`, `parts/script.js`, `camera.cjs`,
plus `<key>-cards.json`, `<key>-clear.json` (graphics bottom per beat), `<key>-wins.json` (behind windows),
`<key>-cues.json` (SFX). Study the closest example in `examples/` first; match its level of finish. While
authoring, `scripts/quick.sh <episode.env> [times]` snapshots the graphics alone on grey in seconds — use it to
iterate on layout and timing before paying for cards.

**Phase 3 — Cards.** `scripts/cards.sh <episode.env>` renders each beat frozen at its peak on the real footage
frame, with chroma key, safe-zone guides and line / on-screen / motion notes → `cards/overview.jpg`,
`cards/boards/*.jpg`, `cards/keytest.jpg`. Inspect every card yourself (overlaps, wraps, things visible too early,
key quality) and fix before sending. Send overview + boards; list open questions (spellings, mishearings,
episode order). Then wait.

**Phase 4 — Production** (after approval). `caffeinate -dimsu bash scripts/render.sh <episode.env>`: cut-out →
book key → adaptive camera → footage prep → graphics-only passes → composite → audio → draft + phone preview +
QA sheet. ~1–1.5 h per 2-minute episode on the 8 GB Mac; resumable after crashes or power cuts.

**Phase 5 — QA & delivery.** Compare `renders/epNN-sheet.jpg` against the approved cards, scrub the moments
around every entrance (elements showing before their word is the classic bug), check captions don't collide
with page headlines, loudness ≈ −14 LUFS, frame count = duration × 30. Send the `-preview.mp4` (phone, < 30 MB)
and give the full-res path. Add the episode to the HyperFrames desktop app as `Business Ep NN - <Topic>`
(`APP_NAME` in the env file, or `scripts/to_app.sh`).

**Phase 6 — Revisions.** Change the composition, then `scripts/segpass.py` re-renders only the affected seconds
of the affected pass (frame-exact splice), then recomposite. Minutes, not hours.

## Working with the creator

- Speak plainly; explain causes honestly when something fails and what you'll do about it.
- Ask before deleting, overwriting finished work, or starting long jobs that haven't been approved; never waste
  their time. Once approved, run to completion and post short status lines.
- Feedback arrives by card number or timestamp — change only that, keep everything else.
- Keep series identity identical across episodes (tile, ₹1 crore line, CTA key-caps); innovate inside beats.

## Files

- `references/style-system.md` — palette, type, layout zone, components, textures, motion vocabulary, camera,
  captions, SFX. Read in Phase 2.
- `references/metaphor-framework.md` — how to invent the visual for each beat, opening/series patterns,
  callbacks, rhythm, metaphor bank, litmus tests. Read in Phase 2 before writing any beat.
- `references/workflow.md` — exact commands, file formats (cards/clear/wins/cues/zones/episode.env), timings.
  Read in Phase 1 and keep open.
- `references/render-pipeline.md` — what works and what hangs on this machine and why; recovery. Read before
  Phase 4 or when anything fails.
- `references/feedback-log.md` — every correction the creator made, with the reason. Skim at the start.
- `examples/README.md` — four finished episodes (compositions, specs, card sheets, final frames) and what each
  demonstrates.
- `scripts/` — the tested pipeline (see `references/workflow.md` for each script's role).
- `assets/` — shared style/fx injected by `assemble.py`, and the project template (fonts, textures, SFX,
  passes.sh, composite.py, skeleton parts).

HyperFrames basics (composition contract, data attributes, lint) live in the `hyperframes` / `hyperframes-core`
skills; load them if you need framework details. Pin the CLI: `npx hyperframes@0.8.134`.

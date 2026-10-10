# origami-blue — rendering on the creator's Mac (what works, what hangs, why)

Machine: Apple M2, 8 GB RAM, macOS, frequent thermal throttling; disk often tight. HyperFrames CLI pinned
`hyperframes@0.8.134`. Everything below was learned the hard way across ep.01–06.

## The route that works (use `scripts/render.sh`)

1. **SDR first.** iPhone HEVC 10-bit HLG → SDR h264 via VideoToolbox (`prep.sh`). Working in HDR made every
   later step slow and colour-unstable.
2. **ML cut-out** with `hyperframes remove-background` → ProRes 4444 (grows to ~10 GB) → keep only the alpha
   as gray h264 (`<k>-alpha.mp4`) and delete the .mov.
3. **Subject key for the bookshelf room.** The ML model glues the leaning book stack, plant and lamp to the
   hair. Fix: camera is locked, so build a temporal-**mode** clean plate (static books win over moving hair;
   a median plate is wrong because skin/hair dominate it), then cut matte pixels that match the plate inside a
   zone, protect the face (big skin blob in the current frame, except inside prop boxes), cut thin bridges by
   erosion, keep the body-connected component, restrict the area above the neck to the head's column span, and
   over the hair only cut on strong evidence. Result: clean hair, at most a tiny book corner.
4. **Adaptive camera.** `camera.cjs` (GSAP keys) → per-frame transform; `adapt.py` slides/pushes so the head
   top stays below each beat's graphics (zoom cap 1.25) and computes the caption offset under the chin.
5. **Footage prep in screen space** (`plates.py`, 3 parallel slices cut outside chroma windows): camera +
   grade + vignette/top shade + graduated depth-of-field → `media/base.mp4`; the subject cut-out (same pixels,
   with alpha) only for the chroma windows → `media/subj-XX.webm`.
6. **Graphics-only HyperFrames passes** (`passes.sh`): three transparent png sequences (behind / front / caps)
   from the composition with *no video in the page*, `--workers 2 --no-low-memory-mode`, retry with 1 worker.
7. **Light composite** (`fastcomp.py`): base → behind → subject (only where behind draws) → front → caps
   (shifted under the chin). Blends only each frame's content bounding box.
8. **Audio** (`mix.py`, −14 LUFS) muxed in; 720p preview < 30 MB for the phone.

## What failed and why (don't retry these blindly)

- **One-shot HyperFrames render with the footage/cut-out `<video>` inside the page.** HyperFrames extracts
  every video frame itself (alpha sources always as PNG). 10–16 s tests pass; full-length renders hang after
  hundreds–thousands of frames: a Chrome worker stops answering ("Runtime.callFunctionOn timed out",
  "Sequential screenshot capture stalled: stuck at frame N"), heavy swap. Happened on oct-6 and twice on oct-9.
- **`HF_SEGMENTED_CAPTURE=true`** (resumable segmented mode): one segment hung in both oct-9 renders. Avoid.
- **Running two Chrome renders, or a render + the cut-out + Python prep at once**: swap → stalls. Overlap
  CPU-only jobs (key, prep slices) with each other, keep Chrome renders alone.
- **PNG passes for everything with a VP9-alpha video inside**: same hang as above.
- **Median clean plate**: removes the forehead (skin dominates the median). Use the mode plate + skin guard.
- **Skin guard without prop boxes**: orange/cream book spines read as skin and get protected → books stay.
- **SVG filter on a perfectly horizontal `<line>`**: zero-height bbox → the line vanishes.

## Recovery

- Every orchestrator step writes its output atomically (`.tmp` → mv) and skips when done; after a crash or
  power cut, just re-run `render.sh` with the same env file. `remove-background` cannot resume — a partial
  matte restarts from zero, so start it early and keep the Mac on power (`caffeinate -dimsu`).
- A pass with fewer frames than N → `passes.sh` again for that layer (it deletes and re-renders it).
- A stuck Chrome render: kill `hyperframes render` + headless Chrome processes, re-run the pass.
- If the machine reboots mid-run, check `uptime`, `pgrep -fl "hyperframes|plates.py|keyvideo"`, and the
  logs; finished artefacts are reused.

## Disk and memory

- Renderer refuses to start if free disk < ~8 MB × frames (≈ 33 GB for 4,100 frames). Old PNG pass folders
  (`videos/*/renders/{behind,front,caps}`) are the big reclaimable items (≈ 3–5 GB per episode) — ask before
  deleting; keep drafts.
- `memory_pressure` > 50% free before starting Chrome passes; close other heavy apps if needed.
- Thermal throttling (kernel_task high) slows everything 2–3×; nothing to do but not overlap jobs.

## Speed knobs

- Footage prep: 3 slices in parallel; x264 `faster`; VP9 `-deadline realtime -cpu-used 8 -row-mt 1`; blur only
  the band above the head.
- Keying: 2 processes, quarter-res morphology via distance transforms.
- Passes: behind/caps ≈ 4 min each per 4k frames; front ≈ 20–30 min (blur filters, masks, brush).
- Composite: ≈ 0.15–0.25 s/frame; two episodes in parallel takes about as long as sequential.

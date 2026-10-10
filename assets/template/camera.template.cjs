// origami-blue camera: screen = s * source + (dx, dy); s >= 1 always (never shrink footage).
// Face-centred pushes around (540, 1000) — the face, not the frame centre. adapt.py later adds clearance
// so the head never covers graphics (and caps the zoom at 1.25).
// KEYS: [startTime, state, duration, ease]; duration 0 = hard set (use under full-screen tiles/cutaways).
const full = (z = 1, fx = 540, fy = 1000) => ({ s: z, dx: fx * (1 - z), dy: fy * (1 - z), p: 0 });
const KEYS = [
  [0, full(1.10), 0], [0, full(1.06), 5.2, "sine.inOut"],                         // hook: slow settle
  [5.44, full(1.15), 0.3, "power4.out"], [5.74, full(1.18), 0.7, "sine.out"],      // punch on the hook's key word
  [6.5, full(1.04), 0],                                                           // reset under the tile
  [8.9, full(1.03), 1.3, "sine.inOut"],
  [10.32, full(1.10), 0.35, "power4.out"], [10.67, full(1.12), 1.0, "sine.out"],  // punch on "one crore"
  [11.76, full(1.03), 0.7, "power3.inOut"],
  // diagram beats: go wide (1.00-1.02) and drift; claims: punch 0.3s power4.out, hold with sine.out, release 0.6s power3.inOut
];
module.exports = { KEYS };

const { gsap } = require("gsap");
const path = process.argv[2], out = process.argv[3], N = +process.argv[4];
const { KEYS } = require(path);
const o = Object.assign({}, KEYS[0][1]);
const tl = gsap.timeline({ paused: true });
for (const [t, st, d, ease] of KEYS) {
  if (!d) tl.set(o, st, t); else tl.to(o, Object.assign({ duration: d, ease }, st), t);
}
const res = [];
for (let i = 0; i < N; i++) { tl.seek(i / 30, false); res.push([+o.s.toFixed(5), +o.dx.toFixed(2), +o.dy.toFixed(2), +o.p.toFixed(4)]); }
// coverage check (outside plate)
let bad = 0;
res.forEach(([s, dx, dy, p], i) => { if (p < 0.001 && (dx > 0.5 || dy > 0.5 || dx + 1080 * s < 1079.5 || dy + 1920 * s < 1919.5)) bad++; });
require("fs").writeFileSync(out, JSON.stringify(res));
console.log("frames", N, "uncovered frames:", bad, res[0], res[3500] || "");

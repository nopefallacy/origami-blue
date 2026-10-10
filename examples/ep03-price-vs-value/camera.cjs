// ep.03 camera: screen = s * source + (dx, dy); s >= 1 always. Subject sits low in this room -> face-centred pushes.
const full = (z = 1, fx = 540, fy = 1000) => ({ s: z, dx: fx * (1 - z), dy: fy * (1 - z), p: 0 });
const KEYS = [
  [0, full(1.08), 0], [0, full(1.04), 4.6, "sine.inOut"],
  [5.0, full(1.05), 0.5, "power2.inOut"], [6.72, full(1.14), 0.35, "power4.out"], [7.07, full(1.17), 2.4, "sine.out"],
  [9.7, full(1.06), 0], [11.68, full(1.03), 2.7, "sine.inOut"],
  [14.64, full(1.0), 0.7, "power3.inOut"], [15.34, full(1.03), 1.5, "sine.inOut"],
  [16.9, full(1.05), 0.7, "power3.inOut"], [17.6, full(1.02), 9.5, "sine.inOut"],
  [27.36, full(1.12), 0.3, "power4.out"], [27.66, full(1.15), 1.8, "sine.out"],
  [29.68, full(1.05), 0.6, "power3.inOut"], [30.28, full(1.02), 10.0, "sine.inOut"],
  [44.6, full(1.05), 0.5, "power3.inOut"],
  [48.24, full(1.0), 0.8, "power3.inOut"], [49.04, full(1.06, 540, 900), 8.2, "sine.inOut"],
  [57.5, full(1.03), 0.7, "power3.inOut"], [58.2, full(1.0), 10.3, "sine.inOut"],
  [72.75, full(1.08), 0.35, "power2.out"], [73.1, full(1.06), 5.0, "sine.inOut"],
  [78.83, full(1.04), 0.6, "power3.inOut"], [83.23, full(1.14), 0.3, "power4.out"], [83.53, full(1.17), 0.8, "sine.out"],
  [84.35, full(1.0), 0.7, "power3.inOut"], [85.05, full(1.03), 1.5, "sine.inOut"],
  [86.6, full(1.05), 0.6, "power3.inOut"], [87.2, full(1.02), 3.4, "sine.inOut"],
];
module.exports = { KEYS };

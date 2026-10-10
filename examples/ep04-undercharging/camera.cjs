// ep.04 camera: s >= 1 always; subject sits low in this room -> face-centred pushes.
const full = (z = 1, fx = 540, fy = 1000) => ({ s: z, dx: fx * (1 - z), dy: fy * (1 - z), p: 0 });
const KEYS = [
  [0, full(1.08), 0], [0, full(1.04), 2.8, "sine.inOut"],
  [2.88, full(1.13), 0.35, "power4.out"], [3.23, full(1.15), 1.0, "sine.out"],
  [4.3, full(1.05), 0.5, "power3.inOut"], [6.64, full(1.12), 0.35, "power4.out"], [6.99, full(1.14), 0.5, "sine.out"],
  [7.6, full(1.06), 0], [9.68, full(1.03), 2.6, "sine.inOut"],
  [12.64, full(1.0), 0.7, "power3.inOut"], [13.34, full(1.03), 7.8, "sine.inOut"],
  [21.44, full(1.05), 0.5, "power3.inOut"], [24.8, full(1.12), 0.35, "power4.out"], [25.15, full(1.15), 2.6, "sine.out"],
  [28.48, full(1.04), 0.6, "power3.inOut"], [33.68, full(1.12), 0.3, "power4.out"], [33.98, full(1.14), 0.6, "sine.out"],
  [34.7, full(1.04), 0.6, "power3.inOut"], [35.3, full(1.02), 11.4, "sine.inOut"],
  [46.88, full(1.1), 0.4, "power3.out"], [47.28, full(1.12), 3.5, "sine.out"],
  [50.8, full(1.15), 0.3, "power4.out"], [51.1, full(1.08), 1.9, "power2.inOut"],
  [59.07, full(1.0), 0.7, "power3.inOut"], [59.77, full(1.03), 11.0, "sine.inOut"],
  [71.23, full(1.0), 0.6, "power3.inOut"], [71.83, full(1.03), 2.2, "sine.inOut"],
  [74.27, full(1.05), 0.6, "power3.inOut"], [74.87, full(1.02), 5.3, "sine.inOut"],
];
module.exports = { KEYS };

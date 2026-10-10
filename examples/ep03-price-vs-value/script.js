      (function () {
        const tl = gsap.timeline({ paused: true });
        const DUR = 90.66;
        const blurIn = (sel, t, o = {}) =>
          tl.fromTo(sel, { opacity: 0, filter: "blur(16px)", y: o.y === undefined ? 18 : o.y, scale: o.s || 1 },
            { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, duration: o.d || 0.42, ease: o.e || "power3.out", stagger: o.st || 0 }, t);
        const blurOut = (sel, t, o = {}) =>
          tl.to(sel, { opacity: 0, filter: "blur(14px)", y: o.y === undefined ? -16 : o.y, duration: o.d || 0.32, ease: "power2.in", stagger: o.st || 0 }, t);
        const draw = (sel, t, d, ease) =>
          tl.fromTo(sel, { strokeDasharray: 1600, strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: d, ease: ease || "power2.inOut" }, t);
        const q = (s) => Array.from(document.querySelectorAll(s));
        const wordsAt = (sel, times) => q(sel).forEach((el, i) => blurIn(el, times[i], { y: 10, d: 0.32 }));

        // ---------------- hook ----------------
        blurIn("#h-l1 span", 0.0, { st: 0.08, d: 0.38, y: 10 });
        blurIn("#h-l2 span", 0.38, { st: 0.16, d: 0.55, s: 1.12, y: 0 });
        draw("#h-swoosh", 0.95, 0.5);
        blurOut(["#h-l1 span", "#h-l2 span"], 4.7, { st: 0.03 });
        tl.to("#h-swoosh", { opacity: 0, duration: 0.25 }, 4.7);

        // ---------------- balance scale (price vs value) ----------------
        const S = { t: 0 }; // tilt in degrees, + = price side down
        const L = document.getElementById("sc-L"), R = document.getElementById("sc-R"), beam = document.getElementById("sc-beam");
        const place = () => {
          const r = (S.t * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
          L.setAttribute("transform", `translate(${540 - 290 * c} ${320 + 290 * s})`);
          R.setAttribute("transform", `translate(${540 + 290 * c} ${320 - 290 * s})`);
          beam.setAttribute("x1", 540 - 290 * c); beam.setAttribute("y1", 320 + 290 * s);
          beam.setAttribute("x2", 540 + 290 * c); beam.setAttribute("y2", 320 - 290 * s);
        };
        place();
        const tilt = (to, t, d, ease) => tl.to(S, { t: to, duration: d, ease: ease || "power3.inOut", onUpdate: place }, t);
        gsap.set(["#sc-all", "#sc-l1", "#sc-l2", "#sc-l3", "#sc-price", "#sc-q"], { opacity: 0 });
        // appearance 1 — the hook: price drops in, the scale tips
        tl.to("#sc-all", { opacity: 1, duration: 0.4 }, 5.0);
        tl.fromTo("#sc-price", { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.in" }, 5.12);
        tilt(9, 5.55, 0.7, "back.out(1.6)");
        tilt(14, 6.72, 0.5, "power3.out");
        blurIn("#sc-l1", 6.72, { y: 8 });
        tl.fromTo("#sc-q", { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, 7.84);
        tl.to(["#sc-all", "#sc-l1"], { opacity: 0, duration: 0.35 }, 9.3);
        // appearance 2 — they can't see the value
        tl.to("#sc-all", { opacity: 1, duration: 0.45 }, 29.68);
        blurIn("#sc-l2", 32.48, { y: 8 });
        tl.to("#sc-vbox", { stroke: "#FED100", duration: 0.3 }, 33.04);
        tl.to("#sc-vtxt", { fill: "#FED100", duration: 0.3 }, 33.04);
        tl.to("#sc-value", { scale: 1.15, transformOrigin: "50% 50%", duration: 0.2, yoyo: true, repeat: 3 }, 33.1);
        tl.to(["#sc-all", "#sc-l2"], { opacity: 0, duration: 0.35 }, 35.1);
        tl.set("#sc-vbox", { stroke: "#F5F3EE" }, 35.5);
        tl.set("#sc-vtxt", { fill: "#F5F3EE" }, 35.5);
        // appearance 3 — not seeded: compared on price
        tl.to("#sc-all", { opacity: 1, duration: 0.45 }, 78.83);
        tilt(18, 83.23, 0.45, "power3.out");
        blurIn("#sc-l3", 83.23, { y: 8 });
        tl.to(["#sc-all", "#sc-l3"], { opacity: 0, duration: 0.3 }, 84.2);

        // ---------------- series tile ----------------
        tl.fromTo("#tile", { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 11.68);
        tl.fromTo("#t-num", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power4.out" }, 9.7);
        blurIn("#t-coach", 10.16, { y: 12 });
        tl.fromTo("#t-business", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.42, ease: "power4.out" }, 11.04);
        tl.fromTo("#t-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.inOut" }, 11.2);
        tl.fromTo("#t-series .txt", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 11.3);
        blurIn("#t-foot", 10.6, { y: 6 });

        // ---------------- ₹1 crore ----------------
        wordsAt("#cr-l1 span", [12.4, 12.56, 12.72, 12.88, 12.96, 13.12]);
        blurIn("#cr-l2 span", 13.28, { s: 1.14, y: 0, d: 0.5, st: 0.12 });
        blurIn("#cr-biz", 13.92, { y: 10 });
        blurOut(["#cr-l1 span", "#cr-l2 span", "#cr-biz"], 14.3, { st: 0.02 });

        // ---------------- the call ----------------
        tl.fromTo("#ca-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power3.inOut" }, 17.0);
        blurIn("#ca-k1", 18.08, { y: 6 });
        blurIn("#ca-q1", 19.44, { y: 10 });
        blurIn("#ca-k2", 25.12, { y: 6 });
        tl.fromTo("#ca-p", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, 25.6);
        blurIn("#ca-k3", 27.04, { y: 6 });
        blurIn("#ca-q3", 27.36, { y: 10 });
        tl.to(["#ca-k1", "#ca-q1", "#ca-k2"], { opacity: 0.45, duration: 0.4 }, 27.7);
        blurOut(["#ca-k1", "#ca-q1", "#ca-k2", "#ca-p", "#ca-k3", "#ca-q3"], 29.2, { st: 0.02 });
        tl.to("#ca-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.3 }, 29.2);

        // ---------------- the life after ----------------
        wordsAt("#af-l1 span", [36.96, 37.12, 37.3]);
        blurIn("#af-l2", 37.68, { s: 1.06, y: 0, d: 0.5 });
        blurOut(["#af-l1 span", "#af-l2"], 40.3, { st: 0.02 });

        // ---------------- B-roll: iceberg ----------------
        tl.fromTo("#ice-page", { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "power4.inOut" }, 40.45);
        draw("#ice-water", 40.85, 0.6, "power2.out");
        blurIn("#ice-k", 41.0, { y: 8 });
        draw("#ice-tip", 41.36, 0.5, "power2.out");
        draw("#ice-lead", 41.9, 0.2, "power2.out");
        blurIn("#ice-phys", 42.08, { y: 6 });
        draw("#ice-deep", 42.8, 0.8, "power2.inOut");
        blurIn("#ice-psy", 43.28, { y: 10, d: 0.5 });
        tl.to("#ice-page", { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 44.4);

        // ---------------- value, then price ----------------
        blurIn("#or-k", 44.72, { y: 6 });
        tl.fromTo("#or-1", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.8)" }, 44.72);
        draw("#or-ar", 46.88, 0.3, "power2.out");
        tl.fromTo("#or-2", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, 47.28);
        blurIn("#or-s", 47.4, { y: 8 });
        blurOut(["#or-k", "#or-1", "#or-ar", "#or-2", "#or-s"], 48.05, { st: 0.02 });

        // ---------------- point A -> point B ----------------
        tl.fromTo(["#br-a", "#br-at"], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 57.92);
        blurIn("#br-al", 59.36, { y: 8 });
        tl.fromTo(["#br-b", "#br-bt"], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 62.27);
        blurIn("#br-bl", 62.6, { y: 8 });
        draw("#br-arc", 64.2, 0.8, "power2.out");
        tl.fromTo("#br-pill", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.8)" }, 64.43);
        draw("#br-arc2", 66.91, 1.12, "power1.inOut");
        // dot rides the bridge from A to B
        const bz = (t) => { const u = 1 - t; return [u*u*u*236 + 3*u*u*t*360 + 3*u*t*t*720 + t*t*t*844, u*u*u*420 + 3*u*u*t*236 + 3*u*t*t*236 + t*t*t*420]; };
        const kf = []; for (let i = 1; i <= 16; i++) { const [x, y] = bz(i / 16); kf.push({ attr: { cx: x, cy: y }, duration: 1.12 / 16 }); }
        gsap.set("#br-dot", { opacity: 0 });
        tl.to("#br-dot", { opacity: 1, duration: 0.1 }, 66.85);
        tl.to("#br-dot", { keyframes: kf, ease: "none" }, 66.91);
        tl.to("#br-b", { scale: 1.12, transformOrigin: "50% 50%", duration: 0.15, ease: "power2.out" }, 68.03);
        tl.to("#br-b", { scale: 1, duration: 0.3, ease: "power2.inOut" }, 68.18);
        blurOut(["#br-a", "#br-at", "#br-al", "#br-b", "#br-bt", "#br-bl", "#br-pill", "#br-arc", "#br-arc2", "#br-dot"], 68.45, { st: 0.01 });

        // ---------------- if seeded -> the pricing discussion opens ----------------
        tl.fromTo("#it-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 69.1);
        blurIn("#it-k1", 69.23, { y: 6 });
        blurIn("#it-r1", 69.47, { y: 10 });
        draw("#it-check", 71.63, 0.3, "power2.out");
        blurIn("#it-k2", 72.75, { y: 6 });
        tl.fromTo(["#it-dl", "#it-dr"], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 72.9);
        gsap.set("#it-reveal", { opacity: 0 });
        tl.set("#it-reveal", { opacity: 1 }, 74.0);
        tl.to("#it-dl", { x: -60, opacity: 0, duration: 0.55, ease: "power3.inOut" }, 74.03);
        tl.to("#it-dr", { x: 60, opacity: 0, duration: 0.55, ease: "power3.inOut" }, 74.03);
        tl.to("#it-reveal", { scale: 1.04, duration: 0.15, ease: "power2.out" }, 77.47);
        tl.to("#it-reveal", { scale: 1, duration: 0.3, ease: "power2.inOut" }, 77.62);
        blurOut(["#it-k1", "#it-r1", "#it-check", "#it-k2", "#it-reveal"], 78.3, { st: 0.02 });
        tl.to("#it-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.3 }, 78.3);

        // ---------------- CTA ----------------
        wordsAt("#cta-l1 span", [86.83, 87.0, 87.15]);
        q(".key").forEach((k, i) => tl.fromTo(k, { opacity: 0, y: -50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)" }, 87.31 + i * 0.07));
        blurIn("#cta-s", 88.27, { y: 10 });


        // ---------------- depth: floats + ghost type ----------------
        float("#sc-all", 5.0, 84.4, 6); float("#br-all", 57.5, 68.7, 6);
        ghost("#gh1", 0.3, 5.0); ghost("#gh2", 37.1, 40.7); ghost("#gh3", 86.7, 90.66);

        // ---------------- captions (separate layer) ----------------
        const capsEl = document.getElementById("captions"), spans = [];
        (window.CAPS || []).forEach((c, ci, all) => {
          const next = all[ci + 1], start = c[0][0];
          let end = next ? Math.min(next[0][0], c[c.length - 1][1] + 0.5) : DUR;
          if (start < 9.6 && end > 9.6) end = 9.6;
          const row = document.createElement("div"); row.className = "cap";
          c.forEach(([t, e, raw]) => {
            const k = raw.endsWith("*"), w = document.createElement("span");
            w.className = "w" + (k ? " k" : ""); w.textContent = k ? raw.slice(0, -1) : raw; row.appendChild(w);
            tl.fromTo(w, { opacity: 0, y: 10, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16, ease: "power2.out" }, Math.max(0, t - 0.02));
          });
          capsEl.appendChild(row); tl.set(row, { opacity: 0 }, end); spans.push([Math.max(0, start - 0.02), end]);
        });
        const merged = [];
        spans.forEach(([a0, b0]) => { const l = merged[merged.length - 1]; if (l && a0 - l[1] < 0.35) l[1] = Math.max(l[1], b0); else merged.push([a0, b0]); });
        merged.forEach(([a0, b0]) => { tl.to("#cap-burn", { opacity: 1, duration: 0.15 }, a0); tl.to("#cap-burn", { opacity: 0, duration: 0.2 }, Math.max(a0 + 0.15, b0 - 0.1)); });

        // ---------------- grain ----------------
        const g = { f: 0 }, grainEl = document.getElementById("grain");
        tl.fromTo(g, { f: 0 }, { f: DUR * 12, duration: DUR, ease: "none", onUpdate: () => {
          const n = Math.floor(g.f); grainEl.style.backgroundPosition = ((n * 137) % 384) + "px " + ((n * 211) % 384) + "px"; } }, 0);

        window.__timelines["main"] = tl;
      })();

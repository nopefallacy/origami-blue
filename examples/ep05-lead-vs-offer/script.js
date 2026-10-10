      (function () {
        const tl = gsap.timeline({ paused: true });
        const DUR = 137.47;
        const NS = "http://www.w3.org/2000/svg";
        const blurIn = (sel, t, o = {}) =>
          tl.fromTo(sel, { opacity: 0, filter: "blur(16px)", y: o.y === undefined ? 18 : o.y, scale: o.s || 1 },
            { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, duration: o.d || 0.42, ease: o.e || "power3.out", stagger: o.st || 0 }, t);
        const blurOut = (sel, t, o = {}) =>
          tl.to(sel, { opacity: 0, filter: "blur(14px)", y: o.y === undefined ? -16 : o.y, duration: o.d || 0.32, ease: "power2.in", stagger: o.st || 0 }, t);
        const draw = (sel, t, d, ease) =>
          tl.fromTo(sel, { strokeDasharray: 1600, strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: d, ease: ease || "power2.inOut" }, t);
        const q = (s) => Array.from(document.querySelectorAll(s));
        const wordsAt = (sel, times) => q(sel).forEach((el, i) => blurIn(el, times[i], { y: 10, d: 0.32 }));
        const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };
        const pop = (sel, t, o = {}) => { gsap.set(sel, { opacity: 0 }); return tl.fromTo(sel, { opacity: 0, scale: o.from || 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: o.d || 0.34, ease: o.e || "back.out(2.2)", stagger: o.st || 0, immediateRender: false }, t); };

        // ---------------- hook: you don't have a lead problem ----------------
        blurIn("#h-l1 span", 0.05, { st: 0.08, d: 0.38, y: 10 });
        blurIn("#h-l2 span", 0.45, { st: 0.16, d: 0.55, s: 1.12, y: 0 });
        draw("#h-swoosh", 5.44, 0.5);
        blurOut(["#h-l1 span", "#h-l2 span"], 6.2, { st: 0.03 });
        tl.to("#h-swoosh", { opacity: 0, duration: 0.25 }, 6.2);

        // ---------------- series tile ----------------
        tl.fromTo("#tile", { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 8.9);
        tl.fromTo("#t-num", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power4.out" }, 6.6);
        blurIn("#t-coach", 7.2, { y: 12 });
        tl.fromTo("#t-business", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.42, ease: "power4.out" }, 8.0);
        tl.fromTo("#t-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.inOut" }, 8.2);
        tl.fromTo("#t-series .txt", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 8.3);
        blurIn("#t-foot", 7.6, { y: 6 });

        // ---------------- ₹1 crore ----------------
        wordsAt("#cr-l1 span", [9.44, 9.6, 9.76, 9.92, 10.08, 10.24]);
        blurIn("#cr-l2 span", 10.32, { s: 1.14, y: 0, d: 0.5, st: 0.12 });
        blurIn("#cr-biz", 10.96, { y: 10 });
        blurOut(["#cr-l1 span", "#cr-l2 span", "#cr-biz"], 11.45, { st: 0.02 });

        // ---------------- eyes on your offer ----------------
        const eg = document.getElementById("ey-g"), lg = document.getElementById("ey-lines");
        const EYES = [[150, 330], [250, 330], [350, 330], [450, 330], [150, 410], [250, 410], [350, 410], [450, 410], [150, 490], [250, 490], [350, 490], [450, 490]];
        const eyes = EYES.map(([x, y]) => {
          const ln = el("line", { x1: x + 36, y1: y, x2: 634, y2: 410, stroke: "rgba(245,243,238,0.5)", "stroke-width": 2, "stroke-dasharray": "5 8", opacity: 0 }, lg);
          const g = el("g", { transform: `translate(${x} ${y})`, opacity: 0 }, eg);
          const inner = el("g", {}, g);
          el("path", { d: "M-34 0 Q 0 -27 34 0 Q 0 27 -34 0 Z", fill: "rgba(18,17,19,0.35)", stroke: "#F5F3EE", "stroke-width": 3, "stroke-linejoin": "round" }, inner);
          const p = el("circle", { cx: 0, cy: 0, r: 10, fill: "#5AA9E6" }, inner);
          el("circle", { cx: 0, cy: 0, r: 3.5, fill: "#121113" }, inner);
          return { g, inner, p, ln };
        });
        const first = [1, 4, 6, 9, 2, 11].map((i) => eyes[i]), second = [0, 3, 5, 7, 8, 10].map((i) => eyes[i]);
        gsap.set(["#ey-k", "#ey-offer", "#ey-msg1", "#ey-msg2"], { opacity: 0 });
        blurIn("#ey-offer", 13.2, { y: 10 });
        blurIn("#ey-k", 14.4, { y: 6 });
        pop(first.map((e) => e.g), 17.6, { st: 0.06 });
        tl.to(first.map((e) => e.ln), { opacity: 1, duration: 0.3, stagger: 0.05 }, 18.4);
        tl.to(eyes.map((e) => e.p), { attr: { cx: 9 }, duration: 0.3, ease: "power2.out" }, 18.4);
        tl.to(first.map((e) => e.ln), { opacity: 0.14, duration: 0.5 }, 21.44);
        tl.to("#ey-offer", { opacity: 0.55, duration: 0.5 }, 21.44);
        blurIn("#ey-msg1", 24.0, { y: 8 });
        // more leads: more eyes, same dead offer
        tl.to("#ey-msg1", { opacity: 0, duration: 0.25 }, 26.9);
        pop(second.map((e) => e.g), 27.04, { st: 0.05 });
        tl.to(second.map((e) => e.ln), { opacity: 0.14, duration: 0.3, stagger: 0.04 }, 27.3);
        blurIn("#ey-msg2", 27.2, { y: 8 });
        tl.to("#ey-all", { opacity: 0, duration: 0.3 }, 28.3);

        // ---------------- reframe: an offer problem ----------------
        tl.fromTo("#rf-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 29.95);
        blurIn("#rf-k1", 30.16, { y: 6 });
        blurIn("#rf-r1", 30.48, { y: 10 });
        draw("#rf-strike", 30.96, 0.4, "power2.out");
        tl.to("#rf-r1", { opacity: 0.5, duration: 0.3 }, 31.4);
        blurIn("#rf-k2", 32.08, { y: 6 });
        pop("#rf-r2", 32.72, { from: 0.82 });
        blurOut(["#rf-k1", "#rf-r1", "#rf-strike", "#rf-k2", "#rf-r2"], 33.55, { st: 0.02 });
        tl.to("#rf-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.3 }, 33.55);

        // ---------------- B-roll: the eye chart ----------------
        const rows = ["#ch-r1", "#ch-r2", "#ch-r3", "#ch-r4"], fog = [1.5, 5, 9, 14];
        tl.fromTo("#ch-page", { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "power4.inOut" }, 37.95);
        blurIn("#ch-k", 38.4, { y: 6 });
        rows.forEach((r, i) => tl.fromTo(r, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 38.5 + i * 0.14));
        tl.fromTo(".ch-rule", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 38.6);
        // "not very clear": the chart defocuses, line by line
        rows.forEach((r, i) => tl.to(r, { filter: `blur(${fog[i]}px)`, duration: 0.7, ease: "power2.inOut" }, 39.6 + i * 0.08));
        blurIn("#ch-s", 39.9, { y: 10 });
        rows.forEach((r, i) => tl.to(r, { filter: `blur(${fog[i] * 1.8 + 2}px)`, duration: 0.6, ease: "power2.inOut" }, 44.4 + i * 0.05));
        tl.to("#ch-page", { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 45.0);

        // ---------------- people: see it / get it / go deeper ----------------
        const pg = document.getElementById("pp-g");
        const person = (x, y, solid) => {
          const g = el("g", { opacity: 0 }, pg);
          el("circle", { cx: x, cy: y - 12, r: 10, fill: solid ? "#5AA9E6" : "none", stroke: solid ? "#5AA9E6" : "#F5F3EE", "stroke-width": 2.5, "stroke-dasharray": solid ? "none" : "4 4" }, g);
          el("path", { d: `M${x - 18} ${y + 20} Q ${x} ${y - 6} ${x + 18} ${y + 20}`, fill: "none", stroke: solid ? "#5AA9E6" : "#F5F3EE", "stroke-width": 3, "stroke-linecap": "round", "stroke-dasharray": solid ? "none" : "4 5" }, g);
          return g;
        };
        const R1 = [], R2 = [];
        for (let i = 0; i < 10; i++) { R1.push(person(330 + i * 62, 304, true)); R2.push(person(330 + i * 62, 384, false)); }
        gsap.set(["#pp-all", "#pp-l1a", "#pp-l1b", "#pp-l2", "#pp-l3", "#pp-zero", "#pp-work", "#pp-q", "#pp-brace"], { opacity: 0 });
        // appearance 1: five see it, nobody goes deeper
        tl.to("#pp-all", { opacity: 1, duration: 0.2 }, 45.5);
        tl.fromTo("#pp-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 45.55);
        blurIn(["#pp-l1a", "#pp-l2"], 45.7, { y: 6, st: 0.12 });
        pop(R1.slice(0, 5), 47.36, { st: 0.05 });
        tl.to(R2.slice(0, 5), { opacity: 0.6, duration: 0.3, stagger: 0.04 }, 47.68);
        blurIn("#pp-l3", 48.6, { y: 6 });
        pop("#pp-zero", 48.88, { from: 1.5, e: "power3.out" });
        tl.to("#pp-all", { opacity: 0, duration: 0.3 }, 50.05);
        tl.set([...R1, ...R2, "#pp-l1a", "#pp-l3", "#pp-zero"], { opacity: 0 }, 50.5);
        // appearance 2: ten viewing — do they get it?
        tl.to("#pp-all", { opacity: 1, duration: 0.3 }, 98.6);
        blurIn(["#pp-l1b", "#pp-l2"], 98.7, { y: 6, st: 0.12 });
        pop(R1.slice(0, 5), 99.49, { st: 0.04 });
        pop(R1.slice(5), 99.97, { st: 0.04 });
        tl.to(R2, { opacity: 0.6, duration: 0.3, stagger: 0.03 }, 104.61);
        pop("#pp-q", 106.21, { from: 0.4 });
        tl.set("#pp-brace", { opacity: 1 }, 108.3); draw("#pp-brace", 108.37, 0.45, "power2.out");
        blurIn("#pp-work", 108.6, { y: 8 });
        tl.to("#pp-all", { opacity: 0, duration: 0.3 }, 109.35);

        // ---------------- paid ads: an amplifier ----------------
        const wave = (x0, x1, y, amp, cycles, noisy) => {
          let d = "", n = 120, seed = 7;
          const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
          for (let i = 0; i <= n; i++) {
            const u = i / n, x = x0 + (x1 - x0) * u;
            let v = Math.sin(u * cycles * Math.PI * 2);
            if (noisy) v = 0.35 * v + (rnd() * 2 - 1) * 0.9;
            const env = Math.min(1, u * 6, (1 - u) * 6);
            d += (i ? " L " : "M") + x.toFixed(1) + " " + (y - v * amp * env).toFixed(1);
          }
          return d;
        };
        document.getElementById("am-in1").setAttribute("d", wave(110, 384, 430, 18, 3, false));
        document.getElementById("am-in2").setAttribute("d", wave(110, 384, 430, 20, 3, true));
        document.getElementById("am-out1").setAttribute("d", wave(676, 1000, 430, 78, 2.5, false));
        document.getElementById("am-out2").setAttribute("d", wave(676, 1000, 430, 86, 2.5, true));
        gsap.set(["#am-all", "#am-k", "#am-org", "#am-lab", "#am-inL1", "#am-inL2", "#am-outL", "#am-res", "#am-q", "#am-in2", "#am-out2", "#am-inl", "#am-outl"], { opacity: 0 });
        tl.to("#am-all", { opacity: 1, duration: 0.2 }, 54.75);
        blurIn("#am-k", 54.8, { y: 6 });
        draw("#am-tri", 57.12, 0.5, "power2.out");
        tl.to(["#am-inl", "#am-outl"], { opacity: 1, duration: 0.25 }, 57.4);
        blurIn("#am-lab", 57.44, { y: 6 });
        draw("#am-in1", 57.84, 0.6, "power1.inOut");
        blurIn("#am-inL1", 58.0, { y: 6 });
        draw("#am-out1", 61.76, 0.6, "power2.out");
        blurIn("#am-outL", 61.9, { y: 6 });
        blurIn("#am-res", 62.16, { y: 8 });
        pop("#am-q", 63.04, { from: 0.4 });
        // but: an untested offer, amplified, is just louder noise
        blurOut(["#am-res", "#am-k"], 63.6);
        tl.to(["#am-in1", "#am-inL1"], { opacity: 0, duration: 0.3 }, 65.3);
        tl.set("#am-in2", { opacity: 1 }, 65.4); draw("#am-in2", 65.41, 0.45, "none");
        blurIn("#am-inL2", 65.5, { y: 6 });
        tl.to("#am-out1", { opacity: 0, duration: 0.3 }, 66.3);
        tl.set("#am-out2", { opacity: 1 }, 66.45); draw("#am-out2", 66.45, 0.5, "none");
        blurIn("#am-org", 68.13, { y: 8 });
        tl.to("#am-all", { opacity: 0, duration: 0.3 }, 69.95);

        // ---------------- build order: offer is the foundation ----------------
        const floating = ["#st-4", "#st-3", "#st-2"], drops = [71.73, 74.13, 77.97];
        tl.fromTo("#st-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 70.6);
        blurIn("#st-k", 70.7, { y: 6 });
        floating.forEach((s, i) => {
          tl.fromTo(s, { opacity: 0, y: -46 }, { opacity: 0.85, y: 0, duration: 0.45, ease: "power3.out" }, drops[i]);
          const reps = Math.floor((82.3 - drops[i] - 0.45) / 0.9);
          tl.fromTo(s, { rotation: 0 }, { rotation: i % 2 ? -1.4 : 1.4, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: reps * 2 - 1 }, drops[i] + 0.45);
        });
        tl.fromTo("#st-1", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.42, ease: "back.out(1.6)" }, 82.37);
        tl.to(floating, { rotation: 0, opacity: 1, duration: 0.25, ease: "power3.out" }, 82.62);
        tl.to(floating, { y: 8, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", stagger: 0.03 }, 82.66);
        blurOut(["#st-k", "#st-4", "#st-3", "#st-2", "#st-1"], 83.15, { st: 0.02 });
        tl.to("#st-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.3 }, 83.15);

        // ---------------- leads or offer? ----------------
        gsap.set(["#as-all", "#as-k1", "#as-k2", "#as-L", "#as-or", "#as-R", "#as-Ry", "#as-conv", "#as-check"], { opacity: 0 });
        tl.to("#as-all", { opacity: 1, duration: 0.2 }, 89.3);
        blurIn("#as-k1", 89.41, { y: 6 });
        blurIn("#as-L", 91.65, { y: 10 });
        blurIn("#as-or", 93.09, { y: 6 });
        blurIn("#as-R", 93.57, { y: 10 });
        tl.set("#as-R", { opacity: 0 }, 94.21);
        pop("#as-Ry", 94.21, { from: 0.85 });
        tl.to("#as-L", { opacity: 0.4, duration: 0.3 }, 94.3);
        blurIn("#as-conv", 96.53, { y: 6 });
        tl.to("#as-all", { opacity: 0, duration: 0.3 }, 97.95);
        tl.set(["#as-k1", "#as-L", "#as-or", "#as-Ry", "#as-conv"], { opacity: 0 }, 98.4);
        // appearance 2: stop, reflect — which one should you work on?
        tl.to("#as-all", { opacity: 1, duration: 0.2 }, 119.15);
        blurIn("#as-k2", 119.17, { y: 6 });
        blurIn("#as-L", 120.93, { y: 10 });
        blurIn("#as-or", 123.01, { y: 6 });
        blurIn("#as-R", 123.65, { y: 10 });
        tl.set("#as-R", { opacity: 0 }, 125.16);
        pop("#as-Ry", 125.16, { from: 0.85 });
        tl.to("#as-L", { opacity: 0.4, duration: 0.3 }, 125.25);
        tl.set("#as-check", { opacity: 1 }, 125.55); draw("#as-check", 125.55, 0.3, "power2.out");
        blurOut(["#as-k2", "#as-L", "#as-or", "#as-Ry", "#as-check"], 127.1, { st: 0.02 });

        // ---------------- stop. reflect back. ----------------
        blurIn("#sp-l1 span", 116.37, { s: 1.18, y: 0, d: 0.4 });
        blurIn("#sp-l2", 116.93, { y: 10, d: 0.5 });
        blurOut(["#sp-l1 span", "#sp-l2"], 118.85, { st: 0.03 });

        // ---------------- have a clear offer (rack focus) ----------------
        wordsAt("#cl-l1 span", [127.56, 127.8]);
        tl.fromTo("#cl-l2 span", { opacity: 0, filter: "blur(28px)", scale: 1.06 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.75, ease: "power2.out" }, 127.88);
        blurOut(["#cl-l1 span", "#cl-l2 span"], 130.65, { st: 0.03 });

        // ---------------- CTA ----------------
        wordsAt("#cta-l1 span", [131.0, 131.48]);
        q(".key").forEach((k, i) => tl.fromTo(k, { opacity: 0, y: -50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)" }, 131.64 + i * 0.07));
        blurIn("#cta-s", 133.48, { y: 10 });
        blurIn("#cta-bs", 136.36, { y: 6 });

        // ---------------- depth: floats + ghost type ----------------
        float("#ey-all", 13.0, 28.4, 6); float("#am-all", 54.6, 70.3, 6);
        ghost("#gh1", 0.3, 6.5); ghost("#gh2", 32.4, 33.85); ghost("#gh3", 127.7, 130.95);

        // ---------------- captions (separate layer) ----------------
        const capsEl = document.getElementById("captions"), spans = [];
        (window.CAPS || []).forEach((c, ci, all) => {
          const next = all[ci + 1], start = c[0][0];
          let end = next ? Math.min(next[0][0], c[c.length - 1][1] + 0.5) : DUR;
          if (start < 6.5 && end > 6.5) end = 6.5;
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

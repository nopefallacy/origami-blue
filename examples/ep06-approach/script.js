      (function () {
        const tl = gsap.timeline({ paused: true });
        const DUR = 124.83;
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

        // ---------------- hook: not enough people on your 1:1 calls ----------------
        blurIn("#h-l1 span", 0.05, { st: 0.07, d: 0.38, y: 10 });
        blurIn("#h-l2 span", 0.45, { st: 0.16, d: 0.55, s: 1.12, y: 0 });
        draw("#h-swoosh", 6.4, 0.5);
        blurOut(["#h-l1 span", "#h-l2 span"], 8.8, { st: 0.03 });
        tl.to("#h-swoosh", { opacity: 0, duration: 0.25 }, 8.8);

        // ---------------- series tile ----------------
        tl.fromTo("#tile", { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 11.2);
        tl.fromTo("#t-num", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power4.out" }, 9.2);
        blurIn("#t-coach", 9.6, { y: 12 });
        tl.fromTo("#t-business", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.42, ease: "power4.out" }, 10.4);
        tl.fromTo("#t-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.inOut" }, 10.62);
        tl.fromTo("#t-series .txt", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 10.72);
        blurIn("#t-foot", 10.0, { y: 6 });

        // ---------------- ₹1 crore ----------------
        wordsAt("#cr-l1 span", [12.64, 12.8, 12.96, 13.2, 13.28, 13.44]);
        blurIn("#cr-l2 span", 13.6, { s: 1.14, y: 0, d: 0.5, st: 0.12 });
        blurIn("#cr-biz", 14.32, { y: 10 });
        blurOut(["#cr-l1 span", "#cr-l2 span", "#cr-biz"], 14.95, { st: 0.02 });

        // ---------------- your 1:1 calls: seven slots ----------------
        const sg = document.getElementById("sl-g"), slots = [], people = [];
        for (let i = 0; i < 7; i++) {
          const x = 312 + i * 92, y = 300;
          slots.push(el("rect", { x, y, width: 76, height: 76, rx: 14, fill: "rgba(18,17,19,0.3)", stroke: "#F5F3EE", "stroke-width": 3, opacity: 0 }, sg));
          const p = el("g", { opacity: 0 }, sg);
          el("circle", { cx: x + 38, cy: y + 28, r: 11, fill: "#5AA9E6", class: "slp" }, p);
          el("path", { d: `M${x + 18} ${y + 64} Q ${x + 38} ${y + 36} ${x + 58} ${y + 64}`, fill: "none", stroke: "#5AA9E6", "stroke-width": 5, "stroke-linecap": "round", class: "slq" }, p);
          people.push(p);
        }
        gsap.set(["#sl-all", "#sl-k", "#sl-p", "#sl-t", "#sl-e", "#sl-h"], { opacity: 0 });
        // appearance 1: personalized calls — but the slots stay empty
        tl.to("#sl-all", { opacity: 1, duration: 0.2 }, 20.64);
        tl.fromTo("#sl-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "power3.inOut" }, 21.4);
        blurIn("#sl-k", 21.52, { y: 6 });
        pop(slots, 22.56, { st: 0.07, from: 0.7 });
        blurIn("#sl-p", 24.96, { y: 8 });
        blurIn("#sl-t", 29.36, { y: 6 });
        blurOut(["#sl-p", "#sl-t"], 32.4);
        pop(people[0], 34.56, { from: 0.5 });
        tl.to(slots.slice(1), { attr: { stroke: "#5AA9E6" }, duration: 0.2, stagger: 0.05 }, 37.84);
        tl.to(slots.slice(1), { attr: { stroke: "#F5F3EE" }, duration: 0.4, stagger: 0.05 }, 38.3);
        blurIn("#sl-e", 38.4, { y: 8 });
        tl.to("#sl-all", { opacity: 0, duration: 0.3 }, 40.2);
        tl.set([people[0], "#sl-e"], { opacity: 0 }, 40.6);
        // appearance 2 (payoff): every slot fills — a higher transformation
        tl.to("#sl-all", { opacity: 1, duration: 0.3 }, 113.95);
        pop(people, 114.41, { st: 0.09, from: 0.5 });
        tl.to(q(".slp"), { attr: { fill: "#FED100" }, duration: 0.3, stagger: 0.04 }, 115.93);
        tl.to(q(".slq"), { attr: { stroke: "#FED100" }, duration: 0.3, stagger: 0.04 }, 115.93);
        blurIn("#sl-h", 116.33, { y: 8 });
        tl.to("#sl-all", { opacity: 0, duration: 0.3 }, 117.3);

        // ---------------- they don't understand your approach ----------------
        wordsAt("#ap-l1 span", [45.2, 45.44, 46.32]);
        blurIn("#ap-l2", 47.44, { s: 1.06, y: 0, d: 0.5 });
        blurOut(["#ap-l1 span", "#ap-l2"], 49.65, { st: 0.02 });

        // ---------------- they ask (questions → ticks) ----------------
        gsap.set(["#qu-all", "#qu-k1", "#qu-k2", "#qu-r1", "#qu-r2", "#qu-q1", "#qu-q2", "#qu-c1", "#qu-c2", "#qu-y"], { opacity: 0 });
        tl.to("#qu-all", { opacity: 1, duration: 0.2 }, 55.1);
        tl.fromTo("#qu-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 55.15);
        blurIn("#qu-k1", 55.28, { y: 6 });
        blurIn("#qu-r1", 58.08, { y: 10 });
        pop("#qu-q1", 58.6, { from: 0.4 });
        blurIn("#qu-r2", 61.69, { y: 10 });
        pop("#qu-q2", 62.3, { from: 0.4 });
        tl.to("#qu-all", { opacity: 0, duration: 0.3 }, 64.15);
        tl.set(["#qu-k1", "#qu-q1", "#qu-q2"], { opacity: 0 }, 64.6);
        tl.to("#qu-all", { opacity: 1, duration: 0.3 }, 108.0);
        blurIn("#qu-k2", 108.1, { y: 6 });
        tl.set(["#qu-c1", "#qu-c2"], { opacity: 1 }, 108.5);
        draw("#qu-c1", 108.57, 0.3, "power2.out");
        draw("#qu-c2", 108.85, 0.3, "power2.out");
        blurIn("#qu-y", 109.05, { y: 8 });
        tl.to("#qu-all", { opacity: 0, duration: 0.3 }, 113.5);

        // ---------------- the example ----------------
        tl.fromTo("#eg-rule", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.inOut" }, 64.75);
        blurIn("#eg-k1", 65.05, { y: 6 });
        blurIn("#eg-r1", 66.57, { y: 10 });
        blurIn("#eg-k2", 69.13, { y: 6 });
        blurIn("#eg-r2", 70.41, { y: 10 });
        blurOut(["#eg-k1", "#eg-r1", "#eg-k2", "#eg-r2"], 74.4, { st: 0.02 });
        tl.to("#eg-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.3 }, 74.4);

        // ---------------- B-roll: three roads ----------------
        tl.fromTo("#rd-page", { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "power4.inOut" }, 74.75);
        blurIn("#rd-root", 75.0, { y: 10 });
        blurIn("#rd-k", 75.15, { y: 6 });
        [["#rd-1", "#rd-l1", "#rd-d1", 75.61], ["#rd-2", "#rd-l2", "#rd-d2", 77.37], ["#rd-3", "#rd-l3", "#rd-d3", 78.81]].forEach(([r, l, d, t]) => {
          draw(r, t, 0.55, "power2.out");
          pop(d, t + 0.45, { from: 0.3 });
          blurIn(l, t + 0.3, { y: 8 });
        });
        blurIn("#rd-y", 80.81, { y: 10, d: 0.5 });
        tl.to("#rd-page", { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 81.8);

        // ---------------- the domino chain ----------------
        gsap.set(["#dm-all", "#dm-k", "#dm-s", "#dm-l1", "#dm-l2", "#dm-l3"], { opacity: 0 });
        tl.to("#dm-all", { opacity: 1, duration: 0.2 }, 84.85);
        blurIn("#dm-k", 85.05, { y: 6 });
        tl.fromTo(["#dm-1", "#dm-2", "#dm-3"], { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 85.2);
        blurIn(["#dm-l1", "#dm-l2", "#dm-l3"], 85.35, { y: 6, st: 0.1 });
        // approach tips onto the offer
        tl.to("#dm-1", { rotation: 23, svgOrigin: "355 560", duration: 0.4, ease: "power2.in" }, 86.49);
        // the offer goes unclear and tips onto the right people
        tl.to("#dm-2", { rotation: 23, svgOrigin: "535 560", duration: 0.4, ease: "power2.in" }, 88.01);
        tl.to("#dm-1", { rotation: 44, svgOrigin: "355 560", duration: 0.4, ease: "power2.in" }, 88.01);
        tl.to("#dm-l2", { color: "#FED100", duration: 0.3 }, 88.01);
        tl.to("#dm-2f", { attr: { opacity: 0.45 }, duration: 0.3 }, 88.1);
        // the right people fall away
        tl.to("#dm-3", { rotation: 90, svgOrigin: "715 560", duration: 0.65, ease: "bounce.out" }, 92.41);
        tl.to("#dm-2", { rotation: 52, svgOrigin: "535 560", duration: 0.5, ease: "power2.in" }, 92.45);
        tl.to("#dm-1", { rotation: 64, svgOrigin: "355 560", duration: 0.5, ease: "power2.in" }, 92.5);
        tl.to("#dm-l3", { opacity: 0.3, duration: 0.4 }, 92.8);
        blurOut("#dm-k", 97.4);
        blurIn("#dm-s", 97.77, { y: 8 });
        tl.to("#dm-all", { opacity: 0, duration: 0.3 }, 98.75);

        // ---------------- make both clear ----------------
        blurIn("#ch-k", 103.05, { y: 6 });
        pop("#ch-a", 104.57, { from: 0.8 });
        draw("#ch-ar", 105.37, 0.3, "power2.out");
        pop("#ch-o", 106.09, { from: 0.8 });
        blurOut(["#ch-k", "#ch-a", "#ch-ar", "#ch-o"], 107.7, { st: 0.02 });

        // ---------------- CTA ----------------
        wordsAt("#cta-l1 span", [118.98, 119.62]);
        q(".key").forEach((k, i) => tl.fromTo(k, { opacity: 0, y: -50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)" }, 119.78 + i * 0.07));
        blurIn("#cta-s", 121.22, { y: 10 });

        // ---------------- depth: floats + ghost type ----------------
        float("#sl-all", 20.5, 117.6, 6); float("#dm-all", 84.7, 99.0, 6);
        ghost("#gh1", 0.3, 9.1); ghost("#gh2", 45.2, 50.0); ghost("#gh3", 117.9, 124.83);

        // ---------------- captions (separate layer) ----------------
        const capsEl = document.getElementById("captions"), spans = [];
        (window.CAPS || []).forEach((c, ci, all) => {
          const next = all[ci + 1], start = c[0][0];
          let end = next ? Math.min(next[0][0], c[c.length - 1][1] + 0.5) : DUR;
          if (start < 9.1 && end > 9.1) end = 9.1;
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

      (function () {
        const tl = gsap.timeline({ paused: true });
        const DUR = 137.47; // = root duration
        const NS = "http://www.w3.org/2000/svg";
        // ---------- motion vocabulary (keep these exact helpers; they define the house motion) ----------
        const blurIn = (sel, t, o = {}) =>
          tl.fromTo(sel, { opacity: 0, filter: "blur(16px)", y: o.y === undefined ? 18 : o.y, scale: o.s || 1 },
            { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, duration: o.d || 0.42, ease: o.e || "power3.out", stagger: o.st || 0 }, t);
        const blurOut = (sel, t, o = {}) =>
          tl.to(sel, { opacity: 0, filter: "blur(14px)", y: o.y === undefined ? -16 : o.y, duration: o.d || 0.32, ease: "power2.in", stagger: o.st || 0 }, t);
        const draw = (sel, t, d, ease) =>
          tl.fromTo(sel, { strokeDasharray: 1600, strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: d, ease: ease || "power2.inOut" }, t);
        // assemble.py injects fx.js right here (line boil 8 fps, float(), ghost()) — keep this marker line intact:
        const q = (s) => Array.from(document.querySelectorAll(s));
        const wordsAt = (sel, times) => q(sel).forEach((el, i) => blurIn(el, times[i], { y: 10, d: 0.32 }));
        const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };
        // pop-in: element must start hidden (immediateRender:false would otherwise show it from clip start)
        const pop = (sel, t, o = {}) => { gsap.set(sel, { opacity: 0 }); return tl.fromTo(sel, { opacity: 0, scale: o.from || 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: o.d || 0.34, ease: o.e || "back.out(2.2)", stagger: o.st || 0, immediateRender: false }, t); };

        // ---------------- hook (on screen from frame 1) ----------------
        blurIn("#h-l1 span", 0.05, { st: 0.08, d: 0.38, y: 10 });
        blurIn("#h-l2 span", 0.45, { st: 0.16, d: 0.55, s: 1.12, y: 0 });
        draw("#h-swoosh", 5.44, 0.5);                      // paints on the spoken key word
        blurOut(["#h-l1 span", "#h-l2 span"], 6.2, { st: 0.03 });
        tl.to("#h-swoosh", { opacity: 0, duration: 0.25 }, 6.2);

        // ---------------- series tile (times = "Welcome" / "Coach" / "Business" / "Series" words) ----------------
        tl.fromTo("#tile", { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 8.9);
        tl.fromTo("#t-num", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power4.out" }, 6.6);
        blurIn("#t-coach", 7.2, { y: 12 });
        tl.fromTo("#t-business", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.42, ease: "power4.out" }, 8.0);
        tl.fromTo("#t-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.inOut" }, 8.2);
        tl.fromTo("#t-series .txt", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 8.3);
        blurIn("#t-foot", 7.6, { y: 6 });

        // ---------------- ₹1 crore line (each word on its spoken word) ----------------
        wordsAt("#cr-l1 span", [9.44, 9.6, 9.76, 9.92, 10.08, 10.24]);
        blurIn("#cr-l2 span", 10.32, { s: 1.14, y: 0, d: 0.5, st: 0.12 });
        blurIn("#cr-biz", 10.96, { y: 10 });
        blurOut(["#cr-l1 span", "#cr-l2 span", "#cr-biz"], 11.45, { st: 0.02 });

        // ---------------- BEATS ----------------
        // one block per beat: entrances on the spoken word, one yellow hero moment, exit before the next beat.

        // ---------------- CTA ----------------
        wordsAt("#cta-l1 span", [131.0, 131.48]);
        q(".key").forEach((k, i) => tl.fromTo(k, { opacity: 0, y: -50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)" }, 131.64 + i * 0.07));
        blurIn("#cta-s", 133.48, { y: 10 });

        // ---------------- depth: floats + ghost type ----------------
        // float("#dg-all", 13.0, 28.4, 6);
        ghost("#gh1", 0.3, 6.5);

        // ---------------- captions (separate layer; words keyed by assemble.py) ----------------
        const capsEl = document.getElementById("captions"), spans = [];
        (window.CAPS || []).forEach((c, ci, all) => {
          const next = all[ci + 1], start = c[0][0];
          let end = next ? Math.min(next[0][0], c[c.length - 1][1] + 0.5) : DUR;
          if (start < 6.5 && end > 6.5) end = 6.5;          // = tile start
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
        // if a full-page cutaway puts its own headline where captions live, hold captions for that beat:
        // tl.set("#captions", { opacity: 0 }, 57.98); tl.set("#captions", { opacity: 1 }, 58.62);

        // ---------------- grain ----------------
        const g = { f: 0 }, grainEl = document.getElementById("grain");
        tl.fromTo(g, { f: 0 }, { f: DUR * 12, duration: DUR, ease: "none", onUpdate: () => {
          const n = Math.floor(g.f); grainEl.style.backgroundPosition = ((n * 137) % 384) + "px " + ((n * 211) % 384) + "px"; } }, 0);

        window.__timelines["main"] = tl;
      })();

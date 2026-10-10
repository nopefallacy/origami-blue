      (function () {
        const tl = gsap.timeline({ paused: true });
        const DUR = 80.2;
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

        // ---------------- hook ----------------
        blurIn("#h-l1 span", 0.0, { st: 0.08, d: 0.38, y: 10 });
        blurIn("#h-l2 span", 0.4, { d: 0.6, s: 1.1, y: 0 });
        draw("#h-swoosh", 2.88, 0.5);
        blurOut(["#h-l1 span", "#h-l2 span"], 4.1, { st: 0.03 });
        tl.to("#h-swoosh", { opacity: 0, duration: 0.25 }, 4.1);

        // ---------------- price slider ----------------
        const K = { x: 230 };
        const knob = document.getElementById("sl-knob"), fill = document.getElementById("sl-fill"), gap = document.getElementById("sl-gap"), you = document.getElementById("sl-you");
        const placeK = () => {
          knob.setAttribute("transform", `translate(${K.x} 440)`);
          fill.setAttribute("x2", K.x);
          gap.setAttribute("d", `M${K.x} 398 L 860 398`);
          you.style.left = (K.x - 100) + "px";
        };
        placeK();
        const slide = (to, t, d, ease) => tl.to(K, { x: to, duration: d, ease: ease || "power3.inOut", onUpdate: placeK }, t);
        gsap.set(["#sl-all", "#sl-gap", "#sl-gapl", "#sl-msg1", "#sl-msg2", "#sl-msg3", "#sl-wl", "#sl-worth"], { opacity: 0 });
        // appearance 1: stuck low, far from what you're worth
        tl.to("#sl-all", { opacity: 1, duration: 0.35 }, 4.32);
        tl.fromTo(K, { x: 140 }, { x: 230, duration: 0.6, ease: "power3.out", onUpdate: placeK, immediateRender: false }, 4.4);
        tl.to(["#sl-worth", "#sl-wl"], { opacity: 1, duration: 0.4 }, 5.2);
        tl.to(["#sl-gap", "#sl-gapl"], { opacity: 1, duration: 0.35 }, 5.76);
        blurIn("#sl-msg1", 6.24, { y: 8 });
        tl.to(["#sl-all"], { opacity: 0, duration: 0.3 }, 7.2);
        tl.to(["#sl-msg1"], { opacity: 0, duration: 0.3 }, 7.2);
        // appearance 2: a small price -> you undersold yourself
        tl.set(K, { x: 520, onUpdate: placeK }, 21.3);
        tl.set(["#sl-gap", "#sl-gapl"], { opacity: 0 }, 21.3);
        tl.to("#sl-all", { opacity: 1, duration: 0.4 }, 21.44);
        slide(230, 24.8, 0.7, "power3.inOut");
        tl.to(["#sl-gap", "#sl-gapl"], { opacity: 1, duration: 0.35 }, 25.4);
        blurIn("#sl-msg2", 27.2, { y: 8 });
        tl.to(["#sl-all", "#sl-msg2"], { opacity: 0, duration: 0.3 }, 28.3);
        // appearance 3: belief -> confident high-ticket price
        tl.set(["#sl-gap", "#sl-gapl"], { opacity: 1 }, 51.0);
        tl.to("#sl-all", { opacity: 1, duration: 0.35 }, 51.2);
        slide(900, 51.44, 0.85, "power3.inOut");
        tl.to(["#sl-gap", "#sl-gapl"], { opacity: 0, duration: 0.3 }, 51.7);
        tl.to(["#sl-worth", "#sl-wl"], { opacity: 0, duration: 0.3 }, 51.75);
        tl.to("#sl-high", { scale: 1.2, transformOrigin: "100% 50%", duration: 0.15, ease: "power2.out" }, 52.24);
        tl.to("#sl-high", { scale: 1, duration: 0.3, ease: "power2.inOut" }, 52.39);
        blurIn("#sl-msg3", 52.3, { y: 8 });
        tl.to(["#sl-all", "#sl-msg3"], { opacity: 0, duration: 0.3 }, 52.95);

        // ---------------- life wheel ----------------
        const svg = document.getElementById("wh-svg");
        const CX = 540, CY = 430, R0 = 70, R1 = 140;
        const AREAS = ["health", "wealth", "career", "relationships", "confidence", "peace"];
        const pt = (r, a) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
        const wedges = [], wedgesY = [], spokes = [];
        AREAS.forEach((name, i) => {
          const a0 = -Math.PI / 2 + i * Math.PI / 3, a1 = a0 + Math.PI / 3, ac = (a0 + a1) / 2;
          const [x0, y0] = pt(R1, a0), [x1, y1] = pt(R1, a1), [x2, y2] = pt(R0, a1), [x3, y3] = pt(R0, a0);
          const wd = `M${x0} ${y0} A ${R1} ${R1} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${R0} ${R0} 0 0 0 ${x3} ${y3} Z`;
          const gB = el("g", { opacity: 0 }, svg); el("path", { d: wd, fill: "rgba(90,169,230,0.16)" }, gB); el("path", { d: wd, fill: "url(#dots-b)" }, gB);
          const gY = el("g", { opacity: 0 }, svg); el("path", { d: wd, fill: "rgba(254,209,0,0.2)" }, gY); el("path", { d: wd, fill: "url(#dots-y)" }, gY);
          wedges.push(gB); wedgesY.push(gY);
          const [sx0, sy0] = pt(R0, a0), [sx1, sy1] = pt(R1, a0);
          spokes.push(el("line", { x1: sx0, y1: sy0, x2: sx1, y2: sy1, stroke: "rgba(245,243,238,0.55)", "stroke-width": 2.5 }, svg));
          // labels in two clean columns beside the wheel
          const right = Math.cos(ac) > 0;
          const ly = CY + 0.95 * R1 * Math.sin(ac);
          const lab = document.createElement("div");
          lab.className = "small-caps wh-lab"; lab.textContent = name;
          Object.assign(lab.style, { position: "absolute", top: (ly - 14) + "px", width: "260px", color: "#F5F3EE", textAlign: right ? "left" : "right",
            left: right ? (CX + R1 + 34) + "px" : (CX - R1 - 34 - 260) + "px" });
          document.getElementById("wh-labels").appendChild(lab);
        });
        const rim = el("circle", { cx: CX, cy: CY, r: R1, fill: "none", stroke: "#F5F3EE", "stroke-width": 3 }, svg);
        const hub = el("circle", { cx: CX, cy: CY, r: R0, fill: "#F5F3EE" }, svg);
        svg.appendChild(hub);
        const gw = document.createElementNS(NS, "g"); gw.setAttribute("filter", "url(#boil)");
        while (svg.firstChild) gw.appendChild(svg.firstChild);
        svg.appendChild(gw);
        gsap.set(["#wh-all", "#wh-h2"], { opacity: 0 });
        gsap.set(".wh-lab", { opacity: 0 });
        // appearance 1: their life, area by area
        tl.to("#wh-all", { opacity: 1, duration: 0.3 }, 16.0);
        tl.fromTo(hub, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 16.24);
        draw(rim, 16.4, 0.7, "power2.inOut");
        tl.fromTo(spokes, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 16.8);
        tl.to(wedges, { opacity: 1, duration: 0.25, stagger: 0.12 }, 19.92);
        tl.to(".wh-lab", { opacity: 1, duration: 0.3, stagger: 0.08 }, 20.4);
        tl.to("#wh-all", { opacity: 0, duration: 0.35 }, 21.1);
        // appearance 2: absolute clarity across all aspects of life
        tl.set(wedges, { opacity: 0 }, 21.5);
        tl.set("#wh-h1", { opacity: 0 }, 59.0);
        tl.set("#wh-h2", { opacity: 1 }, 59.0);
        tl.to("#wh-all", { opacity: 1, duration: 0.4 }, 60.19);
        tl.to(hub, { attr: { fill: "#FED100" }, duration: 0.3 }, 64.03);
        tl.to(wedgesY, { opacity: 1, duration: 0.3, stagger: 0.1 }, 66.75);
        tl.to(rim, { attr: { stroke: "#FED100" }, duration: 0.3 }, 67.4);
        tl.to("#wh-all", { opacity: 0, duration: 0.35 }, 70.6);

        // ---------------- belief gauge ----------------
        const ticks = document.getElementById("ga-ticks");
        for (let i = 0; i <= 10; i++) {
          const a = Math.PI + (i / 10) * Math.PI;
          el("line", { x1: 540 + 186 * Math.cos(a), y1: 530 + 186 * Math.sin(a), x2: 540 + 168 * Math.cos(a), y2: 530 + 168 * Math.sin(a) }, ticks);
        }
        const N = { a: -68 };
        const needle = document.getElementById("ga-needle");
        const placeN = () => needle.setAttribute("transform", `translate(540 530) rotate(${N.a})`);
        placeN();
        draw("#ga-arc", 34.8, 0.7, "power2.out");
        draw("#ga-hi", 35.3, 0.4, "power2.out");
        tl.fromTo(["#ga-ticks", "#ga-needle"], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 35.04);
        blurIn("#ga-l", 35.04, { y: 8 });
        blurIn(["#ga-lo", "#ga-hiL"], 35.5, { y: 6, st: 0.1 });
        tl.to(N, { a: -60, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3, onUpdate: placeN }, 36.0);
        tl.to(N, { a: -30, duration: 4.5, ease: "sine.inOut", onUpdate: placeN }, 41.52);
        tl.to(N, { a: 62, duration: 0.9, ease: "back.out(1.4)", onUpdate: placeN }, 46.88);
        blurIn("#ga-conf", 50.8, { y: 8 });
        blurOut(["#ga-arc", "#ga-hi", "#ga-ticks", "#ga-needle", "#ga-l", "#ga-lo", "#ga-hiL", "#ga-conf"], 51.05, { st: 0.01 });

        // ---------------- series tile ----------------
        tl.fromTo("#tile", { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 9.62);
        tl.fromTo("#t-num", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power4.out" }, 7.58);
        blurIn("#t-coach", 8.08, { y: 12 });
        tl.fromTo("#t-business", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.42, ease: "power4.out" }, 8.96);
        tl.fromTo("#t-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.inOut" }, 9.2);
        tl.fromTo("#t-series .txt", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 9.28);
        blurIn("#t-foot", 8.6, { y: 6 });

        // ---------------- ₹1 crore ----------------
        wordsAt("#cr-l1 span", [10.4, 10.56, 10.64, 10.88, 10.96, 11.12]);
        blurIn("#cr-l2 span", 11.2, { s: 1.14, y: 0, d: 0.5, st: 0.12 });
        blurIn("#cr-biz", 11.92, { y: 10 });
        blurOut(["#cr-l1 span", "#cr-l2 span", "#cr-biz"], 12.25, { st: 0.02 });

        // ---------------- your expertise is enough ----------------
        wordsAt("#en-l1 span", [30.56, 30.88, 33.44]);
        blurIn("#en-l2 span", 33.68, { s: 1.14, y: 0, d: 0.5 });
        blurOut(["#en-l1 span", "#en-l2 span"], 34.3, { st: 0.02 });

        // ---------------- B-roll: income curve ----------------
        tl.fromTo("#in-page", { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "power4.inOut" }, 53.05);
        draw("#in-axes", 53.5, 0.6, "power2.out");
        blurIn(["#in-x", "#in-y", "#in-k"], 53.7, { y: 6, st: 0.05 });
        draw("#in-dream", 55.2, 0.5, "power2.out");
        blurIn("#in-dl", 55.5, { y: 6 });
        draw("#in-slow", 55.9, 1.8, "power1.inOut");
        blurIn("#in-sl", 57.0, { y: 6 });
        draw("#in-fast", 56.6, 1.2, "power2.in");
        blurIn("#in-fl", 57.2, { y: 6 });
        tl.fromTo("#in-hit", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" }, 57.75);
        tl.to("#in-area", { opacity: 0.55, duration: 0.5, ease: "power2.out" }, 57.6);
        blurIn("#in-big", 58.03, { s: 1.06, y: 0 });
        tl.to("#in-page", { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 58.6);

        // ---------------- CTA ----------------
        wordsAt("#cta-l1 span", [74.27, 74.42, 74.58]);
        q(".key").forEach((k, i) => tl.fromTo(k, { opacity: 0, y: -50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)" }, 74.75 + i * 0.07));
        blurIn("#cta-s", 76.35, { y: 10 });


        // ---------------- depth: floats + ghost type ----------------
        float("#sl-all", 4.3, 53.3, 6); float("#wh-all", 16.0, 70.9, 6); float("#ga-all", 34.7, 51.4, 6);
        ghost("#gh1", 0.25, 4.4); ghost("#gh2", 30.6, 34.5); ghost("#gh3", 74.1, 80.2);

        // ---------------- captions ----------------
        const capsEl = document.getElementById("captions"), spans = [];
        (window.CAPS || []).forEach((c, ci, all) => {
          const next = all[ci + 1], start = c[0][0];
          let end = next ? Math.min(next[0][0], c[c.length - 1][1] + 0.5) : DUR;
          if (start < 7.5 && end > 7.5) end = 7.5;
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

        // the income page's own headline sits where captions live: hold subtitles for that beat
        tl.set("#captions", { opacity: 0 }, 57.98); tl.set("#captions", { opacity: 1 }, 58.62);

        const g = { f: 0 }, grainEl = document.getElementById("grain");
        tl.fromTo(g, { f: 0 }, { f: DUR * 12, duration: DUR, ease: "none", onUpdate: () => {
          const n = Math.floor(g.f); grainEl.style.backgroundPosition = ((n * 137) % 384) + "px " + ((n * 211) % 384) + "px"; } }, 0);

        window.__timelines["main"] = tl;
      })();

        // ---------------- handmade line boil: noise re-seeds at 8 fps (classic drawn-animation shimmer) ----------------
        (function () {
          const tb = document.getElementById("boil-t"), tr = document.getElementById("brush-t"), B = { f: 0 };
          tl.fromTo(B, { f: 0 }, { f: DUR * 8, duration: DUR, ease: "none", onUpdate: () => {
            const n = Math.floor(B.f); tb.setAttribute("seed", 1 + (n % 9)); tr.setAttribute("seed", 3 + ((n * 7) % 11)); } }, 0);
        })();
        // slow parallax float for diagrams that live behind the subject
        const float = (sel, t0, t1, amp) => { const n = Math.max(1, Math.floor((t1 - t0) / 2.8)); tl.fromTo(sel, { y: 0 }, { y: -(amp || 7), duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, t0); };
        // ghost words: printed halftone type the subject stands in front of
        const ghost = (sel, t0, t1) => {
          tl.fromTo(sel, { opacity: 0, scale: 1.12, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, t0);
          tl.to(sel, { scale: 1.035, duration: Math.max(0.5, t1 - t0 - 1.0), ease: "none" }, t0 + 0.7);
          tl.to(sel, { opacity: 0, duration: 0.3, ease: "power2.in" }, t1 - 0.3);
        };

(function() {
    function n(e, t, n) {
        const s = e.getAttribute(t);
        if (!s)
            return n;
        try {
            return JSON.parse(s)
        } catch {
            return n
        }
    }
    function e(e, t) {
        const n = document.createElementNS("http://www.w3.org/2000/svg", e);
        for (const e in t)
            t[e] != null && n.setAttribute(e, t[e]);
        return n
    }
    function s(e) {
        const s = [];
        let t = ""
          , n = !1;
        for (let o = 0; o < e.length; o++) {
            const i = e[o];
            i === '"' ? n && e[o + 1] === '"' ? (t += '"',
            o++) : n = !n : i === "," && !n ? (s.push(t),
            t = "") : t += i
        }
        return s.push(t),
        s.map(e => e.trim().replace(/^"|"$/g, ""))
    }
    function t(e, t, n, s) {
        const o = s.left + (e - n.x.min) * n.x.k
          , i = s.top + n.innerH - (t - n.y.min) * n.y.k;
        return [o, i]
    }
    function r(e, n, s) {
        return e.map( (e, o) => {
            const [i,a] = t(e[0], e[1], n, s);
            return (o === 0 ? "M" : "L") + i + " " + a
        }
        ).join(" ")
    }
    function c(e, n, s, o) {
        let i = 0
          , a = 1 / 0;
        for (let r = 0; r < e.length; r++) {
            const [l] = t(e[r][0], e[r][1], s, o)
              , c = Math.abs(l - n);
            c < a && (a = c,
            i = r)
        }
        return i
    }
    function u(e) {
        const t = (e < 0 ? -e : e) >= 1e3 ? (e / 1e3).toFixed(0) + "k" : String(e);
        return t
    }
    function o(e) {
        if (!Number.isFinite(e))
            return String(e);
        const t = e < 0 ? -e : e
          , n = t >= 1 ? e.toFixed(4) : e.toPrecision(4);
        return n.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "")
    }
    function l(e) {
        return Number.isInteger(e) ? String(e) : o(e)
    }
    async function i(i) {
        let y = n(i, "data-series", []);
        const h = n(i, "data-x", {})
          , g = n(i, "data-y", {})
          , d = n(i, "data-y2", null)
          , O = n(i, "data-refline", null)
          , E = n(i, "data-labels", null)
          , ye = i.getAttribute("data-show-points")
          , G = ye !== "false"
          , R = i.getAttribute("data-smooth");
        let w = null;
        if (R)
            try {
                const e = JSON.parse(R);
                w = e
            } catch {
                const e = Number(R);
                Number.isFinite(e) && e > 1 && (w = e)
            }
        const X = i.getAttribute("data-src")
          , Z = i.getAttribute("data-srcs")
          , j = n(i, "data-seriesmeta", {})
          , A = [];
        if (Z)
            try {
                const e = JSON.parse(Z);
                Array.isArray(e) && A.push(...e)
            } catch {}
        if (X && A.push(X),
        A.length)
            try {
                const t = await Promise.all(A.map(e => fetch(e, {
                    cache: "no-store"
                }).then(e => e.text())))
                  , e = [];
                for (let n = 0; n < A.length; n++) {
                    const i = A[n]
                      , o = t[n]
                      , a = /\.csv(\?|$)/i.test(i) || /,/.test(o.slice(0, 200));
                    if (a) {
                        {
                            const t = o.split(/\r?\n/).filter(e => e && !/^\s*$/.test(e));
                            if (t.length > 1) {
                                const o = s(t[0])
                                  , i = o.findIndex(e => e.trim().toLowerCase() === "step")
                                  , n = [];
                                for (let e = 0; e < o.length; e++) {
                                    const t = o[e].trim();
                                    if (/__MIN|__MAX/i.test(t))
                                        continue;
                                    let s = null;
                                    / - mean_reward$/i.test(t) && (s = "reward"),
                                    / - kl_?learner_?sampler:mean$/i.test(t) && (s = "kl"),
                                    s && n.push({
                                        idx: e,
                                        header: t,
                                        kind: s
                                    })
                                }
                                const a = j && Array.isArray(j.names) ? j.names : null
                                  , r = j && Array.isArray(j.colors) ? j.colors : null
                                  , c = n.map( (e, t) => {
                                    const n = e.header.replace(/\s*-\s*mean_reward$/i, "").replace(/\s*-\s*kl_?learner_?sampler:mean$/i, "")
                                      , s = a ? a[t] || n : n
                                      , o = r ? r[t] || null : null;
                                    return {
                                        name: s,
                                        color: o,
                                        axis: e.kind === "kl" && d ? "y2" : "y",
                                        points: []
                                    }
                                }
                                );
                                for (let e = 1; e < t.length; e++) {
                                    const o = s(t[e])
                                      , r = i >= 0 ? o[i] : o[0]
                                      , a = Number(r);
                                    if (!Number.isFinite(a))
                                        continue;
                                    for (let e = 0; e < n.length; e++) {
                                        const t = Number(o[n[e].idx]);
                                        Number.isFinite(t) && c[e].points.push([a, t])
                                    }
                                }
                                c.forEach(t => {
                                    t.points.length && e.push(t)
                                }
                                )
                            }
                        }
                    } else {
                        const a = o.split(/\n|\r/).filter(e => e && !/^\s*$/.test(e))
                          , s = []
                          , i = [];
                        for (const r of a) {
                            const e = r.trim().split(/\s+/);
                            if (e.length < 3)
                                continue;
                            const t = Number(e[0])
                              , n = Number(e[1])
                              , o = Number(e[2]);
                            Number.isFinite(t) && Number.isFinite(n) && s.push([t, n]),
                            Number.isFinite(t) && Number.isFinite(o) && i.push([t, o])
                        }
                        const t = j && Array.isArray(j.names) ? j.names : null
                          , n = j && Array.isArray(j.colors) ? j.colors : null
                          , r = t && t[0] ? t[0] : "Series 1"
                          , c = t && t[1] ? t[1] : "Series 2"
                          , l = n && n[0] ? n[0] : null
                          , u = n && n[1] ? n[1] : null;
                        s.length && e.push({
                            name: r,
                            color: l,
                            axis: "y",
                            points: s
                        }),
                        i.length && e.push({
                            name: c,
                            color: u,
                            axis: d ? "y2" : "y",
                            points: i
                        })
                    }
                }
                y = e
            } catch (e) {
                console.error("chart-line: failed to fetch data", e)
            }
        const se = Math.max(320, Math.floor(i.clientWidth || 800))
          , re = 520 / 800
          , S = se
          , M = Math.round(se * re)
          , a = {
            top: 20,
            right: 24,
            bottom: 72,
            left: 72
        };
        d && (a.right = 96);
        const v = S - a.left - a.right
          , m = M - a.top - a.bottom
          , u = e("svg", {
            viewBox: `0 0 ${S} ${M}`,
            width: String(S),
            height: String(M),
            role: "img",
            preserveAspectRatio: "xMinYMin meet"
        });
        u.classList.add("chart-svg"),
        u.classList.add("chart-line");
        const ce = i.querySelector("figcaption")
          , ne = y.flatMap(e => e.points.map(e => e[0]))
          , I = y.filter(e => !e.axis || e.axis === "y").flatMap(e => e.points.map(e => e[1]))
          , H = y.filter(e => e.axis === "y2").flatMap(e => e.points.map(e => e[1]));
        O && typeof O.y == "number" && I.push(O.y);
        const ie = h.ticks && h.ticks.length ? Math.min(...h.ticks) : 1 / 0
          , fe = h.ticks && h.ticks.length ? Math.max(...h.ticks) : -(1 / 0)
          , ge = g.ticks && g.ticks.length ? Math.min(...g.ticks) : 1 / 0
          , ve = g.ticks && g.ticks.length ? Math.max(...g.ticks) : -(1 / 0)
          , Q = h.domain && h.domain[0] != null ? h.domain[0] : Math.min(ie, Math.min(...ne))
          , _ = h.domain && h.domain[1] != null ? h.domain[1] : Math.max(fe, Math.max(...ne))
          , be = h.padLeft != null ? h.padLeft : .04
          , Oe = h.padRight != null ? h.padRight : .1
          , W = _ - Q || 1
          , C = Q - W * Math.max(0, be)
          , U = _ + W * Math.max(0, Oe)
          , K = g.domain && g.domain[0] != null ? g.domain[0] : Math.min(ge, Math.min(...I))
          , D = g.domain && g.domain[1] != null ? g.domain[1] : Math.max(ve, Math.max(...I))
          , we = D - K || 1
          , je = g.padTop != null ? g.padTop : .06
          , z = K
          , N = D + we * Math.max(0, je)
          , p = {
            innerW: v,
            innerH: m,
            x: {
                min: C,
                max: U,
                k: v / (U - C || 1)
            },
            y: {
                min: z,
                max: N,
                k: m / (N - z || 1)
            }
        };
        let f = null
          , P = null;
        if (d && H.length) {
            const o = d.ticks && d.ticks.length ? Math.min(...d.ticks) : 1 / 0
              , i = d.ticks && d.ticks.length ? Math.max(...d.ticks) : -(1 / 0)
              , t = d.domain && d.domain[0] != null ? d.domain[0] : Math.min(o, Math.min(...H))
              , e = d.domain && d.domain[1] != null ? d.domain[1] : Math.max(i, Math.max(...H))
              , a = e - t || 1
              , r = d.padTop != null ? d.padTop : .06
              , n = t
              , s = e + a * Math.max(0, r);
            f = {
                min: n,
                max: s,
                k: m / (s - n || 1)
            },
            P = e
        }
        const L = f ? a.left + v : t(_, z, p, a)[0]
          , B = t(C, D, p, a)[1]
          , V = e("g", {
            class: "grid"
        })
          , b = e("g", {});
        u.appendChild(V),
        u.appendChild(b);
        const me = e("rect", {
            x: a.left,
            y: a.top,
            width: v,
            height: m,
            fill: "none"
        });
        u.appendChild(me);
        const ae = e("line", {
            x1: a.left,
            y1: B,
            x2: a.left,
            y2: a.top + m,
            class: "axis-line"
        })
          , oe = e("line", {
            x1: a.left,
            y1: a.top + m,
            x2: L,
            y2: a.top + m,
            class: "axis-line"
        });
        if (b.appendChild(ae),
        b.appendChild(oe),
        f && P != null) {
            const t = a.top + m - (P - f.min) * f.k
              , n = e("line", {
                x1: a.left + v,
                y1: t,
                x2: a.left + v,
                y2: a.top + m,
                class: "axis-line"
            });
            b.appendChild(n)
        }
        function $(e, t, n) {
            if (!e || !e.length)
                return e;
            const o = [];
            let s = null;
            for (const i of e) {
                const a = t(i);
                (s === null || Math.abs(a - s) >= n) && (o.push(i),
                s = a)
            }
            return o
        }
        const le = h.ticks || []
          , de = $(le, e => t(e, z, p, a)[0], Math.max(48, S / 14));
        if (de.forEach(n => {
            const [s] = t(n, z, p, a)
              , i = e("line", {
                x1: s,
                y1: B,
                x2: s,
                y2: a.top + m,
                class: "gridline"
            });
            V.appendChild(i);
            const r = e("line", {
                x1: s,
                y1: a.top + m,
                x2: s,
                y2: a.top + m - 6,
                class: "tick"
            });
            b.appendChild(r);
            const o = e("text", {
                x: s,
                y: a.top + m + 22,
                class: "axis-tick"
            });
            o.textContent = String(n),
            o.setAttribute("text-anchor", "middle"),
            b.appendChild(o)
        }
        ),
        h.label) {
            const t = e("text", {
                x: a.left + v / 2,
                y: a.top + m + 50,
                class: "axis-label"
            });
            t.textContent = h.label,
            t.setAttribute("text-anchor", "middle"),
            b.appendChild(t)
        }
        const ue = g.ticks || []
          , he = $(ue, e => t(C, e, p, a)[1], Math.max(32, M / 14));
        if (he.forEach(n => {
            const [,s] = t(C, n, p, a)
              , i = e("line", {
                x1: a.left,
                y1: s,
                x2: L,
                y2: s,
                class: "gridline"
            });
            V.appendChild(i);
            const r = e("line", {
                x1: a.left,
                y1: s,
                x2: a.left + 6,
                y2: s,
                class: "tick"
            });
            b.appendChild(r);
            const o = e("text", {
                x: a.left - 10,
                y: s + 4,
                class: "axis-tick"
            });
            o.textContent = String(n),
            o.setAttribute("text-anchor", "end"),
            b.appendChild(o)
        }
        ),
        g.label) {
            const n = 58
              , t = e("text", {
                x: a.left - n,
                y: a.top + m / 2,
                class: "axis-label"
            });
            t.textContent = g.label,
            t.setAttribute("text-anchor", "middle"),
            t.setAttribute("transform", `rotate(-90 ${a.left - n} ${a.top + m / 2})`),
            b.appendChild(t)
        }
        if (f) {
            const t = d.ticks || []
              , n = $(t, e => a.top + p.innerH - (e - f.min) * f.k, Math.max(32, M / 14));
            if (n.forEach(t => {
                const n = a.top + p.innerH - (t - f.min) * f.k
                  , o = e("line", {
                    x1: a.left + v - 6,
                    y1: n,
                    x2: a.left + v,
                    y2: n,
                    class: "tick"
                });
                b.appendChild(o);
                const s = e("text", {
                    x: a.left + v + 10,
                    y: n + 4,
                    class: "axis-tick"
                });
                s.textContent = String(t),
                s.setAttribute("text-anchor", "start"),
                b.appendChild(s)
            }
            ),
            d.label) {
                const o = 58
                  , n = a.left + v + o
                  , s = a.top + m / 2
                  , t = e("text", {
                    x: n,
                    y: s,
                    class: "axis-label"
                });
                t.textContent = d.label,
                t.setAttribute("text-anchor", "middle"),
                t.setAttribute("transform", `rotate(90 ${n} ${s})`),
                b.appendChild(t)
            }
        }
        if (O && typeof O.y == "number") {
            const r = Math.min(O.y, D)
              , [,i] = t(C, r, p, a)
              , l = e("line", {
                x1: a.left,
                y1: i,
                x2: L,
                y2: i,
                class: "refline"
            });
            u.appendChild(l);
            let s = a.left + v - 6
              , o = i - 8;
            const n = E && (E.ref || E.refline);
            if (n) {
                if (typeof n.px == "number" && typeof n.py == "number")
                    s = n.px,
                    o = n.py;
                else if (typeof n.x == "number") {
                    const e = t(n.x, typeof n.y == "number" ? n.y : r, p, a);
                    s = e[0],
                    o = e[1]
                }
                typeof n.dx == "number" && (s += n.dx),
                typeof n.dy == "number" && (o += n.dy)
            }
            const c = e("text", {
                x: s,
                y: o,
                class: "refline-label"
            });
            c.textContent = O.label || "Max clock speed (1410 MHz)",
            u.appendChild(c)
        }
        const te = e("g", {
            class: "series"
        })
          , ee = e("g", {
            class: "points"
        });
        u.appendChild(te),
        G && u.appendChild(ee);
        const pe = [];
        y.forEach( (n, s) => {
            let o = n.points;
            const i = typeof w == "number" ? w : w && Array.isArray(w) ? Number(w[s]) : null;
            if (Number.isFinite(i) && i > 1 && o.length > i) {
                const n = Math.floor(i / 2)
                  , e = o.map(e => e[1])
                  , t = new Array(e.length + 1).fill(0);
                for (let n = 0; n < e.length; n++)
                    t[n + 1] = t[n] + e[n];
                const s = o.map( (s, o) => {
                    const i = Math.max(0, o - n)
                      , a = Math.min(e.length, o + n + 1)
                      , r = (t[a] - t[i]) / (a - i);
                    return [s[0], r]
                }
                );
                o = s
            }
            const l = [];
            for (let e = 0; e < o.length; e++) {
                const [t,s] = o[e];
                if (t <= _) {
                    const e = n.axis === "y2" && f ? f.max : N
                      , o = Math.min(s, e);
                    l.push([t, o])
                } else {
                    if (e > 0) {
                        const [i,a] = o[e - 1]
                          , r = (_ - i) / (t - i)
                          , c = a + r * (s - a)
                          , d = n.axis === "y2" && f ? f.max : N;
                        l.push([_, Math.min(c, d)])
                    }
                    break
                }
            }
            const c = e("path", {
                d: r(l, {
                    ...p,
                    y: n.axis === "y2" && f ? f : p.y
                }, a),
                class: "line"
            });
            n.color && c.style.setProperty("--series-color", n.color),
            typeof n.lineWidth == "number" && c.style.setProperty("--line-width", String(n.lineWidth)),
            te.appendChild(c),
            pe.push(c),
            G && n.points.forEach(s => {
                const [i,r] = t(s[0], s[1], {
                    ...p,
                    y: n.axis === "y2" && f ? f : p.y
                }, a);
                if (s[0] > _)
                    return;
                const o = e("circle", {
                    cx: i,
                    cy: r,
                    r: 3,
                    class: "point"
                });
                n.color && o.style.setProperty("--series-color", n.color),
                ee.appendChild(o)
            }
            )
        }
        );
        const J = [];
        y.forEach( (n, s) => {
            if (!n.name || !n.points || n.points.length === 0)
                return;
            let h = 0;
            for (let e = 1; e < n.points.length; e++)
                n.points[e][0] > n.points[h][0] && (h = e);
            const m = n.points[h]
              , [_,y] = t(m[0], m[1], p, a)
              , r = e("rect", {
                class: "series-color-box",
                width: 12,
                height: 12,
                rx: 2,
                ry: 2
            });
            n.color && r.style.setProperty("--series-color", n.color),
            u.appendChild(r);
            const i = e("text", {
                class: "series-label"
            });
            i.textContent = n.name,
            n.color && i.style.setProperty("--series-color", n.color),
            u.appendChild(i);
            const o = E && (E[n.name] ?? E[s]);
            let l, c, d = !1;
            if (o)
                if (typeof o.px == "number" && typeof o.py == "number")
                    l = o.px,
                    c = o.py,
                    d = !0;
                else if (typeof o.x == "number" && typeof o.y == "number") {
                    const e = t(o.x, o.y, p, a);
                    l = e[0],
                    c = e[1],
                    d = !0
                }
            if (!d) {
                const e = f ? 40 : 4;
                l = Math.min(a.left + v - e, _ + 8),
                c = Math.max(a.top + 12, y - 14)
            }
            const g = o && typeof o.dx == "number" ? o.dx : 0
              , b = o && typeof o.dy == "number" ? o.dy : 0
              , w = l + g - 16
              , O = c + b - 10;
            r.setAttribute("x", w),
            r.setAttribute("y", O),
            i.setAttribute("x", l + g),
            i.setAttribute("y", c + b);
            const j = d || !!o && (typeof o.dx == "number" || typeof o.dy == "number");
            if (!j) {
                const e = i.getBBox();
                e.x + e.width > a.left + v && i.setAttribute("x", Math.max(a.left + v - e.width - 4, a.left + 4)),
                e.y < a.top && i.setAttribute("y", a.top + 12)
            }
            if (!j) {
                const t = i.getBBox()
                  , n = r.getBBox()
                  , e = {
                    x: Math.min(n.x, t.x),
                    y: Math.min(n.y, t.y),
                    width: Math.max(n.x + n.width, t.x + t.width) - Math.min(n.x, t.x),
                    height: Math.max(n.y + n.height, t.y + t.height) - Math.min(n.y, t.y)
                };
                for (const t of J) {
                    const n = !(e.x > t.x + t.width || e.x + e.width < t.x || e.y > t.y + t.height || e.y + e.height < t.y);
                    if (n) {
                        const t = e.y - 14
                          , n = t - e.y;
                        i.setAttribute("y", parseFloat(i.getAttribute("y")) + n),
                        r.setAttribute("y", parseFloat(r.getAttribute("y")) + n),
                        e.y = t
                    }
                }
                J.push(e)
            }
        }
        );
        const T = e("line", {
            x1: a.left,
            y1: B,
            x2: a.left,
            y2: a.top + m,
            class: "cursor-line"
        })
          , k = e("g", {
            class: "tooltip",
            visibility: "hidden"
        })
          , F = e("rect", {
            rx: 4,
            ry: 4,
            class: "tooltip-bg"
        })
          , x = e("text", {
            class: "tooltip-text"
        });
        k.appendChild(F),
        k.appendChild(x),
        u.appendChild(T),
        u.appendChild(k);
        function _e(n) {
            const u = Math.max(a.left, Math.min(L, n));
            let s = u
              , h = 1 / 0
              , r = null;
            for (const e of y) {
                if (!e.points || e.points.length === 0)
                    continue;
                for (const n of e.points) {
                    if (n[0] > _)
                        continue;
                    const [s] = t(n[0], n[1], p, a)
                      , o = Math.abs(s - u);
                    o < h && (h = o,
                    r = s)
                }
            }
            r != null && (s = r),
            T.setAttribute("x1", s),
            T.setAttribute("x2", s),
            T.style.opacity = "1",
            x.textContent = "",
            x.setAttribute("x", "0"),
            x.setAttribute("y", "0"),
            y.forEach( (t, n) => {
                if (!t.points || t.points.length === 0)
                    return;
                const d = c(t.points, s, p, a)
                  , i = t.points[d]
                  , u = `${t.name || ""}: ${o(i[1])} @ ${l(i[0])}`
                  , r = e("tspan", {
                    x: 0,
                    dy: n === 0 ? "0" : "1.2em"
                });
                r.textContent = u,
                x.appendChild(r)
            }
            );
            const i = x.getBBox();
            F.setAttribute("x", i.x - 6),
            F.setAttribute("y", i.y - 4),
            F.setAttribute("width", i.width + 12),
            F.setAttribute("height", i.height + 8);
            const m = 4
              , f = i.width + 12;
            let d = s + 8;
            d + f + m > S && (d = Math.max(a.left + m, s - f - 8)),
            k.setAttribute("transform", `translate(${d}, ${a.top + 12})`),
            k.setAttribute("visibility", "visible")
        }
        function Y() {
            T.style.opacity = "0",
            k.setAttribute("visibility", "hidden")
        }
        u.addEventListener("pointermove", e => {
            const n = u.createSVGPoint();
            n.x = e.clientX,
            n.y = e.clientY;
            const s = u.getScreenCTM();
            if (!s)
                return;
            const t = n.matrixTransform(s.inverse())
              , o = t.x >= a.left && t.x <= a.left + v && t.y >= a.top && t.y <= a.top + m;
            o ? (_e(t.x),
            u.style.cursor = "crosshair") : (Y(),
            u.style.cursor = "default")
        }
        ),
        u.addEventListener("pointerleave", () => {
            Y(),
            u.style.cursor = "default"
        }
        );
        const q = i.querySelector("svg");
        q && q.remove(),
        i.insertBefore(u, ce || null)
    }
    async function a(i) {
        const z = (i.getAttribute("data-legend-pane") || "bottom").toLowerCase()
          , q = (i.getAttribute("data-legend") || "top-left").toLowerCase()
          , Ie = Number(i.getAttribute("data-legend-gap") || 18)
          , H = 8
          , A = 12
          , m = n(i, "data-x", {})
          , p = n(i, "data-top-y", {})
          , g = n(i, "data-bottom-y", {})
          , R = n(i, "data-labels", null)
          , L = n(i, "data-top-series", [])
          , D = n(i, "data-bottom-series", [])
          , Ce = i.getAttribute("data-show-points")
          , re = Ce !== "false"
          , P = i.getAttribute("data-smooth");
        let x = null;
        if (P)
            try {
                const e = JSON.parse(P);
                x = e
            } catch {
                const e = Number(P);
                Number.isFinite(e) && e > 1 && (x = e)
            }
        const he = i.getAttribute("data-src")
          , me = i.getAttribute("data-srcs")
          , _ = n(i, "data-seriesmeta", {})
          , M = [];
        if (me)
            try {
                const e = JSON.parse(me);
                Array.isArray(e) && M.push(...e)
            } catch {}
        he && M.push(he);
        let b = []
          , v = [];
        if (M.length)
            try {
                const e = await Promise.all(M.map(e => fetch(e, {
                    cache: "no-store"
                }).then(e => e.text())));
                for (let t = 0; t < M.length; t++) {
                    const o = M[t]
                      , n = e[t]
                      , i = /\.csv(\?|$)/i.test(o) || /,/.test(n.slice(0, 200));
                    if (i) {
                        {
                            const e = n.split(/\r?\n/).filter(e => e && !/^\s*$/.test(e));
                            if (e.length > 1) {
                                const n = s(e[0])
                                  , o = n.findIndex(e => e.trim().toLowerCase() === "step")
                                  , t = [];
                                for (let e = 0; e < n.length; e++) {
                                    const s = n[e].trim();
                                    if (/__MIN|__MAX/i.test(s))
                                        continue;
                                    let o = null;
                                    / - mean_reward$/i.test(s) && (o = "reward"),
                                    / - kl_?learner_?sampler:mean$/i.test(s) && (o = "kl"),
                                    o && t.push({
                                        idx: e,
                                        header: s,
                                        kind: o
                                    })
                                }
                                const i = _ && Array.isArray(_.names) ? _.names : null
                                  , a = _ && Array.isArray(_.colors) ? _.colors : null
                                  , r = t.map( (e, t) => {
                                    const n = e.header.replace(/\s*-\s*mean_reward$/i, "").replace(/\s*-\s*kl_?learner_?sampler:mean$/i, "")
                                      , s = i ? i[t] || n : n
                                      , o = a ? a[t] || null : null;
                                    return {
                                        name: s,
                                        color: o,
                                        points: [],
                                        kind: e.kind
                                    }
                                }
                                );
                                for (let n = 1; n < e.length; n++) {
                                    const i = s(e[n])
                                      , c = o >= 0 ? i[o] : i[0]
                                      , a = Number(c);
                                    if (!Number.isFinite(a))
                                        continue;
                                    for (let e = 0; e < t.length; e++) {
                                        const n = Number(i[t[e].idx]);
                                        Number.isFinite(n) && r[e].points.push([a, n])
                                    }
                                }
                                for (const e of r)
                                    e.kind === "reward" && b.push({
                                        name: e.name,
                                        color: e.color,
                                        points: e.points
                                    }),
                                    e.kind === "kl" && v.push({
                                        name: e.name,
                                        color: e.color,
                                        points: e.points
                                    })
                            }
                        }
                    } else {
                        const i = n.split(/\n|\r/).filter(e => e && !/^\s*$/.test(e))
                          , s = []
                          , o = [];
                        for (const r of i) {
                            const e = r.trim().split(/\s+/);
                            if (e.length < 3)
                                continue;
                            const t = Number(e[0])
                              , n = Number(e[1])
                              , a = Number(e[2]);
                            Number.isFinite(t) && Number.isFinite(n) && s.push([t, n]),
                            Number.isFinite(t) && Number.isFinite(a) && o.push([t, a])
                        }
                        const e = _ && Array.isArray(_.names) ? _.names : null
                          , t = _ && Array.isArray(_.colors) ? _.colors : null
                          , a = e && e[0] ? e[0] : "Series 1"
                          , r = e && e[1] ? e[1] : "Series 2"
                          , c = t && t[0] ? t[0] : null
                          , l = t && t[1] ? t[1] : null;
                        s.length && b.push({
                            name: a,
                            color: c,
                            points: s
                        }),
                        o.length && v.push({
                            name: r,
                            color: l,
                            points: o
                        })
                    }
                }
            } catch (e) {
                console.error("chart-line-2pane: failed to fetch data", e)
            }
        function fe(e) {
            return Array.isArray(e) && e.some(e => Array.isArray(e.points) && e.points.length)
        }
        !b.length && fe(L) && (b = L.map(e => ({
            ...e
        }))),
        !v.length && fe(D) && (v = D.map(e => ({
            ...e
        })));
        function te(e, t) {
            return Array.isArray(t) ? e.map( (e, n) => {
                const s = t[n];
                return s && typeof s == "object" ? {
                    ...e,
                    ...s,
                    points: e.points
                } : e
            }
            ) : e
        }
        b = te(b, L),
        v = te(v, D);
        const V = Math.max(320, Math.floor(i.clientWidth || 800))
          , He = 520 / 800
          , k = V
          , S = Math.round(V * He)
          , a = {
            top: 20,
            right: 24,
            bottom: 72,
            left: 72
        }
          , y = k - a.left - a.right
          , C = S - a.top - a.bottom
          , ve = 24
          , f = Math.max(40, Math.floor((C - ve) / 2))
          , u = {
            x: a.left,
            y: a.top,
            w: y,
            h: f
        }
          , d = {
            x: a.left,
            y: a.top + f + ve,
            w: y,
            h: f
        }
          , h = e("svg", {
            viewBox: `0 0 ${k} ${S}`,
            width: String(k),
            height: String(S),
            role: "img",
            preserveAspectRatio: "xMinYMin meet"
        });
        h.classList.add("chart-svg");
        const qe = i.querySelector("figcaption")
          , U = [...b.flatMap(e => e.points?.map(e => e[0]) || []), ...v.flatMap(e => e.points?.map(e => e[0]) || [])]
          , $e = m.ticks && m.ticks.length ? Math.min(...m.ticks) : 1 / 0
          , Be = m.ticks && m.ticks.length ? Math.max(...m.ticks) : -(1 / 0)
          , Y = m.domain && m.domain[0] != null ? m.domain[0] : Math.min($e, Math.min(...U))
          , O = m.domain && m.domain[1] != null ? m.domain[1] : Math.max(Be, Math.max(...U))
          , Re = m.padLeft != null ? m.padLeft : .04
          , De = m.padRight != null ? m.padRight : .1
          , Z = O - Y || 1
          , J = Y - Z * Math.max(0, Re)
          , ee = O + Z * Math.max(0, De)
          , w = {
            min: J,
            max: ee,
            k: y / (ee - J || 1)
        }
          , ne = b.flatMap(e => e.points?.map(e => e[1]) || [])
          , se = v.flatMap(e => e.points?.map(e => e[1]) || [])
          , Pe = p.ticks && p.ticks.length ? Math.min(...p.ticks) : 1 / 0
          , je = p.ticks && p.ticks.length ? Math.max(...p.ticks) : -(1 / 0)
          , Te = g.ticks && g.ticks.length ? Math.min(...g.ticks) : 1 / 0
          , Oe = g.ticks && g.ticks.length ? Math.max(...g.ticks) : -(1 / 0)
          , ce = p.domain && p.domain[0] != null ? p.domain[0] : Math.min(Pe, Math.min(...ne))
          , le = p.domain && p.domain[1] != null ? p.domain[1] : Math.max(je, Math.max(...ne))
          , de = g.domain && g.domain[0] != null ? g.domain[0] : Math.min(Te, Math.min(...se))
          , ue = g.domain && g.domain[1] != null ? g.domain[1] : Math.max(Oe, Math.max(...se))
          , we = le - ce || 1
          , _e = ue - de || 1
          , ze = p.padTop != null ? p.padTop : .06
          , Ne = g.padTop != null ? g.padTop : .06
          , ge = ce
          , $ = le + we * Math.max(0, ze)
          , be = de
          , pe = ue + _e * Math.max(0, Ne)
          , F = {
            innerW: y,
            innerH: f,
            x: w,
            y: {
                min: ge,
                max: $,
                k: f / ($ - ge || 1)
            }
        }
          , E = {
            innerW: y,
            innerH: f,
            x: w,
            y: {
                min: be,
                max: pe,
                k: f / (pe - be || 1)
            }
        }
          , T = e("g", {
            class: "grid"
        })
          , j = e("g", {});
        h.appendChild(T),
        h.appendChild(j),
        h.appendChild(e("rect", {
            x: u.x,
            y: u.y,
            width: u.w,
            height: u.h,
            fill: "none"
        })),
        h.appendChild(e("rect", {
            x: d.x,
            y: d.y,
            width: d.w,
            height: d.h,
            fill: "none"
        }));
        const xe = a.left + y;
        j.appendChild(e("line", {
            x1: a.left,
            y1: u.y,
            x2: a.left,
            y2: u.y + u.h,
            class: "axis-line"
        })),
        j.appendChild(e("line", {
            x1: a.left,
            y1: d.y,
            x2: a.left,
            y2: d.y + d.h,
            class: "axis-line"
        })),
        j.appendChild(e("line", {
            x1: a.left,
            y1: a.top + C,
            x2: xe,
            y2: a.top + C,
            class: "axis-line"
        }));
        function N(e, t, n) {
            if (!e || !e.length)
                return e;
            const o = [];
            let s = null;
            for (const i of e) {
                const a = t(i);
                (s === null || Math.abs(a - s) >= n) && (o.push(i),
                s = a)
            }
            return o
        }
        const Ee = m.ticks || []
          , ke = N(Ee, e => a.left + (e - w.min) * w.k, Math.max(48, k / 14));
        if (ke.forEach(t => {
            const n = a.left + (t - w.min) * w.k
              , o = e("line", {
                x1: n,
                y1: u.y,
                x2: n,
                y2: d.y + d.h,
                class: "gridline"
            });
            T.appendChild(o);
            const i = e("line", {
                x1: n,
                y1: a.top + C,
                x2: n,
                y2: a.top + C - 6,
                class: "tick"
            });
            j.appendChild(i);
            const s = e("text", {
                x: n,
                y: a.top + C + 22,
                class: "axis-tick"
            });
            s.textContent = String(t),
            s.setAttribute("text-anchor", "middle"),
            j.appendChild(s)
        }
        ),
        m.label) {
            const t = e("text", {
                x: a.left + y / 2,
                y: a.top + C + 50,
                class: "axis-label"
            });
            t.textContent = m.label,
            t.setAttribute("text-anchor", "middle"),
            j.appendChild(t)
        }
        const Ae = p.ticks || []
          , Se = N(Ae, e => u.y + f - (e - F.y.min) * F.y.k, Math.max(32, S / 14));
        if (Se.forEach(t => {
            const n = u.y + f - (t - F.y.min) * F.y.k
              , o = e("line", {
                x1: a.left,
                y1: n,
                x2: a.left + y,
                y2: n,
                class: "gridline"
            });
            T.appendChild(o);
            const i = e("line", {
                x1: a.left,
                y1: n,
                x2: a.left + 6,
                y2: n,
                class: "tick"
            });
            j.appendChild(i);
            const s = e("text", {
                x: a.left - 10,
                y: n + 4,
                class: "axis-tick"
            });
            s.textContent = String(t),
            s.setAttribute("text-anchor", "end"),
            j.appendChild(s)
        }
        ),
        p.label) {
            const n = 58
              , t = e("text", {
                x: a.left - n,
                y: u.y + f / 2,
                class: "axis-label"
            });
            t.textContent = p.label,
            t.setAttribute("text-anchor", "middle"),
            t.setAttribute("transform", `rotate(-90 ${a.left - n} ${u.y + f / 2})`),
            j.appendChild(t)
        }
        const Me = g.ticks || []
          , Fe = N(Me, e => d.y + f - (e - E.y.min) * E.y.k, Math.max(32, S / 14));
        if (Fe.forEach(t => {
            const n = d.y + f - (t - E.y.min) * E.y.k
              , o = e("line", {
                x1: a.left,
                y1: n,
                x2: a.left + y,
                y2: n,
                class: "gridline"
            });
            T.appendChild(o);
            const i = e("line", {
                x1: a.left,
                y1: n,
                x2: a.left + 6,
                y2: n,
                class: "tick"
            });
            j.appendChild(i);
            const s = e("text", {
                x: a.left - 10,
                y: n + 4,
                class: "axis-tick"
            });
            s.textContent = String(t),
            s.setAttribute("text-anchor", "end"),
            j.appendChild(s)
        }
        ),
        g.label) {
            const n = 58
              , t = e("text", {
                x: a.left - n,
                y: d.y + f / 2,
                class: "axis-label"
            });
            t.textContent = g.label,
            t.setAttribute("text-anchor", "middle"),
            t.setAttribute("transform", `rotate(-90 ${a.left - n} ${d.y + f / 2})`),
            j.appendChild(t)
        }
        function ae(e) {
            return e.map( (e, t) => {
                let n = e.points || [];
                const s = typeof x == "number" ? x : x && Array.isArray(x) ? Number(x[t]) : null;
                if (Number.isFinite(s) && s > 1 && n.length > s) {
                    const o = Math.floor(s / 2)
                      , e = n.map(e => e[1])
                      , t = new Array(e.length + 1).fill(0);
                    for (let n = 0; n < e.length; n++)
                        t[n + 1] = t[n] + e[n];
                    n = n.map( (n, s) => {
                        const i = Math.max(0, s - o)
                          , a = Math.min(e.length, s + o + 1)
                          , r = (t[a] - t[i]) / (a - i);
                        return [n[0], r]
                    }
                    )
                }
                return {
                    ...e,
                    points: n
                }
            }
            )
        }
        b = ae(b, 0),
        v = ae(v, 1);
        const ie = e("g", {
            class: "series"
        })
          , oe = e("g", {
            class: "points"
        });
        h.appendChild(ie),
        re && h.appendChild(oe);
        function Q(n, s, o) {
            n.forEach(n => {
                const i = [];
                for (let e = 0; e < (n.points || []).length; e++) {
                    const [t,s] = n.points[e];
                    if (t <= O) {
                        const e = Math.min(s, o.y.max);
                        i.push([t, e])
                    } else {
                        if (e > 0) {
                            const [a,r] = n.points[e - 1]
                              , c = (O - a) / (t - a)
                              , l = r + c * (s - r);
                            i.push([O, Math.min(l, o.y.max)])
                        }
                        break
                    }
                }
                const a = e("path", {
                    d: r(i, o, {
                        left: s.x,
                        top: s.y,
                        right: k - (s.x + s.w),
                        bottom: S - (s.y + s.h),
                        innerH: s.h,
                        innerW: s.w
                    }),
                    class: "line"
                });
                n.color && a.style.setProperty("--series-color", n.color),
                typeof n.lineWidth == "number" && a.style.setProperty("--line-width", String(n.lineWidth)),
                ie.appendChild(a),
                re && (n.points || []).forEach(i => {
                    if (i[0] > O)
                        return;
                    const [r,c] = t(i[0], i[1], o, {
                        left: s.x,
                        top: s.y,
                        innerH: s.h,
                        innerW: s.w
                    })
                      , a = e("circle", {
                        cx: r,
                        cy: c,
                        r: 3,
                        class: "point"
                    });
                    n.color && a.style.setProperty("--series-color", n.color),
                    oe.appendChild(a)
                }
                )
            }
            )
        }
        Q(b, u, F),
        Q(v, d, E);
        function Le(n, s, o) {
            const i = [];
            n.forEach(a => {
                if (!a.name || !a.points || a.points.length === 0)
                    return;
                let v = 0;
                for (let e = 1; e < a.points.length; e++)
                    a.points[e][0] > a.points[v][0] && (v = e);
                const _ = a.points[v]
                  , [E,C] = t(_[0], _[1], o, {
                    left: s.x,
                    top: s.y,
                    innerH: s.h,
                    innerW: s.w
                })
                  , m = e("rect", {
                    class: "series-color-box",
                    width: 12,
                    height: 12,
                    rx: 2,
                    ry: 2
                });
                a.color && m.style.setProperty("--series-color", a.color),
                h.appendChild(m);
                const c = e("text", {
                    class: "series-label"
                });
                c.textContent = a.name,
                a.color && c.style.setProperty("--series-color", a.color),
                h.appendChild(c);
                const w = n.indexOf(a)
                  , r = R && (R[a.name] ?? R[w]);
                let f, p, g = !1;
                if (r)
                    if (typeof r.px == "number" && typeof r.py == "number")
                        f = r.px,
                        p = r.py,
                        g = !0;
                    else if (typeof r.x == "number" && typeof r.y == "number") {
                        const e = t(r.x, r.y, o, {
                            left: s.x,
                            top: s.y,
                            innerH: s.h,
                            innerW: s.w
                        });
                        f = e[0],
                        p = e[1],
                        g = !0
                    }
                if (!g) {
                    const e = 4;
                    f = Math.min(s.x + s.w - e, E + 8),
                    p = Math.max(s.y + 12, C - 14)
                }
                const b = r && typeof r.dx == "number" ? r.dx : 0
                  , j = r && typeof r.dy == "number" ? r.dy : 0
                  , O = f + b - 16
                  , x = p + j - 10;
                m.setAttribute("x", O),
                m.setAttribute("y", x),
                c.setAttribute("x", f + b),
                c.setAttribute("y", p + j);
                const y = g || !!r && (typeof r.dx == "number" || typeof r.dy == "number");
                if (!y) {
                    const e = c.getBBox();
                    e.x + e.width > s.x + s.w && c.setAttribute("x", Math.max(s.x + s.w - e.width - 4, s.x + 4)),
                    e.y < s.y && c.setAttribute("y", s.y + 12)
                }
                const u = c.getBBox()
                  , d = m.getBBox()
                  , l = {
                    x: Math.min(d.x, u.x),
                    y: Math.min(d.y, u.y),
                    width: Math.max(d.x + d.width, u.x + u.width) - Math.min(d.x, u.x),
                    height: Math.max(d.y + d.height, u.y + u.height) - Math.min(d.y, u.y)
                };
                if (!y)
                    for (const e of i) {
                        const t = !(l.x > e.x + e.width || l.x + l.width < e.x || l.y > e.y + e.height || l.y + l.height < e.y);
                        if (t) {
                            const e = l.y - 14
                              , t = e - l.y;
                            c.setAttribute("y", parseFloat(c.getAttribute("y")) + t),
                            m.setAttribute("y", parseFloat(m.getAttribute("y")) + t),
                            l.y = e
                        }
                    }
                i.push(l)
            }
            )
        }
        const X = z !== "none" && q !== "none";
        (!X || z !== "bottom") && Le(v, d, E);
        function ye(t, n, s) {
            if (!t.length)
                return;
            const i = e("g", {
                class: "legend-block"
            });
            h.appendChild(i);
            let o = n.x + 10
              , r = n.y + 12;
            s === "top-right" && (o = n.x + n.w - 10);
            const a = [];
            if (t.forEach( (t, n) => {
                const c = r + n * Ie
                  , d = t.color || "#000"
                  , l = e("rect", {
                    x: o,
                    y: c - A + 2,
                    width: A,
                    height: A,
                    rx: 2,
                    ry: 2,
                    fill: d,
                    stroke: "none"
                })
                  , s = e("text", {
                    x: o + A + H,
                    y: c,
                    class: "series-label",
                    fill: "#000"
                });
                s.textContent = t.name || `Series ${n + 1}`,
                i.appendChild(l),
                i.appendChild(s),
                a.push({
                    sw: l,
                    txt: s
                })
            }
            ),
            s === "top-right") {
                let e = 0;
                a.forEach( ({sw: t, txt: n}) => {
                    e = Math.max(e, n.getBBox().width + A + H)
                }
                );
                const t = e;
                a.forEach( ({sw: e, txt: n}) => {
                    e.setAttribute("x", o - t),
                    n.setAttribute("x", o - t + A + H)
                }
                )
            }
        }
        if (X) {
            const e = z === "top" ? u : d
              , t = z === "top" ? b : v;
            ye(t, e, q)
        }
        function G(t) {
            const s = e("line", {
                x1: t.x,
                y1: t.y,
                x2: t.x,
                y2: t.y + t.h,
                class: "cursor-line"
            })
              , n = e("g", {
                class: "tooltip",
                visibility: "hidden"
            })
              , o = e("rect", {
                rx: 4,
                ry: 4,
                class: "tooltip-bg"
            })
              , i = e("text", {
                class: "tooltip-text"
            });
            return n.appendChild(o),
            n.appendChild(i),
            h.appendChild(s),
            h.appendChild(n),
            {
                cursor: s,
                tip: n,
                bg: o,
                txt: i
            }
        }
        const I = G(u)
          , B = G(d);
        function Ve(t) {
            const m = a.left
              , p = a.left + y
              , i = Math.max(m, Math.min(p, t));
            let n = i
              , r = 1 / 0
              , s = null;
            const g = [...b, ...v];
            for (const e of g) {
                if (!e.points || e.points.length === 0)
                    continue;
                for (const t of e.points) {
                    if (t[0] > O)
                        continue;
                    const n = a.left + (t[0] - w.min) * w.k
                      , o = Math.abs(n - i);
                    o < r && (r = o,
                    s = n)
                }
            }
            s != null && (n = s);
            function h(t, s, i) {
                t.cursor.setAttribute("x1", n),
                t.cursor.setAttribute("x2", n),
                t.cursor.style.opacity = "1",
                t.txt.textContent = "",
                t.txt.setAttribute("x", "0"),
                t.txt.setAttribute("y", "0");
                let u = 0;
                i.forEach(s => {
                    if (!s.points || s.points.length === 0)
                        return;
                    const d = c(s.points, n, {
                        innerW: y,
                        innerH: f,
                        x: w,
                        y: {
                            min: 0,
                            max: 1,
                            k: 1
                        }
                    }, {
                        left: a.left,
                        top: 0,
                        innerH: f,
                        innerW: y
                    })
                      , i = s.points[d]
                      , h = `${s.name || ""}: ${o(i[1])} @ ${l(i[0])}`
                      , r = e("tspan", {
                        x: 0,
                        dy: u === 0 ? "0" : "1.2em"
                    });
                    r.textContent = h,
                    t.txt.appendChild(r),
                    u++
                }
                );
                const r = t.txt.getBBox();
                t.bg.setAttribute("x", r.x - 6),
                t.bg.setAttribute("y", r.y - 4),
                t.bg.setAttribute("width", r.width + 12),
                t.bg.setAttribute("height", r.height + 8);
                const h = 4
                  , m = r.width + 12;
                let d = n + 8;
                d + m + h > k && (d = Math.max(a.left + h, n - m - 8));
                const p = s.y + 12;
                t.tip.setAttribute("transform", `translate(${d}, ${p})`),
                t.tip.setAttribute("visibility", "visible")
            }
            h(I, u, b),
            h(B, d, v)
        }
        function K() {
            I.cursor.style.opacity = "0",
            I.tip.setAttribute("visibility", "hidden"),
            B.cursor.style.opacity = "0",
            B.tip.setAttribute("visibility", "hidden")
        }
        const We = e("rect", {
            x: a.left,
            y: u.y,
            width: y,
            height: d.y + d.h - u.y,
            fill: "transparent"
        });
        h.appendChild(We);
        function Ue(e) {
            const t = h.createSVGPoint();
            t.x = e.clientX,
            t.y = e.clientY;
            const n = h.getScreenCTM();
            return n ? t.matrixTransform(n.inverse()) : null
        }
        function Ke(e) {
            const t = e.x >= u.x && e.x <= u.x + u.w && e.y >= u.y && e.y <= u.y + u.h
              , n = e.x >= d.x && e.x <= d.x + d.w && e.y >= d.y && e.y <= d.y + d.h;
            return t || n
        }
        h.addEventListener("pointermove", e => {
            const t = Ue(e);
            if (!t)
                return;
            Ke(t) ? (Ve(t.x),
            h.style.cursor = "crosshair") : (K(),
            h.style.cursor = "default")
        }
        ),
        h.addEventListener("pointerleave", () => {
            K(),
            h.style.cursor = "default"
        }
        );
        const W = i.querySelector("svg");
        W && W.remove(),
        i.insertBefore(h, qe || null)
    }
    function d() {
        const e = document.querySelectorAll("figure.chart-line")
          , t = document.querySelectorAll("figure.chart-line-2pane");
        if (e.forEach(e => {
            i(e)
        }
        ),
        t.forEach(e => {
            a(e)
        }
        ),
        "ResizeObserver"in window) {
            const n = new ResizeObserver(e => {
                for (const n of e) {
                    const t = n.target;
                    t.classList.contains("chart-line-2pane") ? a(t) : i(t)
                }
            }
            );
            e.forEach(e => n.observe(e)),
            t.forEach(e => n.observe(e))
        } else
            window.addEventListener("resize", () => {
                e.forEach(i),
                t.forEach(a)
            }
            )
    }
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d()
}
)()

document.addEventListener("DOMContentLoaded", function() {
    function e() {
        const e = document.createElement("span");
        e.style.position = "absolute",
        e.style.left = "-9999px",
        e.style.fontSize = "72px",
        e.style.fontFamily = "monospace",
        e.textContent = "giItT1WQy@!-/#",
        document.body.appendChild(e);
        const t = e.offsetWidth;
        e.style.fontFamily = '"GT America", monospace';
        const n = e.offsetWidth;
        return document.body.removeChild(e),
        t !== n
    }
    setTimeout(function() {
        e() ? console.log("GT America font loaded successfully.") : (console.warn("GT America font failed to load. Using fallback fonts."),
        document.body.classList.add("gt-america-fallback"))
    }, 1e3),
    "fonts"in document && document.fonts.ready.then(function() {
        let e = !1;
        document.fonts.forEach(function(t) {
            t.family === "GT America" && t.status === "loaded" && (e = !0)
        }),
        e ? console.log("GT America WOFF2 fonts loaded via Font Face API.") : (console.warn("GT America font not found in loaded fonts."),
        document.body.classList.add("gt-america-fallback"))
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelector("#header .navbar-logo-home")
      , n = document.querySelector("#header .logo-container")
      , s = document.querySelector("#header .site-header");
    if (!e || !n || !s)
        return;
    const o = window.matchMedia("(max-width: 768px)");
    function t() {
        if (!o.matches) {
            e.classList.remove("is-visible");
            return
        }
        const s = n.getBoundingClientRect().bottom
          , t = s <= 0;
        e.classList.toggle("is-visible", t),
        e.setAttribute("aria-hidden", t ? "false" : "true")
    }
    t(),
    window.addEventListener("scroll", function() {
        e.classList.contains("animate") || e.classList.add("animate"),
        t()
    }, {
        passive: !0
    }),
    window.addEventListener("resize", t)
}),
document.addEventListener("DOMContentLoaded", function() {
    const t = document.getElementById("menu-toggle")
      , e = document.getElementById("mobile-menu")
      , s = e ? e.querySelector(".mobile-menu-nav") : null;
    if (!t || !e)
        return;
    function o() {
        document.body.classList.add("menu-open"),
        e.classList.add("open"),
        t.classList.add("is-active"),
        t.setAttribute("aria-expanded", "true"),
        e.setAttribute("aria-hidden", "false")
    }
    function n() {
        document.body.classList.remove("menu-open"),
        e.classList.remove("open"),
        t.classList.remove("is-active"),
        t.setAttribute("aria-expanded", "false"),
        e.setAttribute("aria-hidden", "true")
    }
    function i() {
        const t = e.classList.contains("open");
        t ? n() : o()
    }
    t.addEventListener("click", i),
    e.addEventListener("click", function(e) {
        const t = s && s.contains(e.target);
        t || n()
    }),
    document.addEventListener("keydown", function(t) {
        t.key === "Escape" && e.classList.contains("open") && n()
    }),
    s && s.querySelectorAll("a").forEach(function(e) {
        e.addEventListener("click", function() {
            n()
        })
    }),
    window.addEventListener("resize", function() {
        window.innerWidth > 600 && e.classList.contains("open") && n()
    })
});
function toggleDarkMode() {
    document.body.classList.toggle("darkmode"),
    localStorage.setItem("darkmode", document.body.classList.contains("darkmode"))
}
localStorage.getItem("darkmode") === "true" && document.body.classList.add("darkmode"),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelector(".dark-mode-toggle");
    e && e.addEventListener("click", toggleDarkMode)
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelectorAll("a[href]");
    e.forEach(function(e) {
        const t = e.getAttribute("href");
        if (!t)
            return;
        if (t.startsWith("#") || t.startsWith("javascript:"))
            return;
        if (t.startsWith("mailto:") || t.startsWith("tel:"))
            return;
        let s;
        try {
            s = new URL(e.href,document.baseURI)
        } catch {
            return
        }
        const o = s.origin !== window.location.origin;
        if (!o || e.getAttribute("target") === "_self")
            return;
        e.setAttribute("target", "_blank");
        const i = e.getAttribute("rel") || ""
          , n = new Set(i.split(/\s+/).filter(Boolean));
        n.add("noopener"),
        n.add("noreferrer"),
        e.setAttribute("rel", Array.from(n).join(" "))
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(e) {
        e.addEventListener("click", function(e) {
            const t = this.getAttribute("href") || "";
            if (t === "#" || t.toLowerCase() === "#top") {
                e.preventDefault(),
                window.scrollTo(0, 0);
                return
            }
            if (t.length > 1)
                try {
                    const n = document.querySelector(t);
                    n && (e.preventDefault(),
                    n.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    }))
                } catch {}
        })
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelectorAll("pre code");
    e.forEach(function(e) {
        const s = e.parentNode
          , n = document.createElement("div");
        n.className = "code-block-wrapper",
        s.parentNode.insertBefore(n, s),
        n.appendChild(s);
        const t = document.createElement("button");
        t.className = "copy-button",
        t.type = "button",
        t.setAttribute("aria-label", "Copy code to clipboard"),
        t.setAttribute("title", "Copy code");
        const o = '<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="1rem" height="1rem" fill="currentColor" class="octicon octicon-copy"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>'
          , i = '<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="1rem" height="1rem" fill="currentColor" class="octicon octicon-check"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>';
        t.innerHTML = o,
        n.appendChild(t),
        t.addEventListener("click", function() {
            const n = e.textContent;
            navigator.clipboard.writeText(n).then(function() {
                t.innerHTML = i,
                setTimeout(function() {
                    t.innerHTML = o
                }, 1600)
            }).catch(function(e) {
                console.error("Failed to copy code:", e)
            })
        })
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    const i = document.getElementById("left-toc")
      , a = document.querySelector("#main.post article.content");
    if (!i || !a)
        return;
    const r = Array.from(a.querySelectorAll("h2, h3"));
    function c(e) {
        return (e || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    }
    const t = new Set;
    function l(e) {
        const s = e.getAttribute("id");
        if (s)
            return t.add(s),
            s;
        let n = c(e.textContent || "") || "section";
        const o = n;
        let i = 2;
        for (; t.has(n) || document.getElementById(n) && document.getElementById(n) !== e; )
            n = o + "-" + i++;
        return e.id = n,
        t.add(n),
        n
    }
    function d(e) {
        let n = "introduction"
          , s = 2;
        for (; t.has(n) || document.getElementById(n); )
            n = "introduction-" + s++;
        return e.id = n,
        t.add(n),
        n
    }
    if (!r.length) {
        i.style.display = "none";
        return
    }
    const s = document.createElement("ul");
    s.className = "toc-list";
    const e = [s];
    let n = 1;
    const o = a.querySelector("p");
    if (o) {
        const n = o.id ? o.id : d(o)
          , e = document.createElement("li");
        e.className = "toc-item";
        const t = document.createElement("a");
        t.href = "#" + n,
        t.textContent = "Introduction",
        e.appendChild(t),
        s.appendChild(e)
    }
    r.forEach(function(t) {
        const r = t.tagName.toLowerCase()
          , s = r === "h2" ? 1 : 2
          , c = l(t)
          , a = (t.textContent || "").trim();
        if (!a)
            return;
        if (s > n)
            for (let t = n; t < s; t++) {
                const o = document.createElement("ul");
                o.className = "toc-list toc-level-" + (t + 1);
                const i = e[e.length - 1].lastElementChild;
                if (!i)
                    break;
                i.appendChild(o),
                e.push(o)
            }
        else if (s < n)
            for (let t = n; t > s; t--)
                e.pop();
        n = s;
        const o = document.createElement("li");
        o.className = "toc-item";
        const i = document.createElement("a");
        i.href = "#" + c,
        i.textContent = a,
        o.appendChild(i),
        e[e.length - 1].appendChild(o)
    }),
    i.appendChild(s)
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelector("#main.post article.content");
    if (!e)
        return;
    const t = e.querySelectorAll("img");
    t.forEach(function(e) {
        e.setAttribute("draggable", "false"),
        e.addEventListener("dragstart", function(e) {
            e.preventDefault()
        }),
        e.addEventListener("mousedown", function(e) {
            e.detail > 1 && e.preventDefault()
        }),
        e.addEventListener("contextmenu", function(e) {
            e.preventDefault()
        })
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelector("#main.post article.content");
    if (!e)
        return;
    const t = Array.from(e.querySelectorAll("h2, h3, h4, h5, h6"));
    if (!t.length)
        return;
    function s(e) {
        return (e || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    }
    const n = new Set(Array.from(document.querySelectorAll("[id]")).map(function(e) {
        return e.id
    }));
    function o(e) {
        const o = e.getAttribute("id");
        if (o)
            return o;
        let t = s(e.textContent || "") || "section";
        const i = t;
        let a = 2;
        for (; n.has(t) || document.getElementById(t); )
            t = i + "-" + a++;
        return e.id = t,
        n.add(t),
        t
    }
    t.forEach(function(e) {
        const t = o(e);
        if (!e.querySelector(".heading-anchor")) {
            let n = e.querySelector(".heading-text");
            if (!n) {
                for (n = document.createElement("span"),
                n.className = "heading-text"; e.firstChild; )
                    n.appendChild(e.firstChild);
                e.appendChild(n)
            }
            const s = document.createElement("a");
            s.className = "heading-anchor",
            s.href = "#" + t,
            s.setAttribute("aria-label", "Link to this section"),
            s.setAttribute("title", "Link to this section"),
            s.textContent = "#",
            n.appendChild(s)
        }
    })
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelector(".tinker-hero-section");
    if (!e)
        return;
    function t(e) {
        const t = e.getBoundingClientRect();
        return t.top < window.innerHeight && t.bottom > 0
    }
    if (t(e)) {
        const e = [".tinker-cover-image", ".tinker-title", ".tinker-subtitle", ".tinker-cta-row"];
        e.forEach(function(e) {
            const t = document.querySelector(e);
            t && t.classList.add("animate-in")
        })
    }
}),
document.addEventListener("DOMContentLoaded", function() {
    const e = document.querySelectorAll(".btn");
    e.forEach(function(e) {
        let t = !1;
        function n() {
            t = !0
        }
        function s() {
            if (!t)
                return;
            t = !1,
            requestAnimationFrame(function() {
                e.classList.remove("btn-spring"),
                void e.offsetWidth,
                requestAnimationFrame(function() {
                    e.classList.add("btn-spring")
                })
            }),
            setTimeout(function() {
                e.classList.remove("btn-spring")
            }, 450)
        }
        e.addEventListener("mousedown", n),
        e.addEventListener("mouseup", s),
        e.addEventListener("mouseleave", function() {
            t && (t = !1)
        }),
        e.addEventListener("touchstart", n),
        e.addEventListener("touchend", s)
    })
})

// elec.mjs: a parts library for electrical scenes (house, solar, EV, switchboard).
// Every function returns SVG markup in world space, built with the iso kit, and
// accepts a timeline `step` for the parts that light up. Default camera: azimuth 45,
// so the visible walls are x = max ("x" face, lower right) and y = max ("y" face, lower left).
import * as k from "./iso-kit.mjs";
import * as G from "./lathe.mjs";
import { poly3, quad, wallPt, ledSvg, litSvg, poolSvg, wallGlowSvg, moveSvg, uid, scopeId } from "./rendu.mjs";

const RAD = Math.PI / 180;
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const at = (p, P) => k.iso(p, P);
const tenth = (v) => (Math.round(v * 10) / 10).toString();

// A rectangle drawn on a wall face, as fill + outline. Returns markup.
export function faceRect(face, at0, a0, a1, z0, z1, P, { fill = "", tone = "lo", className = "" } = {}) {
  const d = poly3(quad(face, at0, a0, a1, z0, z1), P);
  return (fill || className ? `<path${className ? ` class="${className}"` : ""}${fill ? ` fill="${fill}"` : ""} d="${d}"/>` : "") + (tone ? L(d, { tone }) : "");
}

// Lines across a wall face (cladding joints, floor bands). `along` values on the wall's long axis.
export function faceLines(face, at0, segments, P, { tone = "faint" } = {}) {
  return L(segments.map(([a0, z0, a1, z1]) => poly3([wallPt(face, at0, a0, z0), wallPt(face, at0, a1, z1)], P, false)).join(""), { tone });
}

// ---------------------------------------------------------------------------
// Solar panel on a rack, tilted about the x axis so it faces +y (toward the viewer's left).
// plan {x, y, w, d}: footprint; zb: height of the low (front) edge; deck: roof level for the legs.
// ---------------------------------------------------------------------------
export function solarPanel({ x, y, w, d }, zb, deck, P, { tilt = 14, cols = 6, rows = 3, step = 0, delay = 0 } = {}) {
  const h = d * Math.tan(tilt * RAD);
  const t = 1.3;
  const A = [x, y + d, zb], B = [x + w, y + d, zb], C = [x + w, y, zb + h], Dp = [x, y, zb + h];
  const dn = (p) => [p[0], p[1], p[2] - t];
  const out = [];
  // legs and rails
  const leg = (lx, ly, z1) => S(k.cylinder(lx, ly, 0.75, deck, z1 - deck, P, 12), { tone: "mid", crease: "none" });
  out.push(leg(x + 4, y + 2, zb + h - t - 0.4 * (2 / d) * h), leg(x + w - 4, y + 2, zb + h - t - 0.4 * (2 / d) * h));
  out.push(S(k.slabOf({ x: x + 2, y: y + 1, w: w - 4, d: 2, r: 0.3 }, deck, 1.2, P, 2), { tone: "mid", crease: "none" }));
  // panel body
  const front = poly3([A, B, dn(B), dn(A)], P);
  const side = poly3([B, C, dn(C), dn(B)], P);
  const top = poly3([A, B, C, Dp], P);
  const hull = poly3([dn(A), dn(B), dn(C), C, Dp, A], P);
  out.push(`<path class="iso-fill" d="${hull}"/>`);
  out.push(`<path class="iso-shade" data-shade="2" d="${front}"/><path class="iso-shade" data-shade="0" d="${side}"/>`);
  const style = delay ? ` style="--r-delay:${delay}s"` : "";
  out.push(`<path class="r-panel" data-step="${step}"${style} d="${top}"/>`);
  // cells
  const lerp = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u];
  const m = 0.9 / Math.max(w, d);
  const iA = lerp(lerp(A, B, m * 1.4), lerp(Dp, C, m * 1.4), 0.04), iB = lerp(lerp(B, A, m * 1.4), lerp(C, Dp, m * 1.4), 0.04);
  const iC = lerp(lerp(C, Dp, m * 1.4), lerp(B, A, m * 1.4), 0.04), iD = lerp(lerp(Dp, C, m * 1.4), lerp(A, B, m * 1.4), 0.04);
  const cells = [];
  for (let c = 1; c < cols; c++) cells.push(poly3([lerp(iA, iB, c / cols), lerp(iD, iC, c / cols)], P, false));
  for (let r = 1; r < rows; r++) cells.push(poly3([lerp(iA, iD, r / rows), lerp(iB, iC, r / rows)], P, false));
  cells.push(poly3([iA, iB, iC, iD], P));
  out.push(`<path class="r-panel-cells" data-step="${step}"${style} d="${cells.join("")}"/>`);
  // sheen that sweeps across while producing
  const clip = uid("panel");
  const band = poly3([[x - 9, y + d, zb], [x - 2, y + d, zb], [x - 2, y, zb + h], [x - 9, y, zb + h]], P);
  const [sx, sy] = k.axisVector(P, [w + 12, 0, 0]);
  out.push(`<clipPath id="${clip}"><path d="${top}"/></clipPath><g clip-path="url(#${clip})"><path class="r-sweep" data-step="${step}" style="--r-delay:${(delay + 0.4).toFixed(2)}s;--sx0:0px;--sy0:0px;--sx1:${tenth(sx)}px;--sy1:${tenth(sy)}px" d="${band}" fill="#ffffff"/></g>`);
  // frame
  out.push(L(top, { tone: "mid" }), L(poly3([dn(A), dn(B), dn(C)], P, false) + poly3([A, dn(A)], P, false) + poly3([C, dn(C)], P, false), { tone: "mid" }));
  out.push(L(poly3([B, dn(B)], P, false), { tone: "lo" }));
  // junction box under the high edge and the clamps
  out.push(D([lerp(A, B, 0.25), lerp(A, B, 0.75), lerp(Dp, C, 0.25), lerp(Dp, C, 0.75)].map((p) => at(p, P)), { size: 0.45, tone: "mid" }));
  // front legs (nearer than the panel)
  out.push(leg(x + 4, y + d - 2, zb - t), leg(x + w - 4, y + d - 2, zb - t));
  return { svg: out.join(""), ports: { low: lerp(A, B, 0.92), high: lerp(Dp, C, 0.92), front: B } };
}

// ---------------------------------------------------------------------------
// A box mounted on a wall: inverter, meter, junction box, controller.
// face "x": wall plane x = wall, the box spans a0..a0+width along y.
// face "y": wall plane y = wall, the box spans a0..a0+width along x.
// The box stands out of the wall toward +x / +y (the visible side) by `depth`.
// screen: a lit display with a trace; vents: slots under it; returns ports in world space.
// ---------------------------------------------------------------------------
export function wallBox(wall, a0, width, z0, height, P, { face = "x", depth = 6, screen = true, step = 0, delay = 0, vents = true, label = "", led = true, trace = true } = {}) {
  const X = wall + depth;
  const plan = (w0, w1, inset = 0) => (face === "x" ? { x: wall, y: w0 + inset, w: depth, d: w1, r: 1.2 } : { x: w0 + inset, y: wall, w: w1, d: depth, r: 1.2 });
  const out = [];
  out.push(`<path class="iso-halo" d="${k.slabOf(plan(a0, width, 2), z0 - 2, height, P).fill}" style="filter:blur(5px);opacity:.18"/>`);
  out.push(S(k.slabOf(plan(a0, width), z0, height, P, 3, 0.6), { tone: "hi", crease: "lo" }));
  out.push(faceRect(face, X, a0 + 1.6, a0 + width - 1.6, z0 + 1.6, z0 + height - 1.6, P, { tone: "faint" }));
  out.push(D([[a0 + 3, z0 + height - 3], [a0 + width - 3, z0 + height - 3], [a0 + 3, z0 + 3], [a0 + width - 3, z0 + 3]].map(([a, z]) => at(wallPt(face, X, a, z), P)), { size: 0.45, tone: "mid" }));
  if (screen) {
    const s0 = a0 + width * 0.25, s1 = a0 + width * 0.75, sz0 = z0 + height * 0.56, sz1 = z0 + height * 0.8;
    out.push(faceRect(face, X, s0, s1, sz0, sz1, P, { fill: "var(--anatomy-shade-1)", tone: "lo" }));
    const glyph = trace
      ? L(poly3([[s0 + 2, sz0 + 2], [s0 + (s1 - s0) * 0.3, sz0 + (sz1 - sz0) * 0.55], [s0 + (s1 - s0) * 0.5, sz0 + (sz1 - sz0) * 0.35], [s0 + (s1 - s0) * 0.7, sz0 + (sz1 - sz0) * 0.7], [s1 - 2, sz0 + (sz1 - sz0) * 0.6]].map(([a, z]) => wallPt(face, X + 0.05, a, z)), P, false), { tone: "blue" })
      : "";
    out.push(litSvg(`<path d="${poly3(quad(face, X + 0.02, s0 + 0.5, s1 - 0.5, sz0 + 0.5, sz1 - 0.5), P)}" fill="var(--r-a100)"/>` + glyph, step, { delay }));
    if (led) out.push(ledSvg(wallPt(face, X, s1 + Math.min(2.5, (a0 + width - s1) / 2), sz1 - 1.2), P, { step, delay, size: 0.7 }));
  }
  if (vents) {
    const v = [];
    for (let i = 0; i < 5; i++) {
      const z = z0 + height * 0.14 + i * 1.6;
      v.push(poly3([wallPt(face, X, a0 + width * 0.3, z), wallPt(face, X, a0 + width * 0.7, z)], P, false));
    }
    out.push(L(v.join(""), { tone: "lo" }));
  }
  if (label) out.push(k.faceTextSvg(k.sideMatrix(face === "x" ? [X, a0 + width / 2] : [a0 + width / 2, X], z0 + height * 0.4, P, face === "x" ? "right" : "left"), label, { size: 1.8, tone: "lo", anchor: "middle" }));
  const mid = a0 + width / 2;
  return {
    svg: out.join(""),
    top: wallPt(face, wall + depth / 2, mid, z0 + height),
    bottom: wallPt(face, wall + depth / 2, mid, z0),
    front: wallPt(face, X, mid, z0 + height / 2),
    side: (z, end = "max") => wallPt(face, wall + depth / 2, end === "max" ? a0 + width : a0, z),
  };
}

// ---------------------------------------------------------------------------
// EV charging post standing on the floor. Footprint centred on (cx, cy); faces +y (toward the car).
// ---------------------------------------------------------------------------
export function evCharger(cx, cy, z, P, { height = 50, step = 0, delay = 0 } = {}) {
  const w = 10, d = 7;
  const plan = { x: cx - w / 2, y: cy - d / 2, w, d, r: 2.4 };
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, -3), z, 0.1, P)}"/>`);
  out.push(S(k.slabOf({ x: plan.x - 2, y: plan.y - 2, w: w + 4, d: d + 4, r: 1.2 }, z, 1.6, P, 3, 0.4), { tone: "mid" }));
  out.push(D(k.corners({ x: plan.x - 2, y: plan.y - 2, w: w + 4, d: d + 4 }, 1.2).map(([x, y]) => at([x, y, z + 1.6], P)), { size: 0.4, tone: "mid" }));
  out.push(S(k.slabOf(plan, z + 1.6, height, P, 6, 0.8), { tone: "hi", crease: "lo" }));
  const Y = cy + d / 2;
  const top = z + 1.6 + height;
  // head panel on the +y face: dark glass with a charge bar
  const a0 = cx - w / 2 + 1.6, a1 = cx + w / 2 - 1.6;
  out.push(faceRect("y", Y, a0, a1, top - 22, top - 3, P, { fill: "var(--anatomy-shade-0)", tone: "lo" }));
  const bars = [];
  for (let i = 0; i < 4; i++) {
    const z0 = top - 19 + i * 3.6;
    bars.push(`<path class="r-bar" data-step="${step}" style="--r-delay:${(delay + 0.5 + i * 0.35).toFixed(2)}s;transition-delay:var(--r-delay)" d="${poly3(quad("y", Y + 0.05, cx - 1.4, cx + 1.4, z0, z0 + 2.4), P)}"/>`);
  }
  out.push(bars.join(""));
  out.push(ledSvg([cx, Y + 0.05, top - 5.6], P, { step, delay, size: 0.6 }));
  // seam ring under the head, side vents on the x face
  out.push(L(poly3([wallPt("y", Y, cx - w / 2 + 2.4, top - 25), wallPt("y", Y, cx + w / 2 - 2.4, top - 25)], P, false), { tone: "faint" }));
  const X = cx + w / 2;
  out.push(L([0, 1, 2, 3].map((i) => poly3([wallPt("x", X, cy - 1.5, z + 12 + i * 1.6), wallPt("x", X, cy + 1.5, z + 12 + i * 1.6)], P, false)).join(""), { tone: "lo" }));
  // holster on the x face
  out.push(S(k.slabOf({ x: X, y: cy - 2, w: 2.6, d: 4, r: 1 }, top - 34, 7, P, 3), { tone: "mid" }));
  return { svg: out.join(""), socket: [cx + 1.5, Y + 0.4, top - 26], holster: [X + 2.6, cy, top - 30], foot: [cx, cy, z] };
}

// ---------------------------------------------------------------------------
// A compact electric car, length along y (nose toward +y), body from x0 to x0 + 36.
// Built from convex prisms along x: lower body, cabin, wheels.
// ---------------------------------------------------------------------------
export function car(x0, y0, z, P, { step = 0, delay = 0, width = 36 } = {}) {
  const F = G.frameOf([x0, y0, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const out = [];
  const W = width;
  const body = [[0, 6], [4, 4.5], [92, 4.5], [97, 7], [98.5, 12], [97, 16.5], [80, 20.5], [16, 22.5], [3, 21], [0.4, 16]];
  const cabin = [[18, 21.6], [34, 33.5], [56, 34], [78, 20.6]];
  const wheelsY = [19, 78];
  const tyre = 8.6;
  const halo = { x: x0 - 3, y: y0 + 2, w: W + 6, d: 94, r: 18 };
  out.push(`<path class="iso-halo" d="${k.haloOf(halo, z, 0.1, P)}" style="opacity:.32"/>`);
  // far wheels peek under the body
  for (const wy of wheelsY) {
    const FW = G.frameOf([x0, y0 + wy, z + tyre], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    out.push(S(G.disc(1, 7, tyre, FW, P), { tone: "mid" }));
  }
  out.push(S(G.prismOf(F, body, 0.6, W - 0.6, P), { tone: "hi", crease: "faint" }));
  out.push(S(G.prismOf(F, cabin, 3.4, W - 3.4, P), { tone: "hi", crease: "faint" }));
  // glass on the cabin's visible side (x = x0 + W - 3.4) and the windscreen
  const SX = x0 + W - 3.4;
  const pt = ([u, v], s = SX) => [s, y0 + u, z + v];
  const sideGlass = [[21, 23.4], [34.5, 32.2], [55.4, 32.6], [74.8, 22.4]].map((p) => pt(p));
  out.push(`<path class="r-glass" d="${poly3(sideGlass, P)}" opacity=".9"/>`);
  out.push(L(poly3(sideGlass, P) + poly3([pt([47, 32.4]), pt([48.5, 22.6])], P, false), { tone: "mid" }));
  const screen = [[56, 34, x0 + 4.6], [78, 20.6, x0 + 4.6], [78, 20.6, x0 + W - 4.6], [56, 34, x0 + W - 4.6]].map(([u, v, s]) => pt([u - 0.6, v - 0.4], s));
  out.push(`<path class="r-glass" d="${poly3(screen, P)}" opacity=".9"/>` + L(poly3(screen, P), { tone: "lo" }));
  // panel lines on the body side (x = x0 + W - 0.6)
  const BX = x0 + W - 0.6;
  out.push(L(
    poly3([pt([47.6, 21.5], BX), pt([49, 8], BX)], P, false)
    + poly3([pt([28, 21.9], BX), pt([29, 8], BX)], P, false)
    + poly3([pt([5, 12.5], BX), pt([93, 12.2], BX)], P, false),
    { tone: "faint" },
  ));
  out.push(L(poly3([pt([38, 17], BX), pt([42, 17], BX)], P, false) + poly3([pt([60, 17], BX), pt([64, 17], BX)], P, false), { tone: "mid" }));
  // charge port flap at the rear, right side, with its LED
  const port = pt([9, 16.4], BX);
  out.push(L(poly3([pt([7.4, 15], BX), pt([10.6, 15], BX), pt([10.6, 17.8], BX), pt([7.4, 17.8], BX)], P), { tone: "mid" }));
  out.push(ledSvg(port, P, { step, delay: delay + 0.6, size: 0.55 }));
  // lights: front strip on the nose face, rear strip
  const nose = [[97.6, 14.2], [97.6, 15.4]];
  const head = poly3([[x0 + W - 3, y0 + 97.5, z + 15.2], [x0 + W - 12, y0 + 98.1, z + 14.6], [x0 + W - 12, y0 + 98.3, z + 13.6], [x0 + W - 3, y0 + 97.8, z + 14.2]], P);
  out.push(`<path d="${head}" fill="var(--anatomy-shade-0)"/>`);
  out.push(litSvg(`<path d="${head}" fill="var(--r-a400)"/>`, step, { delay: delay + 0.2 }));
  out.push(L(poly3([pt([2.4, 18.6], BX), pt([0.8, 17], BX)], P, false), { tone: "mid" }));
  void nose;
  // near wheels: tyre, rim, hub bolts
  for (const wy of wheelsY) {
    const FW = G.frameOf([x0 + W - 6, y0 + wy, z + tyre], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    out.push(S(G.disc(0, 6.6, tyre, FW, P), { tone: "hi", crease: "none" }));
    out.push(S(G.disc(6.6, 6.9, 5.6, FW, P), { tone: "mid", crease: "none" }));
    out.push(L(G.spokesOf(FW, 6.9, 1.6, 5.2, 5, P, { phase: 0.3 }), { tone: "mid" }));
    out.push(D(G.dotsOf(FW, 6.9, 1, 5, P, { all: true }), { size: 0.35, tone: "hi" }));
    // wheel arch on the body side
    const arch = Array.from({ length: 13 }, (_, i) => {
      const a = Math.PI * (i / 12);
      return pt([wy + Math.cos(a) * (tyre + 1.6), Math.max(4.5, tyre + Math.sin(a) * (tyre + 1.6))], BX);
    });
    out.push(L(poly3(arch, P, false), { tone: "mid" }));
  }
  // mirror
  out.push(S(k.slabOf({ x: x0 + W - 1, y: y0 + 72, w: 3.6, d: 4, r: 1 }, z + 22, 2.6, P, 3), { tone: "hi" }));
  return { svg: out.join(""), port, nose: [x0 + W / 2, y0 + 98, z + 14] };
}

// ---------------------------------------------------------------------------
// Interior furniture (drawn inside a window clip).
// ---------------------------------------------------------------------------
export function floorLamp(x, y, z, P, { height = 44, step = 0, delay = 0, reach = 30 } = {}) {
  const out = [];
  out.push(poolSvg([x, y, z], reach, P, { step, delay }));
  out.push(S(k.cylinder(x, y, 4.2, z, 1.2, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 0.6, z + 1.2, height - 10, P, 10), { tone: "mid", crease: "none" }));
  const F = G.frameOf([x, y, z + height - 10], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const shade = G.lathe([[0, 7.2], [9, 4.2], [9, 0.01]], F, P);
  out.push(S(shade, { tone: "mid" }));
  out.push(litSvg(`<path d="${shade.fill}" fill="url(#${scopeId()}-warm)"/>`, step, { delay }));
  out.push(litSvg(`<ellipse cx="${tenth(at([x, y, z + height - 10], P)[0])}" cy="${tenth(at([x, y, z + height - 10], P)[1])}" rx="${tenth(16 * k.cameraOf(P).k)}" ry="${tenth(12 * k.cameraOf(P).k)}" fill="url(#${scopeId()}-pool)"/>`, step, { delay }));
  return out.join("");
}

export function table(x, y, z, w, d, h, P) {
  const out = [];
  const legs = k.corners({ x, y, w, d }, 2).sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [lx, ly] of legs) out.push(S(k.slabOf({ x: lx - 0.6, y: ly - 0.6, w: 1.2, d: 1.2, r: 0.2 }, z, h - 1.4, P, 1), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x, y, w, d, r: 1 }, z + h - 1.4, 1.4, P, 3), { tone: "mid" }));
  return out.join("");
}

export function chair(x, y, z, P, { facing = "y" } = {}) {
  const out = [];
  const s = 9;
  for (const [lx, ly] of k.corners({ x, y, w: s, d: s }, 1.2)) out.push(S(k.slabOf({ x: lx - 0.4, y: ly - 0.4, w: 0.8, d: 0.8, r: 0.1 }, z, 10, P, 1), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x, y, w: s, d: s, r: 0.8 }, z + 10, 1.2, P, 2), { tone: "mid" }));
  const back = facing === "y" ? { x, y, w: s, d: 1.2, r: 0.3 } : { x, y, w: 1.2, d: s, r: 0.3 };
  out.push(S(k.slabOf(back, z + 11.2, 10, P, 2), { tone: "mid" }));
  return out.join("");
}

// A shelf/console unit standing against a wall inside a room.
export function sideboard(x, y, z, w, d, h, P) {
  const out = [S(k.slabOf({ x, y, w, d, r: 0.6 }, z, h, P, 2, 0.4), { tone: "mid" })];
  out.push(L(poly3([[x + w / 2, y + d, z + 1], [x + w / 2, y + d, z + h - 1]], P, false), { tone: "faint" }));
  return out.join("");
}

// ---------------------------------------------------------------------------
// Wall-mounted parts, on either visible face. `wall` is the wall plane, `a` the position
// along it, the part stands out toward +x (face "x") or +y (face "y").
// ---------------------------------------------------------------------------
const planOn = (face, wall, a0, width, depth, r = 0.6) => (face === "x" ? { x: wall, y: a0, w: depth, d: width, r } : { x: a0, y: wall, w: width, d: depth, r });

// A modular circuit breaker row on a DIN rail, on a "y" wall (plane y = wall).
// Each module is 3.6 wide; `main` modules at the start form the residual-current switch.
// Levers flip up at `step`, one after another (`stagger` s). Returns svg and the row's span.
export function breakerRow(x0, wall, zc, count, P, { step = 0, delay = 0, stagger = 0.09, main = 2, depth = 6, module = 3.6, h = 13 } = {}) {
  const out = [];
  const front = wall + depth;
  out.push(S(k.slabOf({ x: x0 - 1.5, y: wall, w: count * module + 3 + (main - 1) * module, d: 1.2, r: 0.2 }, zc - 2.6, 5.2, P, 1), { tone: "mid", crease: "none" }));
  let x = x0;
  for (let i = 0; i < count; i++) {
    const wide = i === 0 && main > 1 ? main : 1;
    const w = module * wide - 0.25;
    out.push(S(k.slabOf({ x, y: wall + 1, w, d: depth - 1, r: 0.3 }, zc - h / 2, h, P, 1), { tone: "hi", crease: "faint" }));
    out.push(L(poly3([wallPt("y", front, x + 0.3, zc + h / 2 - 2.6), wallPt("y", front, x + w - 0.3, zc + h / 2 - 2.6)], P, false), { tone: "faint" }));
    const lx = x + w / 2 - 0.7;
    out.push(`<path d="${poly3(quad("y", front + 0.02, lx - 0.3, lx + 1.7, zc - 3.4, zc + 3.4), P)}" fill="var(--anatomy-shade-0)"/>`);
    const lever = S(k.slabOf({ x: lx, y: front, w: 1.4, d: 1.8, r: 0.2 }, zc - 3.2, 2.6, P, 1), { tone: "hi", crease: "none" });
    out.push(moveSvg(lever, step, [0, 0, 3.6], P, { delay: delay + i * stagger }));
    const wz = zc - h / 2 + 2;
    out.push(`<path class="r-led" data-step="${step}" style="--r-delay:${(delay + i * stagger + 0.15).toFixed(2)}s" d="${poly3(quad("y", front + 0.02, x + w / 2 - 1, x + w / 2 + 1, wz, wz + 1.3), P)}"/>`);
    if (wide > 1) out.push(S(k.slabOf({ x: x + w - 2.4, y: front, w: 1.4, d: 0.6, r: 0.3 }, zc + 3.6, 1.4, P, 1), { tone: "mid", crease: "none" }));
    x += module * wide;
  }
  out.push(S(k.slabOf({ x: x0, y: front - 2.2, w: x - x0 - 0.25, d: 1.6, r: 0.2 }, zc + h / 2, 1.2, P, 1), { tone: "mid", crease: "none" }));
  return { svg: out.join(""), from: x0, to: x };
}

// A wall socket (prise) with a status LED.
export function socket(face, wall, a, z, P, { step = 0, delay = 0, double = false } = {}) {
  const out = [];
  const w = double ? 15 : 8;
  out.push(S(k.slabOf(planOn(face, wall, a - w / 2, w, 1.4, 1), z - 4, 8, P, 3, 0.4), { tone: "hi", crease: "faint" }));
  const F = wall + 1.4;
  const holes = double ? [a - 3.6, a + 3.6] : [a];
  for (const c of holes) {
    const ring = Array.from({ length: 20 }, (_, i) => wallPt(face, F + 0.02, c + Math.cos((i / 20) * Math.PI * 2) * 2.4, z + Math.sin((i / 20) * Math.PI * 2) * 2.4));
    out.push(`<path d="${poly3(ring, P)}" fill="var(--anatomy-shade-2)"/>` + L(poly3(ring, P), { tone: "lo" }));
    out.push(D([wallPt(face, F, c - 0.9, z), wallPt(face, F, c + 0.9, z)].map((p) => at(p, P)), { size: 0.4, tone: "hi" }));
  }
  out.push(ledSvg(wallPt(face, F, a + w / 2 - 1.4, z + 2.8), P, { step, delay, size: 0.45 }));
  return out.join("");
}

// A light switch plate with a pilot light.
export function lightSwitch(face, wall, a, z, P, { step = 0, delay = 0 } = {}) {
  const out = [S(k.slabOf(planOn(face, wall, a - 4, 8, 1.2, 1), z - 4, 8, P, 3, 0.4), { tone: "hi", crease: "faint" })];
  out.push(S(k.slabOf(planOn(face, wall + 1.2, a - 2.6, 5.2, 0.8, 0.6), z - 2.6, 5.2, P, 2), { tone: "hi", crease: "faint" }));
  out.push(ledSvg(wallPt(face, wall + 2, a, z - 1.6), P, { step, delay, size: 0.35, halo: 3 }));
  return out.join("");
}

// A wall lamp (applique) with the glow it throws on its wall.
export function wallLamp(face, wall, a, z, P, { step = 0, delay = 0 } = {}) {
  const out = [];
  out.push(wallGlowSvg(face, wall + 0.1, a, z, 30, P, { step, delay }));
  out.push(S(k.slabOf(planOn(face, wall, a - 2.5, 5, 1.4, 0.6), z - 3.5, 7, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf(planOn(face, wall + 1.4, a - 0.6, 1.2, 5, 0.3), z - 0.6, 1.2, P, 1), { tone: "mid", crease: "none" }));
  const F = G.frameOf(wallPt(face, wall + 7.5, a, z - 4), [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const shade = G.lathe([[0, 4.8], [7, 2.6], [7, 0.01]], F, P);
  out.push(S(shade, { tone: "mid" }));
  out.push(litSvg(`<path d="${shade.fill}" fill="url(#${scopeId()}-warm)"/>`, step, { delay }));
  return { svg: out.join(""), top: wallPt(face, wall + 0.7, a, z + 3.5) };
}

// A split air-conditioner / heat-pump indoor unit on an "x" wall.
export function splitUnit(wall, a0, z0, P, { step = 0, delay = 0, width = 64, height = 18, depth = 13 } = {}) {
  const out = [];
  const X = wall + depth;
  out.push(`<path class="iso-halo" d="${k.slabOf({ x: wall, y: a0 + 2, w: depth, d: width, r: 2 }, z0 - 3, height, P).fill}" style="filter:blur(6px);opacity:.2"/>`);
  out.push(S(k.slabOf({ x: wall, y: a0, w: depth, d: width, r: 3 }, z0, height, P, 6, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(poly3([wallPt("x", X, a0 + 3, z0 + 5), wallPt("x", X, a0 + width - 3, z0 + 5)], P, false), { tone: "faint" }));
  out.push(`<path class="r-led" data-step="${step}" style="--r-delay:${delay}s" d="${poly3(quad("x", X + 0.02, a0 + width - 16, a0 + width - 6, z0 + 9, z0 + 10.2), P)}"/>`);
  return { svg: out.join(""), top: [wall + depth / 2, a0 + width - 8, z0 + height], outlet: (t) => [X - 2, a0 + 8 + t * (width - 16), z0] };
}

// An electric water heater (ballon) on feet, with a thermostat cover and pilot light.
export function waterHeater(cx, cy, z, P, { step = 0, delay = 0, r = 17, height = 76 } = {}) {
  const out = [];
  const F = G.frameOf([cx, cy, z + 6], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: cx - r, y: cy - r, w: r * 2, d: r * 2, r }, z, 0.1, P)}"/>`);
  for (const [dx, dy] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].sort((a, b) => a[0] + a[1] - (b[0] + b[1]))) {
    out.push(S(k.cylinder(cx + dx * r, cy + dy * r, 1.4, z, 6.5, P, 12), { tone: "mid", crease: "none" }));
  }
  const dome = 9;
  const body = G.lathe([[0, 0], [0, r - 1.2], [1.2, r, 1], [height - dome, r, 1], [height - dome * 0.45, r * 0.84, 1], [height - 1, r * 0.34, 1], [height, 0.01]], F, P, { smooth: true });
  out.push(S(body, { tone: "mid" }));
  out.push(L(G.arcOf(F, 12, r, P) + G.arcOf(F, height - dome - 1.5, r, P), { tone: "faint" }));
  const c = [cx + Math.SQRT1_2 * (r + 0.2), cy + Math.SQRT1_2 * (r + 0.2)];
  out.push(S(k.slabOf({ x: c[0] - 3.6, y: c[1] - 3.6, w: 7.2, d: 7.2, r: 3.6 }, z + 14, 12, P, 6, 0.4), { tone: "hi" }));
  out.push(ledSvg([c[0] + 3, c[1] + 3, z + 22.5], P, { step, delay, size: 0.6 }));
  return { svg: out.join(""), top: [cx, cy, z + 6 + height] };
}
